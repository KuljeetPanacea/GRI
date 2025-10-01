import { Button, Stack } from "@mui/material";
import SelectDropdown from "../../../common/ui/SelectDropdown";
import {
  setStatusFilter,
  resetFilters,
  setRoleFilter,
  setUsersOnboarded,
} from "../../../redux/userManagementSlice";
import { ToggleButton, ToggleButtonGroup, Box } from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import AppsIcon from "@mui/icons-material/Apps";
import { useDispatch, useSelector } from "react-redux";
import { setViewMode } from "../../../redux/userManagementSlice";
import { RootState } from "../../../redux/store";
import { getLookup } from "../../../api/lookup";
import { useEffect, useState } from "react";
import useAxios from "../../../api/useAxios";

const UserFilter = () => {
  const dispatch = useDispatch();
  const axiosInstance = useAxios();
  const { status, roles } = useSelector((state: RootState) => state.userManagement);
  const viewMode = useSelector(
    (state: RootState) => state.userManagement.viewMode
  );
  const [selectedTimeline, setSelectedTimeline] = useState<string>("");
  const [statusOptions, setStatusOptions] = useState<string[]>([])
  const [roleOptions, setRoleOptions] = useState<string[]>([])
  const [timelineOptions, setTimelineOptions] = useState<string[]>([])

      async function fetchData() {
      try {
        const categories = ["Status", "Role", "Date"];

        const responses = await Promise.all(
          categories.map((category) => getLookup(category, axiosInstance))
        );

        setStatusOptions(responses[0]);
        setRoleOptions(responses[1]);
        setTimelineOptions(responses[2]);
      } catch (error) {
        console.error("Error fetching lookup data:", error);
      }
    }

  useEffect(() => {
    fetchData();
  }, []);


  
  const handleUsersOnboarded = (value: string) => {
    setSelectedTimeline(value);
    let dateValue = ""; 

    if (value === "Last week") {
      dateValue = "lastWeek";
    } else if (value === "Last month") {
      dateValue = "lastMonth";
    } else if (value === "Last 6 months") {
      dateValue = "last6Months";
    }

    dispatch(setUsersOnboarded(dateValue));
  }


  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ mt: 5, alignItems: "center", justifyContent: "space-between" }}
    >
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        {/* Role Filter */}
        <SelectDropdown
          value={roles}
          onChange={(e) => dispatch(setRoleFilter(e.target.value))}
          options={roleOptions}
          title="Role"
        />

        {/* Status Filter */}
        <SelectDropdown
          value={status}
          onChange={(e) => {
            console.log('Selected status:', e.target.value);
            dispatch(setStatusFilter(e.target.value));
          }}
          options={statusOptions}
          title="Status"
          isMultiple={false}
        />

        {/* Users onboarded Filer*/}

        <SelectDropdown
                  value={selectedTimeline}
                  onChange={(e) => handleUsersOnboarded(e.target.value)}
                  options={timelineOptions}
                  title="Users onboarded"
                />
        

        {/* Clear Filters Button */}
        <Button
          variant="outlined"
          onClick={() => {
            dispatch(resetFilters())
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

export default UserFilter;
