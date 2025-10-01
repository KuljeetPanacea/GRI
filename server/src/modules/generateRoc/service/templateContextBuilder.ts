import * as fs from "fs";
import * as path from "path";
import { Injectable } from "@nestjs/common";
import { RocData } from "./rocDataFetcher";
import { EvidenceDto } from "src/modules/assessmentTask/dtos/assessmentTask.dto";
import { AssessorResponseDto } from "src/modules/appendix/dtos/appendix-a.dto";

// Constants used for representing checkbox states and default values
const CHECKBOX_CHECKED = "☑";
const CHECKBOX_UNCHECKED = "☐";
const DEFAULT_PLACEHOLDER = "To be filled";

// Map of internal finding keys to human-readable strings
const FINDINGS_MAP = {
  InPlace: "In Place",
  NA: "Not Applicable",
  NotTested: "Not Tested",
  NotInPlace: "Not in Place",
} as const;

// Type representing the object passed to the DOCX template
interface TemplateContext {
  [key: string]: any;
}

// Shape of grouped evidence data
interface GroupedEvidence {
  document: string[];
  interview: string[];
  others: string[];
}

// Mapping definition for template variables
type MappingEntry =
  | string // simple direct mapping to a field in RocData
  | { repeat: true; source: string; fields: Record<string, string> }; // repeated block mapping

@Injectable()
export class TemplateContextBuilder {
  // Path to the JSON file defining the template variable mappings
  private readonly mappingPath = path.join(__dirname, "../wordTemplateMapping.json");

  /**
   * Build the complete context object for a DOCX template.
   * This:
   *  1. Loads the mapping configuration
   *  2. Populates the variables from RocData
   *  3. Adds special computed sections (findings, appendix, legacy data)
   */
  build(rocData: RocData): TemplateContext {
    const mapping = this.loadMapping();
    const ctx: TemplateContext = {};

    // Populate context from mapping file
    for (const [varName, entry] of Object.entries(mapping)) {
      ctx[varName] = this.processMapping(rocData, entry as MappingEntry, varName);
    }

    // Add extra computed data
    this.addSpecialData(ctx, rocData);
    return ctx;
  }

  // === CORE HELPERS ===

  /** Loads the mapping JSON file into memory */
  private loadMapping() {
    return JSON.parse(fs.readFileSync(this.mappingPath, "utf-8"));
  }

  /**
   * Processes a single mapping entry and returns its value.
   * Supports:
   *  - Direct string path lookups
   *  - Repeating table rows (repeat: true)
   *  - Default placeholders when data is missing
   */
  private processMapping(rocData: RocData, entry: MappingEntry, varName: string) {
    if (typeof entry === "string") {
      const value = this.resolvePath(rocData, entry);
      return this.isCheckboxField(varName)
        ? this.checkbox(value)
        : value ?? DEFAULT_PLACEHOLDER;
    }

    if (entry.repeat) {
      const sourceData = this.resolvePath(rocData, entry.source);
      if (Array.isArray(sourceData)) {
        return sourceData.map((item) => this.mapRow(item, entry.fields));
      }
      if (sourceData && typeof sourceData === "object") {
        return Object.entries(sourceData).map(([key, item]) =>
          this.mapRow({ ...(item as object), key }, entry.fields)
        );
      }
      return [];
    }

    return DEFAULT_PLACEHOLDER;
  }

  /** Maps a row's fields based on mapping definition */
  private mapRow(item: any, fields: Record<string, string>) {
    return Object.entries(fields).reduce((acc, [key, path]) => {
      const val = this.resolvePath(item, path) ?? DEFAULT_PLACEHOLDER;
      acc[key] = this.isCheckboxField(key) ? this.checkbox(val) : val;
      return acc;
    }, {} as Record<string, any>);
  }

  // === SPECIAL DATA ENRICHMENT ===

