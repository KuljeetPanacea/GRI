import { Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PrimaryButton from "../../../../common/ui/PrimaryButton";
import SearchBar from "../../../../common/ui/SearchBar";
import styles from "../QstnrAdmin.module.css";
import DefineQstr from "../../DefineQstnr/DefineQstnrs";
import ExcelUploadModal from "./ExcelUploadModal";
import { useQstnrAdmin } from "../useQstnrAdmin"; 

const QstnrHeader = () => {
  const { handleNewQuestionnaire, handleClose, open,  localSearch,
    setSearchValue, handleExcelUpload, handleExcelClose, excelOpen } = useQstnrAdmin();
 
  return (
    <div>
      <div className={styles.headerContainer}>
        <Typography variant="h2">Questionnaire Repository</Typography>

        <div className={styles.rightSection}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <PrimaryButton
              className={styles.createQstnrbutton}
              onClick={handleNewQuestionnaire}
              startIcon={<AddIcon />}
            >
              Create Questionnaire
            </PrimaryButton>
            <PrimaryButton
              className={styles.createQstnrbutton}
              onClick={handleExcelUpload}
              startIcon={<UploadFileIcon />}
            >
              via Excel
            </PrimaryButton>
          </div>
          <div>
            <SearchBar
              value={localSearch}
              onChange={(e) =>  setSearchValue(e.target.value)}
            />
          </div>
        </div>
      </div>

      {open && <DefineQstr open={open} handleClose={handleClose} />}
      {excelOpen && <ExcelUploadModal open={excelOpen} handleClose={handleExcelClose} />}
    </div>
  );
};

export default QstnrHeader;


