import {
  Stack,
  Box,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  setClientStatusFilter,
  resetFilters,
  setViewMode,
  setOnboardingFilter,
  setIndustryFilter,
  setIndustrySizeFilter,
} from "../../../redux/clientManagementSlice";
import SelectDropdown from "../../../common/ui/SelectDropdown";
import { useDispatch } from "react-redux";
import ListIcon from "@mui/icons-material/List";
import AppsIcon from "@mui/icons-material/Apps";
import { useEffect, useState } from "react";
import useAxios from "../../../api/useAxios";
import { getLookup } from "../../../api/lookup";

// const calculateDateRanges = () => {
//   const now = new Date();
//   return {
//     lastWeek: new Date(now.setDate(now.getDate() - 7)).toISOString(),
//     lastMonth: new Date(now.setMonth(now.getMonth() - 1)).toISOString(),
//     lastSixMonths: new Date(now.setMonth(now.getMonth() - 6)).toISOString(),
//   };
// };

const ClientFilter = () => {
  const dispatch = useDispatch();
  const axiosInstance = useAxios()
  const { industry, industrySize, status } = useSelector((state: RootState) => state.clientManagement);
  const viewMode = useSelector(
    (state: RootState) => state.clientManagement.viewMode
  );
  const [selectedTimeline, setSelectedTimeline] = useState<string>("");
  // const dateRanges = calculateDateRanges();

  const handleOngoingClientsChange = (value: string) => {
    setSelectedTimeline(value); 
    let dateValue = ""; 

    if (value === "Last week") {
      dateValue = "lastWeek";
    } else if (value === "Last month") {
      dateValue = "lastMonth";
    } else if (value === "Last 6 months") {
      dateValue = "last6Months";
    }

    dispatch(setOnboardingFilter(dateValue));
  };

  const [industryOptions, setIndustryOptions] = useState<string[]>([])
  const [industrySizeOptions, setIndustrySizeOptions] = useState<string[]>([])
  const [statusOptions, setStatusOptions] = useState<string[]>([])
  const [timelineOptions, setTimelineOptions] = useState<string[]>([]);

    useEffect(() => {
      async function fetchData() {
        try {
          const categories = ["Industry", "Size", "Date", "Status"];
  
          const responses = await Promise.all(
            categories.map((category) => getLookup(category, axiosInstance))
          );
  
          setIndustryOptions(responses[0]);
          setIndustrySizeOptions(responses[1]);
          setTimelineOptions(responses[2]);
          setStatusOptions(responses[3]);
        } catch (error) {
          console.error("Error fetching lookup data:", error);
        }
      }
      
      fetchData();
    }, []);

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ mt: 5, alignItems: "center", justifyContent: "space-between" }}
    >
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        {/* Status Filter */}
        <SelectDropdown
          value={industry}
          onChange={(e) => dispatch(setIndustryFilter(e.target.value))}
          options={industryOptions}
          title="Industry"
          isMultiple={false}
        />
        <SelectDropdown
          value={industrySize}
          onChange={(e) => dispatch(setIndustrySizeFilter(e.target.value))}
          options={industrySizeOptions}
          title="Industry Size"
          isMultiple={false}
        />
        <SelectDropdown
          value={selectedTimeline}
          onChange={(e) => handleOngoingClientsChange(e.target.value)}
          options={timelineOptions}
          title="Onboarding date"
          isMultiple={false}
        />
        <SelectDropdown
          value={status}
          onChange={(e) => dispatch(setClientStatusFilter(e.target.value))}
          options={statusOptions}
          title="Status"
          isMultiple={false}
        />

        <Button
          variant="outlined"
          onClick={() => 
            {
              dispatch(resetFilters());
              setSelectedTimeline("");
            }}
          sx={{
            border: "none",
            fontSize: "13px",
            color: "black",
            borderRadius: "50px",
          }}
        >
          Clear all
        </Button>
      </Stack>

      <Box>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newView) => {
            if (newView !== null) {
              console.log("View Mode Changed to: ", newView);
              dispatch(setViewMode(newView));
            }
          }}
          aria-label="View Mode Toggle"
          sx={{
            borderRadius: "24px",
            backgroundColor: "#f5f5f5",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            height: "40px",
          }}
        >
          {/* List View Button */}
          <ToggleButton
            value="list"
            aria-label="List View"
            sx={{
              textTransform: "none",
              borderRadius: "24px 0 0 24px",
              backgroundColor: viewMode === "list" ? "#d32f2f" : "#ffffff",
              color: viewMode === "list" ? "#fff" : "#000",
              "&:hover": {
                backgroundColor: "#c62828",
                color: "#fff",
              },
            }}
          >
            <ListIcon />
            List
          </ToggleButton>

          {/* Grid View Button */}
          <ToggleButton
            value="grid"
            aria-label="Grid View"
            sx={{
              textTransform: "none",
              borderRadius: "0 24px 24px 0",
              backgroundColor: viewMode === "grid" ? "#d32f2f" : "#ffffff",
              color: viewMode === "grid" ? "#fff" : "#000",
              "&:hover": {
                backgroundColor: "#c62828",
                color: "#fff",
              },
            }}
          >
            <AppsIcon />
            Grid
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Stack>
  );
};

export default ClientFilter;
