import {
  Dialog,
  DialogContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import TextInput from "../../../common/ui/TextInput";
import SelectDropdown from "../../../common/ui/SelectDropdown";
import styles from "./AddNewClient.module.css"; // Import the CSS module
import useClientManagement from "../useClientManagement";
import { useEffect, useState } from "react";
import useAxios from "../../../api/useAxios";
import { getLookup } from "../../../api/lookup";
import { resetFilters } from "../../../redux/clientManagementSlice";

const AddNewClient = () => {
  const open = useSelector(
    (state: RootState) => state.clientmodal.isAddClientModalOpen
  );
  const {
    clientName,
    setClientName,
    handleClose,
    businessName,
    setBusinessName,
    demography,
    handleCreateClient,
    setDemography,
    industry,
    setIndustry,
    businessEntity,
    setBusinessEntity,
    entitySize,
    setEntitySize,
    websiteLink,
    setWebsiteLink,
    companyLogo,
    setCompanyLogo,
    pocName,
    setPocName,
    pocContactNumber,
    setPocContactNumber,
    pocEmailId,
    setPocEmailId,
    isEditMode,
    demographyOptions,
    setDemographyOptions,
    entitySizeOptions,
    setEntitySizeOptions,
    businessEntityOptions,
    setBusinessEntityOptions,
    industryOptions,
    setIndustryOptions,
    handleFieldChange,
    leadershipContactNo,
    leadershipEmailId,
    leadershipName,
    setLeadershipContactNo,
    setLeadershipEmailId,
    setLeadershipName,
  } = useClientManagement();

  const axiosInstance = useAxios();
  const [pocNumberError, setPocNumberError] = useState("");
  const [leadershipNumberError, setLeadershipNumberError] = useState("");
  const [websiteError, setWebsiteError] = useState("");
  useEffect(() => {
    async function fetchData() {
      try {
        const categories = ["Demography", "Size", "BusinessEntity", "Industry"];

        const responses = await Promise.all(
          categories.map((category) => getLookup(category, axiosInstance))
        );

        setDemographyOptions(responses[0]);
        setEntitySizeOptions(responses[1]);
        setBusinessEntityOptions(responses[2]);
        setIndustryOptions(responses[3]);
      } catch (error) {
        console.error("Error fetching lookup data:", error);
      }
    }
    resetFilters();
    fetchData();
  }, []);

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="md"
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
          height: "90%",
          width: "80%",
        },
      }}
    >
      <Box className={styles.dialogHeader}>
        <Typography variant="h3" className={styles.dialogTitle}>
          {isEditMode ? "Edit Client" : "Add New Client"}
        </Typography>
        <IconButton aria-label="close" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent className={styles.dialogContent}>
        <Box className={styles.formRow}>
          {/* First row */}
          <Box className={styles.formField}>
            <Typography variant="body1" className={styles.formFieldLabel}>
              Client name
            </Typography>
            <TextInput
              value={clientName}
              onChange={(e) => {
                setClientName(e.target.value);
                handleFieldChange("clientName", e.target.value);
              }}
            />
          </Box>

          <Box className={styles.formField}>
            <Typography variant="body1" className={styles.formFieldLabel}>
              Doing business as (DBA)
            </Typography>
            <TextInput
              value={businessName}
              onChange={(e) => {
                setBusinessName(e.target.value);
                handleFieldChange("businessName", e.target.value);
              }}
            />
          </Box>

          <Box className={styles.formField}>
            <Typography variant="body1" className={styles.formFieldLabel}>
              Demography
            </Typography>
            <SelectDropdown
              options={demographyOptions}
              title="Demography"
              value={demography}
              onChange={(e) => {
                setDemography(e.target.value);
                handleFieldChange("demography", e.target.value);
              }}
              className={styles.selectDropdown}
            />
          </Box>

          <Box className={styles.formField}>
            <Typography variant="body1" className={styles.formFieldLabel}>
              Industry
            </Typography>
            <SelectDropdown
              options={industryOptions}
              title="Industry"
              value={industry}
              onChange={(e) => {
                setIndustry(e.target.value);
                handleFieldChange("industry", e.target.value);
              }}
              className={styles.selectDropdown}
            />
          </Box>

          <Box className={styles.formField}>
            <Typography variant="body1" className={styles.formFieldLabel}>
              Business entity
            </Typography>
            <SelectDropdown
              options={businessEntityOptions}
              title="Business entity"
              value={businessEntity}
              onChange={(e) => {
                setBusinessEntity(e.target.value);
                handleFieldChange("businessEntity", e.target.value);
              }}
              className={styles.selectDropdown}
            />
          </Box>

          <Box className={styles.formField}>
            <Typography variant="body1" className={styles.formFieldLabel}>
              Entity size
            </Typography>
            <SelectDropdown
              options={entitySizeOptions}
              title="Entity size"
              value={entitySize}
              onChange={(e) => {
                setEntitySize(e.target.value);
                handleFieldChange("entitySize", e.target.value);
              }}
              className={styles.selectDropdown}
            />
          </Box>

          <Box className={styles.formField}>
  <Typography variant="body1" className={styles.formFieldLabel}>
    Website link
  </Typography>
  <TextInput
    value={websiteLink}
    onChange={(e) => {
      const value = e.target.value;
      setWebsiteLink(value);
      handleFieldChange("websiteLink", value);
      
      const urlRegex = /^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,6}(\/\S*)?$/i;
      if (value && !urlRegex.test(value)) {
        setWebsiteError("Enter a valid website URL");
      } else {
        setWebsiteError("");
      }
    }}
    error={!!websiteError}
  />
  {websiteError && (
    <Typography color="error" variant="caption" sx={{ ml: 1 }}>
      {websiteError}
    </Typography>
  )}
