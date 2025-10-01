import {
  Dialog,
  DialogContent,
  Typography,
  IconButton,
  Snackbar,
} from "@mui/material";
import SelectDropdown from "../../../common/ui/SelectDropdown";
import CloseIcon from "@mui/icons-material/Close";
import PrimaryButton from "../../../common/ui/PrimaryButton";
import styles from "../DefineQstnr/DefineQstnr.module.css";
import TextInput from "../../../common/ui/TextInput";
import { useDefineQstnrModal } from "./useDefineQstnrModal";
import { useEffect, useState } from "react";
import { useQstnrAdmin } from "../QstnrAdmin/useQstnrAdmin";
import useAxios from "../../../api/useAxios";
import { getLookup } from "../../../api/lookup";
import { useDispatch } from "react-redux";
import { setQstnrPhase, setSelectedQstnrName } from "../../../redux/defineQstnrSlice";
import { AppDispatch } from "../../../redux/store";

const DefineQstr = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {
  const {
    title,
    description,
    setName,
    setDescription,
    filters,
    updateFilter,
    onCreate,
  } = useDefineQstnrModal();

  const {
    questionnaireTypeOptions,
    setQuestionnaireTypeOptions,
    industryOptions,
    setIndustryOptions,
    industrySizeOptions,
    setIndustrySizeOptions,
    complianceOptions,
    setComplianceOptions,
    deviceOptions,
    setDeviceOptions,
  } = useQstnrAdmin()
  const dispatch: AppDispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const axiosInstance = useAxios()

  const handleAddQstnr = async () => {
    try {
      await onCreate(setSnackbarMessage, setSnackbarOpen);
      dispatch(setQstnrPhase(filters.phase));
    dispatch(setSelectedQstnrName(title));
    console.log("This is the title of the questionnaire", title);   
    } catch {
      setSnackbarMessage("Failed to create questionnaire.");
      setSnackbarOpen(true);
          }
  }

  useEffect(() => {
      async function fetchData() {
        try {
          const categories = ["QuestionnaireType", "Industry", "Size ","ComplianceType", "DeviceType"];
  
          const responses = await Promise.all(
            categories.map((category) => getLookup(category, axiosInstance))
          );
  
          setQuestionnaireTypeOptions(responses[0]);
          setIndustryOptions(responses[1]);
          setIndustrySizeOptions(responses[2]);
          setComplianceOptions(responses[3]);
          setDeviceOptions(responses[4]);
        } catch (error) {
          console.error("Error fetching lookup data:", error);
        }
      }
  
      fetchData();
    }, [axiosInstance]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "20px",
        },
      }}
    >
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers sx={{ padding: 5 }} onKeyDown={(event)=> {if(event.key ==='Enter'){handleAddQstnr()}}}>
        <Typography variant="subtitle1" gutterBottom>
          1. Questionnaire Name <span style={{ color: "red" }}>*</span>
        </Typography>
        <TextInput
          value={title}
          onChange={(e) => setName(e.target.value)}
          placeholder="Write Name Here..."
        />

        <Typography sx={{ marginTop: 2, mb: 2 }}>
          2. Select categories from each <span style={{ color: "red" }}>*</span>
        </Typography>
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          <SelectDropdown
            value={filters.phase}
            onChange={(e) => updateFilter("phase", e.target.value)}
            options={questionnaireTypeOptions}
            title="Phase"
          />
          <SelectDropdown
            value={filters.industryType}
            onChange={(e) => updateFilter("industryType", e.target.value)}
            options={industryOptions}
            title="Industry Type"
          />
          <SelectDropdown
            value={filters.industrySize}
            onChange={(e) => updateFilter("industrySize", e.target.value)}
            options={industrySizeOptions}
            title="Industry Size"
          />
          <SelectDropdown
            value={filters.complianceType}
            onChange={(e) => updateFilter("complianceType", e.target.value)}
            options={complianceOptions}
            title="Compliance"
          />
          {filters.phase === "Assessment" && (
            <SelectDropdown
              value={filters.deviceType}
              onChange={(e) => updateFilter("deviceType", e.target.value)}
              options={deviceOptions}
              title="Device Type"
            />
          )}
        </div>

        <Typography variant="subtitle1" gutterBottom sx={{ marginTop: 2 }}>
          3. What is the Questionnaire about?
        </Typography>
        <TextInput
          placeholder="Write Description Here..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <PrimaryButton
          className={styles.modalCreateQstnrbutton}
          type="submit"
          onClick={handleAddQstnr}
        >
          Create
        </PrimaryButton>
      </DialogContent>
      <div>
        <Snackbar
          key={snackbarMessage}
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </div>
    </Dialog>
  );
};

export default DefineQstr;
