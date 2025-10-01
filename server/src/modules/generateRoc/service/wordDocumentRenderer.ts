import * as fs from "fs";
import * as path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { Injectable } from "@nestjs/common";

@Injectable()
export class WordDocumentRenderer {
  private readonly templatePath = path.join(__dirname, "../templates", "roc_template.docx");

  render(context: Record<string, any>): Buffer {
    const templateContent = fs.readFileSync(this.templatePath, "binary");
    const zip = new PizZip(templateContent);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    doc.render(context);

    return doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 9 },
    });
  }
}
