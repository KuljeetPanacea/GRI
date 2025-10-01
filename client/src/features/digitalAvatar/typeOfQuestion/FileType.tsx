import { Card, CardContent, FormControl, Typography } from "@mui/material";
import useDigitalAvatar from "../useDigitalAvatar";
import styles from "../DigitalAvatar.module.css";

const FileType = () => {
  const { currentQuestion, previewUrl, fileName, onFileUpload } =
    useDigitalAvatar();


  return (
    <Card className={styles.qstnCard}>
      <CardContent className={styles.cardContent}>
        <Typography
          variant="h3"
          component="div"
          className={styles.questionText}
        >
          {currentQuestion?.text || "Loading..."}
        </Typography>

        <FormControl component="fieldset" className={styles.formControl}>
          <input type="file" onChange={onFileUpload} />

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              style={{ marginTop: 16, maxWidth: "100%", maxHeight: 200 }}
            />
          )}

          {!previewUrl && fileName && (
            <Typography variant="body2" sx={{ marginTop: 2 }}>
              {fileName}
            </Typography>
          )}
        </FormControl>
      </CardContent>
    </Card>
  );
};

export default FileType;
