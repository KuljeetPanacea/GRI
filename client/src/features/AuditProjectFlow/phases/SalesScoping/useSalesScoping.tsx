import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  selectAllQuestionnaires,
  selectSelectedQuestionnaires,
} from "../../../../redux/salesScopingSlice";
import { RootState} from "../../../../redux/store";
import useAxios from "../../../../api/useAxios";
import { scopingOnboardAEPOC } from "../../../../api/project";

export const useSalesScoping = (pageSize: number) => {
  const axiosInstance = useAxios();
  const allQuestionnaires = useSelector(selectAllQuestionnaires);
  const selectedQuestionnaires = useSelector(selectSelectedQuestionnaires);
  const selectedProject = useSelector(
    (state: RootState) => state.projectView.selectedProject
  );
  const memoizedAllData = useMemo(
    () => allQuestionnaires || [],
    [allQuestionnaires]
  );
  const memoizedSelectedData = useMemo(
    () => selectedQuestionnaires || [],
    [selectedQuestionnaires]
  );

  const [currentPageAll, setCurrentPageAll] = useState(1);
  const [currentPageSelected, setCurrentPageSelected] = useState(1);
  const totalItemsAll = memoizedAllData.length;
  const totalPagesAll = Math.ceil(totalItemsAll / pageSize);

  const totalItemsSelected = memoizedSelectedData.length;
  const totalPagesSelected = Math.ceil(totalItemsSelected / pageSize);

  const paginatedAllData = useMemo(() => {
    const startIndex = (currentPageAll - 1) * pageSize;
    return memoizedAllData.slice(startIndex, startIndex + pageSize);
  }, [memoizedAllData, currentPageAll, pageSize]);

  const paginatedSelectedData = useMemo(() => {
    const startIndex = (currentPageSelected - 1) * pageSize;
    return memoizedSelectedData.slice(startIndex, startIndex + pageSize);
  }, [memoizedSelectedData, currentPageSelected, pageSize]);

    const handleSend = async () => {
      if (
        selectedProject?._id
      ) {
        try {
          const response = await scopingOnboardAEPOC(
            axiosInstance,
            selectedProject._id
          );
          console.log("Scoping Onboard AE POC Response:", response.data);
        } catch (error) {
          console.error("Failed to onboard AE POC:", error);
        }
      } else {
        console.error("Missing project ID or AE POC details.");
      }
    };
    

  return {
    paginatedAllData,
    paginatedSelectedData,
    currentPageAll,
    currentPageSelected,
    totalPagesAll,
    totalPagesSelected,
    totalItemsAll,
    totalItemsSelected,
    setCurrentPageAll,
    setCurrentPageSelected,
    handleSend,
  };
};