</Box>


          <Box className={styles.formField}>
            <Typography variant="body1" className={styles.formFieldLabel}>
              Company logo
            </Typography>
            <Box className={styles.uploadContainer}>
              <TextInput
                value={companyLogo}
                onChange={(e) => {
                  setCompanyLogo(e.target.value);
                  handleFieldChange("companyLogo", e.target.value);
                }}
                className={styles.logoInput}
              />
              <IconButton component="label" className={styles.uploadButton}>
                <TextInput
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setCompanyLogo(file.name);
                    }
                  }}
                />
                <FileUploadOutlinedIcon />
              </IconButton>
            </Box>
          </Box>

          <Box className={styles.formField}>
            <Typography variant="body1" className={styles.formFieldLabel}>
              POC name
            </Typography>
            <TextInput
              value={pocName}
              onChange={(e) => {
                setPocName(e.target.value);
                handleFieldChange("pocName", e.target.value);
              }}
            />
          </Box>

          <Box className={styles.formField}>
  <Typography variant="body1" className={styles.formFieldLabel}>
    POC Contact number
  </Typography>
  <TextInput
    value={pocContactNumber}
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, "");
      if (value.length <= 10) {
        setPocContactNumber(value);
        handleFieldChange("pocContactNumber", value);
        setPocNumberError(""); // clear error if valid
      }
      if (value.length < 10) {
        setPocNumberError("Enter 10 digit number");
      }
    }}
    maxLength={10}
    error={!!pocNumberError}
  />
  {pocNumberError && (
    <Typography color="error" variant="caption" sx={{ ml: 1 }}>
      {pocNumberError}
    </Typography>
  )}
</Box>


          <Box className={styles.formField}>
            <Typography variant="body1" className={styles.formFieldLabel}>
              POC email id
            </Typography>
            <TextInput
              value={pocEmailId}
              onChange={(e) => {
                setPocEmailId(e.target.value);
                handleFieldChange("pocEmailId", e.target.value);
              }}
            />
          </Box>

          {/* AE LeaderShip  */}

          <Box className={styles.formField}>
            <Typography variant="body1" className={styles.formFieldLabel}>
              AELeadership name
            </Typography>
            <TextInput
              value={leadershipName}
              onChange={(e) => setLeadershipName(e.target.value)}
            />
          </Box>

          <Box className={styles.formField}>
            <Typography variant="body1" className={styles.formFieldLabel}>
              AELeadership email id
            </Typography>
            <TextInput
              value={leadershipEmailId}
              onChange={(e) => setLeadershipEmailId(e.target.value)}
            />
          </Box>

          <Box className={styles.formField}>
  <Typography variant="body1" className={styles.formFieldLabel}>
    AELeadership Contact number
  </Typography>
  <TextInput
    value={leadershipContactNo}
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, "");
      if (value.length <= 10) {
        setLeadershipContactNo(value);
        handleFieldChange("leadershipContactNo", value);
        setLeadershipNumberError(""); // clear error
      }
      if (value.length < 10) {
        setLeadershipNumberError("Enter 10 digit number");
      }
    }}
    maxLength={10}
    error={!!leadershipNumberError}
    // helperText={leadershipNumberError}
  />
</Box>

        </Box>

        <Box className={styles.addButtonWrapper}>
          <Box
            component="button"
            onClick={handleCreateClient}
            className={styles.addButton}
          >
            {isEditMode ? "Update" : "Add"}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewClient;
