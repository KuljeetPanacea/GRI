import React, { useState } from "react";
import SelectDropdown from "../../common/ui/SelectDropdown";
import style from "./styles/PLHeader.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  resetProjectFilters,
  setOngoingProjectsFilter,
  setProjectStatusFilter,
} from "../../redux/projectManagementSlice";

const calculateDateRanges = () => {
  return {
    lastWeek: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastMonth: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    lastSixMonths: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString(),
  };
};

const PLFilters: React.FC = () => {
  const dispatch = useDispatch();
  const { projectStatus } = useSelector((state: RootState) => state.projectManagement);
  const [selectedTimeline, setSelectedTimeline] = useState<string>("");
  
  const dateRanges = calculateDateRanges();

  const handleOngoingProjectsChange = (value: string) => {
    setSelectedTimeline(value); 
    
    let dateValue = "";
    if (value === "Last week") dateValue = dateRanges.lastWeek;
    else if (value === "Last month") dateValue = dateRanges.lastMonth;
    else if (value === "Last 6 months") dateValue = dateRanges.lastSixMonths;

    dispatch(setOngoingProjectsFilter(dateValue));
  };

  return (
    <div className={style.PLFilters}>
      <SelectDropdown
        value={projectStatus}
        onChange={(e) => dispatch(setProjectStatusFilter(e.target.value))}
        title="Project Status"
        options={["Active", "Inactive", "In-Progress"]}
      />
      <SelectDropdown
        value={selectedTimeline}
        onChange={(e) => handleOngoingProjectsChange(e.target.value)}
        title="Ongoing Projects"
        options={["Last week", "Last month", "Last 6 months"]}
      />
      <button onClick={() => {
        dispatch(resetProjectFilters())
        setSelectedTimeline('');
        }} style={{border:0, background:'transparent', cursor:'pointer'}}>
        X Clear all
      </button>
    </div>
  );
};

export default PLFilters;
