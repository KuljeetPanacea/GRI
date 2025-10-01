// answersData.ts
import { PCIDSSAnswers } from "./types";

export const answersData: PCIDSSAnswers = {
  findings: [
    {
      controlNo: "1.1.1",
      controlAssessmentFinding: "In Place",
      compensatingControl: false,
      customizedApproach: false,
      detailed_finding:
        "Configuration standards have been defined, implemented, and maintained.",
      evidences: [
        {
          name: "image1.jpg",
          url: "PI-dev-temp/680725c1dc81c92ab815af8c/6858ed8a800fc9af94ca83c2/cde/scope/image1.jpg",
          evidenceCategory: "document",
          testingProcedure: "1.1.1",
          refName: "Doc-1",
        },
        {
          name: "image2.jpg",
          url: "PI-dev-temp/680725c1dc81c92ab815af8c/6858ed8a800fc9af94ca83c2/cde/scope/image2.jpg",
          evidenceCategory: "interview",
          refName: "Int-01",
          testingProcedure: "1.1.1",
        },
      ],
    },
    {
      controlNo: "1.1.2",
      controlAssessmentFinding: "In Place",
      compensatingControl: false,
      customizedApproach: false,
      detailed_finding:
        "Roles and responsibilities are properly documented and assigned.",
      evidences: [
        {
          name: "image3.jpg",
          url: "PI-dev-temp/680725c1dc81c92ab815af8c/6858ed8a800fc9af94ca83c2/cde/scope/image3.jpg",
          evidenceCategory: "document",
          refName: "Doc-2",
          testingProcedure: "1.1.2a",
        },
        {
          name: "image4.jpg",
          url: "PI-dev-temp/680725c1dc81c92ab815af8c/6858ed8a800fc9af94ca83c2/cde/scope/image4.jpg",
          evidenceCategory: "interview",
          refName: "Int-02",
          testingProcedure: "1.1.2b",
        },
      ],
    },
    {
      controlNo: "1.2.1",
      controlAssessmentFinding: "Not Applicable",
      compensatingControl: false,
      customizedApproach: false,
      detailed_finding: "Desc",
      evidences: [
        {
          name: "image5.jpg",
          url: "PI-dev-temp/680725c1dc81c92ab815af8c/6858ed8a800fc9af94ca83c2/cde/scope/image5.jpg",
          evidenceCategory: "others",
          refName: "Evidence-1",
          testingProcedure: "1.2.1a",
        },
        {
          name: "image6.jpg",
          url: "PI-dev-temp/680725c1dc81c92ab815af8c/6858ed8a800fc9af94ca83c2/cde/scope/image6.jpg",
          evidenceCategory: "others",
          refName: "Evidence-2",
          testingProcedure: "1.2.1b",
        },
      ],
    },
  ],
};
