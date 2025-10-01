import React from "react";
import ListIcon from "@mui/icons-material/List";
import AppsIcon from "@mui/icons-material/Apps";
import {
  Stack,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  TextField,
} from "@mui/material";
import SelectDropdown from "../../../../common/ui/SelectDropdown";
import { useQstnrAdmin } from "../useQstnrAdmin";
import dayjs from "dayjs";
import { useEffect } from "react";
import { getLookup } from "../../../../api/lookup";
import useAxios from "../../../../api/useAxios";

const QstnrFilter = () => {
  const {
    filters,
    updateFilter,
    clearFilters,
    handleViewChange,
    viewMode,
    questionnaireTypeOptions,
    setQuestionnaireTypeOptions,
    industryOptions,
    setIndustryOptions,
    industrySizeOptions,
    setIndustrySizeOptions,
    complianceOptions,
    setComplianceOptions,
    statusOptions,
    setStatusOptions,
  } = useQstnrAdmin();
  const axiosInstance = useAxios();

  useEffect(() => {
    async function fetchData() {
      try {
        const categories = ["QuestionnaireType", "Industry", "Size","ComplianceType", "QstnrStatus"];
        const responses = await Promise.all(
          categories.map((category) => getLookup(category, axiosInstance))
        );
        setQuestionnaireTypeOptions(responses[0]);
        setIndustryOptions(responses[1]);
        setIndustrySizeOptions(responses[2]);
        setComplianceOptions(responses[3]);
        setStatusOptions(responses[4]);
      } catch (error) {
        console.error("Error fetching lookup data:", error);
      }
    }
    fetchData();
  }, [axiosInstance]);

  // Format date for display in input (YYYY-MM-DD format)
  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    return dayjs(dateString).format("YYYY-MM-DD");
  };

  // Handle date change
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value;
    if (dateValue) {
      // Convert to ISO string for consistency with your existing logic
      const isoDate = dayjs(dateValue).toISOString();
      updateFilter("datePublished", isoDate);
    } else {
      updateFilter("datePublished", "");
    }
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ mt: 5, alignItems: "center", justifyContent: "space-between" }}
    >
      {/* Left side - Filters + Clear Button */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <SelectDropdown
          value={filters.Phase}
          onChange={(e) => updateFilter("Phase", e.target.value)}
          options={questionnaireTypeOptions}
          title="Questionnaire Type"
        />
        <SelectDropdown
          value={filters.industry}
          onChange={(e) => updateFilter("industry", e.target.value)}
          options={industryOptions}
          title="Industry"
        />
        <SelectDropdown
          value={filters.industrySize}
          onChange={(e) => updateFilter("industrySize", e.target.value)}
          options={industrySizeOptions}
          title="Industry Size"
        />
        <SelectDropdown
          value={filters.compliance}
          onChange={(e) => updateFilter("compliance", e.target.value)}
          options={complianceOptions}
          title="Compliance"
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ 
            fontSize: "14px", 
            color: "#666", 
            fontWeight: 500,
            minWidth: "100px",
            textAlign: "left"
          }}>
            Date Published
          </Box>
          <TextField
            type="date"
            value={formatDateForInput(filters.datePublished)}
            onChange={handleDateChange}
            variant="outlined"
            sx={{
              width: "160px",
              bgcolor: "white",
              borderRadius: "24px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "24px",
                height: "40px",
                border: "1px solid #e0e0e0",
                "&:hover": {
                  borderColor: "#b0b0b0",
                },
                "&.Mui-focused": {
                  borderColor: "#1976d2",
                },
              },
              "& .MuiInputBase-input": {
                padding: "8px 14px",
                fontSize: "14px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                display: "none",
              },
            }}
          />
        </Box>
        <SelectDropdown
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value)}
          options={statusOptions}
          title="Status"
        />
        <Button
          variant="outlined"
          onClick={clearFilters}
          sx={{
            border: "none",
            fontSize: "13px",
            color: "black",
            borderRadius: "50px",
          }}
        >
          Clear all
        </Button>
      </Box>
      <Box>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          aria-label="View Mode Toggle"
        >
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

export default QstnrFilter;