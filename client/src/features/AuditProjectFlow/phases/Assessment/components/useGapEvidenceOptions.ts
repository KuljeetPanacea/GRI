/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import useAxios from "../../../../../api/useAxios"; // adjust path as per your structure
import {
    getNewEvidence,
    getOldEvidence,
} from "../../../../../api/project";
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { selectedDeviceKey, selectSelectedControl, setSelectedNewEvidences, setSelectedOldEvidences } from "../../../../../redux/assessmentSlice";

export const useGapEvidenceOptions = () => {
  const axiosInstance = useAxios();
  const selectedControl = useSelector(selectSelectedControl) ;
  const deviceRefKey = useSelector(selectedDeviceKey);
  const dispatch = useDispatch();
  
  const [statusOptions] = useState<string[]>([
    "Yet to send",
    "Resolved",
    "Pending Client",
    "Pending Auditor",
  ]);

  const fetchEvidenceOptions = async () => {
    if (!selectedControl?.title || !deviceRefKey) return;
  
    try {
      const [newRes, oldRes] = await Promise.all([
        getNewEvidence(axiosInstance, selectedControl.title, deviceRefKey.split("_")[1]),
        getOldEvidence(axiosInstance, selectedControl.title, deviceRefKey.split("_")[1]),
      ]);
      dispatch(setSelectedOldEvidences(oldRes));
      dispatch(setSelectedNewEvidences(newRes));
    } catch (err) {
      console.error("Failed to load evidence options", err);
    }
  };
  

  return {
    statusOptions,
    fetchEvidenceOptions
  };
};