  /** Adds all computed / enriched data sections into the template context */
  private addSpecialData(ctx: TemplateContext, rocData: RocData) {
    this.addControlFindings(ctx, rocData);
    this.addAppendixControls(ctx, rocData);
    this.addLegacyFindings(ctx, rocData);
  }

  /**
   * Adds control findings (Part 2) into context:
   *  - Checkbox values for findings
   *  - Compensating/customized flags
   *  - Detailed findings
   *  - Evidence lists grouped by procedure type
   */
  private addControlFindings(ctx: TemplateContext, rocData: RocData) {
    rocData.controlFindings?.forEach((control) => {
      const num = this.extractControlNumber(control.controlNo);
      if (!num) return;

      const base = `C-${num}`;
      this.setCheckboxMap(ctx, base, control.controlAssessmentFinding, FINDINGS_MAP);
      ctx[`${base}-compensatingControl`] = this.checkbox(control.compensatingControl);
      ctx[`${base}-customizedApproach`] = this.checkbox(control.customizedApproach);
      ctx[`${base}-detailed_finding`] = control.detailed_finding || "";

      const evidences = this.groupEvidences(control.evidences || [], true);
      for (const [tp, cat] of Object.entries(evidences)) {
        const safeTp = tp === "default" ? "general" : tp;
        ctx[`T-${safeTp}-evidence-document`] = cat.document.join(", ");
        ctx[`T-${safeTp}-evidence-interview`] = cat.interview.join(", ");
        ctx[`T-${safeTp}-evidence-other`] = cat.others.join(", ");
      }
    });
  }

  /**
   * Adds appendix controls (Appendix A) into context:
   *  - Checkbox mappings for findings
   *  - Compensating/customized flags
   *  - Assessment finding descriptions
   *  - Evidence lists
   */
  private addAppendixControls(ctx: TemplateContext, rocData: RocData) {
    rocData.appendixData?.[0]?.controls?.forEach((control) => {
      const controlId = control.title?.trim();
      if (!controlId?.startsWith("A")) return;

      const baseId = `A-${controlId.substring(1)}`;
      this.setCheckboxMap(ctx, baseId, control.assessmentFinding, FINDINGS_MAP);
      ctx[`${baseId}-compensatingControl`] = this.checkbox(control.compensatingControl);
      ctx[`${baseId}-customizedApproach`] = this.checkbox(control.customizedApproach);
      ctx[`${baseId}-assessmentFindingDesc`] = control.assessmentFindingDesc || DEFAULT_PLACEHOLDER;

      const evidences = this.groupAppendixEvidences(control.assessorResponse || []);
      const ev = evidences.default || { document: [], interview: [], others: [] };
      ctx[`T-${controlId}-evidence-document`] = ev.document.join(", ") || DEFAULT_PLACEHOLDER;
      ctx[`T-${controlId}-evidence-interview`] = ev.interview.join(", ") || DEFAULT_PLACEHOLDER;
      ctx[`T-${controlId}-evidence-other`] = ev.others.join(", ") || DEFAULT_PLACEHOLDER;
    });
  }

  /**
   * Adds older "legacy" findings data (from Part One contact info)
   * into the template context
   */
  private addLegacyFindings(ctx: TemplateContext, rocData: RocData) {
    const findings = rocData.partOneData?.contactInfoData?.assessmentFindings || {};
    for (const [req, data] of Object.entries(findings)) {
      const prefix = this.extractRequirementPrefix(req);
      if (!prefix) continue;

      const { finding, compensatingControl, customizedApproach } = data as any;
      this.mapFindingCheckboxes(ctx, `${prefix}_`, finding);
      ctx[`${prefix}_Compensating_Yes`] = this.checkbox(compensatingControl);
      ctx[`${prefix}_Customized_Yes`] = this.checkbox(customizedApproach);
    }
  }

  // === CHECKBOX + FINDING HELPERS ===

