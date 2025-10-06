import { Menu, MenuItem, Button } from "@mui/material";
import ShortTextIcon from "@mui/icons-material/ShortText";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import TableChartIcon from "@mui/icons-material/TableChart";
import AddIcon from "@mui/icons-material/Add";
import useBuildQstnr from "../useBuildQstnr";
import styles from "../BuildQstnr.module.css";

const AddQstnMenu = () => {
  const { anchorEl, handleMenuOpen, handleMenuClose, addMenuValue } =
    useBuildQstnr();

  return (
    <div className={styles.AddQstnMenucontainer}>
      <Button
        className={styles.AddQstnMenuaddButton}
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleMenuOpen}
      >
        Add Question
      </Button>

      <Menu
        sx={{ mt: 1 }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => addMenuValue("multiple_choice")}>
          <CheckBoxIcon className={styles.AddQstnMenumenuIcon} />
          Multiple Choice
        </MenuItem>
        <MenuItem onClick={() => addMenuValue("short_text")}>
          <ShortTextIcon className={styles.AddQstnMenumenuIcon} />
          Short Text
        </MenuItem>
        <MenuItem onClick={() => addMenuValue("long_text")}>
          <TextFieldsIcon className={styles.AddQstnMenumenuIcon} />
          Long Text
        </MenuItem>
        <MenuItem onClick={() => addMenuValue("single_choice")}>
          <RadioButtonCheckedIcon className={styles.AddQstnMenumenuIcon} />
          Single Choice
        </MenuItem>
        <MenuItem onClick={() => addMenuValue("file_type")}>
          <AttachFileIcon className={styles.AddQstnMenumenuIcon} />
          File Upload
        </MenuItem>
        <MenuItem onClick={() => addMenuValue("table_type")}>
          <TableChartIcon className={styles.AddQstnMenumenuIcon} />
          Table Input
        </MenuItem>
      </Menu>
    </div>
  );
};

export default AddQstnMenu;
