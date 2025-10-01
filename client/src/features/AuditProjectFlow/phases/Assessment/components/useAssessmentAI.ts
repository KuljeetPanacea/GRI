import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import {
  openAISummaryDialog,
  setAISummaryLoading,
  setAISummary,
  setAISummaryError,
  selectSelectedControl,
} from "../../../../../redux/assessmentSlice";
import useAxios from "../../../../../api/useAxios";
import { GenerateAIResponse } from "../../../../../api/AssetControl";
import reqConfig from "../../ComplianceReport/reqConfig";

type RequirementPart = {
  requirements?: Array<{
    reqDesc?: string;
    reqName?: string;
    subReq?: Array<{
      desc?: string;
      controls?: Array<{
        title?: string;
        desc?: string;
      }>;
    }>;
  }>;
};

// Helper function to find requirement, sub-requirement, and control description by control title
export function findRequirementInfoByControlTitle(title: string) {
  const normalizedTitle = title.replace(/^Control-/, "");

  for (const part of Object.values(reqConfig) as RequirementPart[]) {
    if (!part || !Array.isArray(part.requirements)) continue;

    for (const req of part.requirements) {
      if (req.subReq && Array.isArray(req.subReq)) {
        for (const subReq of req.subReq) {
          if (subReq.controls && Array.isArray(subReq.controls)) {
            for (const control of subReq.controls) {
              if (control.title === normalizedTitle) {
                return {
                  requirement: req.reqDesc || req.reqName || "",
                  subRequirement: subReq.desc || "",
                  controlDescription: control.desc || "",
                };
              }
            }
          }
        }
      }
    }
  }
  return { requirement: "", subRequirement: "", controlDescription: "" };
}

export default function useAssessmentAI() {
  const dispatch = useDispatch();
  const axiosInstance = useAxios();
  const selectedControl = useSelector(selectSelectedControl);
  const selectedProject = useSelector((state: RootState) => state.projectView.selectedProject);

  const handleGenerateAI = async (deviceType: string, name: string) => {
    try {
      dispatch(openAISummaryDialog());
      dispatch(setAISummaryLoading(true));

      const { requirement, subRequirement, controlDescription } =
        selectedControl?.title
          ? findRequirementInfoByControlTitle(selectedControl.title)
          : { requirement: "", subRequirement: "", controlDescription: "" };

      const response = await GenerateAIResponse(
        axiosInstance,
        selectedProject?._id || "",
        selectedControl?.title || "",
        name,
        deviceType,
        requirement,
        subRequirement,
        controlDescription
      );

      dispatch(setAISummary(response));
    } catch (error) {
      dispatch(setAISummaryError("Failed to generate AI response"));
      console.error("Error generating AI response:", error);
    } finally {
      dispatch(setAISummaryLoading(false));
    }
  };

  return { handleGenerateAI };
}


