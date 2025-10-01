import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useRef, useState } from "react";
import TextInput from "../../../../common/ui/TextInput";
import styles from "../../ProjectManagement.module.css";
import {
  Radio,
  Typography,
  FormControlLabel,
  Autocomplete,
  FormControl,
  RadioGroup,
} from "@mui/material";
import {
  NewProject,
  auditEntity,
} from "../../../../redux/createNewProjectSlice";
import {
  getAssessedEntities,
  AssessedEntity,
} from "../../../../api/assessedEntity";
import useAxios from "../../../../api/useAxios";
import { useSelector } from "react-redux"; // Import useSelector from react-redux
import { RootState } from "../../../../redux/store"; // Import RootState to type the state properly

interface ProjectDetailsProps {
  formData: NewProject;
  handleChange: <K extends keyof NewProject>(
    field: K,
    value: NewProject[K]
  ) => void;
}

const AssessedEntityDetails: React.FC<ProjectDetailsProps> = ({
  formData,
  handleChange,
}) => {
  const assessedEntities = useRef<AssessedEntity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<AssessedEntity | null>(
    null
  );
  const [manualEntryMode, setManualEntryMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const axiosInstance = useAxios();

  // Use useSelector to directly get the clientData from the Redux store
  const clientData = useSelector(
    (state: RootState) => state.createNewProject.client
  );

  const updateAuditEntity = <K extends keyof auditEntity>(
    field: K,
    value: auditEntity[K]
  ) => {
    handleChange("auditEntity", {
      ...formData.auditEntity,
      [field]: value ?? "",
    } as auditEntity);
  };

  useEffect(() => {
    if (formData.isSameEntity && clientData) {
      handleChange("auditEntity", {
        assessedEntityname: clientData.clientName,
        assessedDba: clientData.clientDBA,
        assessedWebsiteLink: clientData.clientWebsiteLink,
        pocName: clientData.clientPocName,
        pocPhoneNumber: clientData.clientContactNumber,
        pocEmail: clientData.clientEmailAddress,
        leadershipContactNo: clientData.leadershipContactNo,
        leadershipEmailId: clientData.leadershipEmailId,
        leadershipName: clientData.leadershipName,
      });
    } else if (formData.client) {
      const fetchEntities = async () => {
        console.log("This is the client", formData.client)
        try {
          const entities = await getAssessedEntities(
            formData.client ?? "",
            axiosInstance
          );
          console.log("These are the assessed Entities", entities)
          assessedEntities.current = entities;
        } catch (error) {
          console.error("Error fetching assessed entities:", error);
        }
      };
      fetchEntities();
    }
  }, [formData.isSameEntity, formData.client, clientData]);

  const handleEntitySelect = (value: string | AssessedEntity | null) => {
    if (value && typeof value !== "string") {
      setSelectedEntity(value);
      console.log("Selected entity:", value);
      setManualEntryMode(false); // Disable manual entry if an entity is selected
      handleChange("auditEntity", {
        assessedEntityname: value.assessedEntityname,
        assessedDba: value.assessedDba,
        assessedWebsiteLink: value.assessedWebsiteLink,
        pocName: value.pocName,
        pocPhoneNumber: value.pocPhoneNumber,
        pocEmail: value.pocEmail,
        leadershipContactNo: value.leadershipContactNo,
        leadershipEmailId: value.leadershipEmailId,
        leadershipName: value.leadershipName,
      });
    } else {
      setSelectedEntity(null);
      setManualEntryMode(true); // Enable manual entry if no entity is selected
      handleChange("auditEntity", {
        assessedEntityname: "",
        assessedDba: "",
        assessedWebsiteLink: "",
        pocName: "",
        pocPhoneNumber: "",
        pocEmail: "",
      });
    }
  };

  return (
    <div className={styles.AEdetails}>
      <FormControl component="fieldset" >
  <RadioGroup
    name="isSameEntity"
    value={formData.isSameEntity ? "yes" : "no"}
    onChange={(e) =>
      handleChange("isSameEntity", e.target.value === "yes")
    }
  >
    <div className={styles.radio}>

    <FormControlLabel
      value="yes"
      control={<Radio />}
      label="Yes"
      />
    <FormControlLabel
      value="no"
      control={<Radio />}
      label="No, this audit is for another entity"
      />
      </div>
  </RadioGroup>
</FormControl>

      {!formData.isSameEntity && (
        <div className={styles.details}>
          <div className={styles.formRow}>
            <div className={styles.assessedEntityContainer}>
              <Typography
                variant="body2"
                className={styles.assessedEntityLabel}
              >
                Assessed entity name
              </Typography>
              <div className={styles.autocompleteWrapper}>
                <Autocomplete
                  options={assessedEntities.current}
                  getOptionLabel={(option) =>
                    option && typeof option === "object" ? option.assessedEntityname ?? "" : ""
                  }
                  onChange={(_event, value) => handleEntitySelect(value)}
                  inputValue={inputValue}
                  onInputChange={(_event, newInputValue, reason) => {
                    setInputValue(newInputValue);
                    // When user types manually and doesn't select from list
                    if (reason === "input") {
                      setSelectedEntity(null);
                      setManualEntryMode(true);
                      handleChange("auditEntity", {
                        assessedEntityname: newInputValue,
                        assessedDba: "",
                        assessedWebsiteLink: "",
                        pocName: "",
                        pocPhoneNumber: "",
                        pocEmail: "",
                      });
                    }
                  }}
                  freeSolo
                  noOptionsText="No entity found. You can enter details manually."
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <div className={styles.customInputWrapper}>
                        <input
                          {...params.inputProps}
                          placeholder="Write AE name"
                          className={styles.customInput}
                          value={formData.auditEntity?.assessedEntityname}
                        />
                        <div className={styles.searchIconWrapper}>
                          <SearchIcon className={styles.searchIcon} />
                        </div>
                      </div>
                      {/* Preserve the hidden input for Autocomplete functionality */}
                      <input type="hidden" {...params.inputProps} />
                    </div>
                  )}
                />
              </div>
            </div>
            <div>
              <Typography variant="body2">Doing business as (DBA)</Typography>
              <TextInput
                className={styles.clientTextInput}
                value={formData.auditEntity?.assessedDba ?? ""}
                onChange={(e) =>
                  updateAuditEntity("assessedDba", e.target.value)
                }
                disabled={!!selectedEntity && !manualEntryMode}
                placeholder="Write AE’s business name"
              />
            </div>
            <div>
              <Typography variant="body2">Website link</Typography>
              <TextInput
                className={styles.clientTextInput}
                value={formData.auditEntity?.assessedWebsiteLink ?? ""}
                onChange={(e) =>
                  updateAuditEntity("assessedWebsiteLink", e.target.value)
                }
                disabled={!!selectedEntity && !manualEntryMode}
                placeholder="Add business website link"
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div>
              <Typography variant="body2">POC name</Typography>
              <TextInput
                className={styles.clientTextInput}
                value={formData.auditEntity?.pocName ?? ""}
                onChange={(e) => updateAuditEntity("pocName", e.target.value)}
                disabled={!!selectedEntity && !manualEntryMode}
                placeholder="Write point of contact’s name"
              />
            </div>
            <div>
              <Typography variant="body2">Contact number</Typography>
              <TextInput
                className={styles.clientTextInput}
                value={formData.auditEntity?.pocPhoneNumber?.toString() ?? ""}
                onChange={(e) =>
                  updateAuditEntity(
                    "pocPhoneNumber",
                    e.target.value ? String(e.target.value) : undefined
                  )
                }
                disabled={!!selectedEntity && !manualEntryMode}
                placeholder="Enter POC’s contact number"
              />
            </div>
            <div>
              <Typography variant="body2">Email address</Typography>
              <TextInput
                required
                className={styles.clientTextInput}
                value={formData.auditEntity?.pocEmail ?? ""}
                onChange={(e) => updateAuditEntity("pocEmail", e.target.value)}
                disabled={!!selectedEntity && !manualEntryMode}
                placeholder="Enter POC’s email address"
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div>
              <Typography variant="body2">Leadership name</Typography>
              <TextInput
                className={styles.clientTextInput}
                value={formData.auditEntity?.leadershipName ?? ""}
                onChange={(e) => updateAuditEntity("leadershipName", e.target.value)}
                disabled={!!selectedEntity && !manualEntryMode}
                placeholder="Write AELeadership’s name"
              />
            </div>
            <div>
              <Typography variant="body2">Leadership Contact number</Typography>
              <TextInput
                className={styles.clientTextInput}
                value={formData.auditEntity?.leadershipContactNo?.toString() ?? ""}
                onChange={(e) =>
                  updateAuditEntity(
                    "leadershipContactNo",
                    e.target.value ? String(e.target.value) : undefined
                  )
                }
                disabled={!!selectedEntity && !manualEntryMode}
                placeholder="Enter AELeadership’s contact number"
              />
            </div>
            <div>
              <Typography variant="body2">Leadership Email address</Typography>
              <TextInput
                required
                className={styles.clientTextInput}
                value={formData.auditEntity?.leadershipEmailId ?? ""}
                onChange={(e) => updateAuditEntity("leadershipEmailId", e.target.value)}
                disabled={!!selectedEntity && !manualEntryMode}
                placeholder="Enter AELeadership’s email address"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessedEntityDetails;
