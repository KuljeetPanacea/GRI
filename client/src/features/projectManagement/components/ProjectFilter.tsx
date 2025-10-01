import {
  Stack,
  Button,
  Box,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import SelectDropdown from "../../../common/ui/SelectDropdown";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import ListIcon from "@mui/icons-material/List";
import AppsIcon from "@mui/icons-material/Apps";
import {
  resetProjectFilters,
  setProjectStatusFilter,
  setViewMode,
  setProjectStageFilter,
  setOngoingProjectsFilter,
  setQsaFilter,
} from "../../../redux/projectManagementSlice";
import styles from "./ProjectFilter.module.css";
import { useEffect, useState } from "react";
import { getUserByRole } from "../../../api/user";
import useAxios from "../../../api/useAxios";
import { User } from "../../../redux/userManagementSlice";
import { getLookup } from "../../../api/lookup";

const calculateDateRanges = () => {
  const now = new Date();
  return {
    lastWeek: new Date(now.setDate(now.getDate() - 7)).toISOString(),
    lastMonth: new Date(now.setMonth(now.getMonth() - 1)).toISOString(),
    lastSixMonths: new Date(now.setMonth(now.getMonth() - 6)).toISOString(),
  };
};

const ProjectFilter = () => {
  const dispatch = useDispatch();
  const { projectStatus, projectStage, viewMode, qsa } = useSelector(
    (state: RootState) => state.projectManagement
  );
  const [selectedTimeline, setSelectedTimeline] = useState<string>("");

  const dateRanges = calculateDateRanges();
  const handleOngoingProjectsChange = (value: string) => {
    setSelectedTimeline(value);
    let dateValue = "";

    if (value === "Last week") {
      dateValue = dateRanges.lastWeek;
    } else if (value === "Last month") {
      dateValue = dateRanges.lastMonth;
    } else if (value === "Last 6 months") {
      dateValue = dateRanges.lastSixMonths;
    }

    dispatch(setOngoingProjectsFilter(dateValue));
  };

  const axiosInstance = useAxios();
  const [QSA, setQSA] = useState<string[]>([]);
  const [projectStatusOptions, setProjectStatusOptions] = useState<string[]>(
    []
  );
  const [projectStageOptions, setProjectStageOptions] = useState<string[]>([]);
  const [timelineOption, setTimelineOptions] = useState<string[]>([]);

  const fetchQSA = async () => {
    try {
      const responseOfQSA = await getUserByRole(axiosInstance, "QSA");

      const QSAvalues = responseOfQSA.map((user: User) => ({
        label: `${user.name} (${user.email})`,
        value: user.id,
      }));

      setQSA(QSAvalues);
    } catch (error) {
      console.error("Error fetching QSA:", error);
    }
  };

  useEffect(() => {
    fetchQSA();
    async function fetchData() {
      try {
        const categories = ["ProjectStatus", "ProjectStage", "Date"];

        const responses = await Promise.all(
          categories.map((category) => getLookup(category, axiosInstance))
        );

        setProjectStatusOptions(responses[0]);
        setProjectStageOptions(responses[1]);
        setTimelineOptions(responses[2]);
      } catch (error) {
        console.error("Error fetching lookup data:", error);
      }
    }

    fetchData();

    return () => {
      dispatch(resetProjectFilters());
    };
  }, [axiosInstance]);

  return (
    <Stack direction="row" spacing={2} className={styles.filterContainer}>
      <Stack direction="row" spacing={2} className={styles.filterOptions}>
        <SelectDropdown
          value={projectStatus}
          onChange={(e) => dispatch(setProjectStatusFilter(e.target.value))}
          options={projectStatusOptions}
          title="Status"
        />

        <SelectDropdown
          value={projectStage}
          onChange={(e) => dispatch(setProjectStageFilter(e.target.value))}
          options={projectStageOptions}
          title="Project Stage"
        />

        <SelectDropdown
          value={selectedTimeline}
          onChange={(e) => handleOngoingProjectsChange(e.target.value)}
          options={timelineOption}
          title="Ongoing Projects"
        />

        <SelectDropdown
          value={qsa}
          onChange={(e) => dispatch(setQsaFilter(e.target.value))}
          options={QSA}
          title="QSA"
        />

        <Button
          variant="outlined"
          onClick={() => {
            dispatch(resetProjectFilters());
            setSelectedTimeline(""); // <-- Reset local state too!
          }}
          className={styles.clearButton}
        >
          X Clear all
        </Button>
      </Stack>

      <Box>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(event, newView) => {
            if (newView !== null) {
              console.log("View Mode Changed to: ", newView, event);
              dispatch(setViewMode(newView));
            }
          }}
          aria-label="View Mode Toggle"
          className={styles.toggleGroup}
        >
          <ToggleButton
            value="list"
            aria-label="List View"
            className={`${styles.toggleButton} ${
              viewMode === "list" ? styles.active : ""
            }`}
          >
            <ListIcon
              className={`${styles.toggleIcon} ${
                viewMode === "list" ? styles.activeIcon : ""
              }`}
            />
          </ToggleButton>

          <ToggleButton
            value="grid"
            aria-label="Grid View"
            className={`${styles.toggleButton} ${
              viewMode === "grid" ? styles.active : ""
            }`}
          >
            <AppsIcon
              className={`${styles.toggleIcon} ${
                viewMode === "grid" ? styles.activeIcon : ""
              }`}
            />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Stack>
  );
};

export default ProjectFilter;