  /** Sets Yes/No checkboxes for a finding value */
  private mapFindingCheckboxes(ctx: TemplateContext, base: string, finding: string) {
    if (!finding) return;
    const map: Record<string, any> = {
      InPlace_Yes: "InPlace",
      NA_Yes: "NA",
      NotTested_Yes: "NotTested",
      NotInPlace_Yes: "NotInPlace",
    };
    this.setCheckboxMap(ctx, base, finding, map);
  }

  /** Helper to set multiple checkbox fields based on a value-match map */
  private setCheckboxMap(
    ctx: TemplateContext,
    base: string,
    value: any,
    map: Record<string, any>
  ) {
    for (const [suffix, expected] of Object.entries(map)) {
      const separator = base.endsWith("_") ? "" : base.includes("-") ? "-" : "_";
      ctx[`${base}${separator}${suffix}`] = this.checkbox(value === expected);
    }
  }

  /** Returns the appropriate checkbox symbol for a truthy/falsy value */
  private checkbox(val: any) {
    return val ? CHECKBOX_CHECKED : CHECKBOX_UNCHECKED;
  }

  /** Detects whether a field name is intended as a Yes/No checkbox */
  private isCheckboxField(name: string) {
    return /Yes$|No$/.test(name);
  }

  // === PATH & ID HELPERS ===

  /** Resolves a nested property path like "a.b[0].c" safely */
  private resolvePath(obj: any, p: string) {
    return p.split(".").reduce((o, k) => {
      const match = k.match(/^(.+)\[(\d+)\]$/);
      return match ? o?.[match[1]]?.[+match[2]] : o?.[k];
    }, obj);
  }

  /** Extracts control number from an ID like "Control-1.2.3" */
  private extractControlNumber(controlNo: string) {
    return /^Control-(.+)$/.exec(controlNo)?.[1] || null;
  }

  /** Gets prefix for requirement IDs (R# or A#) */
  private extractRequirementPrefix(req: string) {
    if (req.startsWith("Requirement ")) return `R${req.split(" ")[1]}`;
    if (req.startsWith("Appendix ")) return `A${req.split(" ")[1]}`;
    return null;
  }

  // === EVIDENCE GROUPING HELPERS ===

  /**
   * Groups evidences into categories (document/interview/others)
   * Optionally groups by testing procedure if `byProcedure` is true
   */
  private groupEvidences(evidences: EvidenceDto[], byProcedure = false) {
    const empty = (): GroupedEvidence => ({ document: [], interview: [], others: [] });
    if (!byProcedure) {
      const res = empty();
      evidences.forEach((e) => {
        const name = e.refName || e.name || "Unnamed Evidence";
        const cat = e.evidenceCategory?.toLowerCase();
        (cat === "document" ? res.document : cat === "interview" ? res.interview : res.others).push(name);
      });
      return { default: res };
    }
    return evidences.reduce((acc, e) => {
      const key = e.testingProcedure || "default";
      acc[key] ||= empty();
      const cat = e.evidenceCategory?.toLowerCase();
      const name = e.refName || e.name || "Unnamed Evidence";
      (cat === "document" ? acc[key].document : cat === "interview" ? acc[key].interview : acc[key].others).push(name);
      return acc;
    }, {} as Record<string, GroupedEvidence>);
  }

  /**
   * Groups appendix evidences by reportingInstructionId,
   * then categorizes into document/interview/others
   */
  private groupAppendixEvidences(evidences: AssessorResponseDto[]) {
    const empty = (): GroupedEvidence => ({ document: [], interview: [], others: [] });
    return evidences.reduce((acc, e) => {
      const key = e.reportingInstructionId?.trim() || "default";
      acc[key] ||= empty();
      const cat = e.evidenceCategory?.toLowerCase();
      const name = e.refName || "Unnamed Evidence";
      (cat === "document" ? acc[key].document : cat === "interview" ? acc[key].interview : acc[key].others).push(name);
      return acc;
    }, {} as Record<string, GroupedEvidence>);
  }
}
