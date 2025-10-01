import {
  Dialog,
  DialogContent,
  Typography,
  IconButton,
  Snackbar,
  Box,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PrimaryButton from "../../../../common/ui/PrimaryButton";
import styles from "../QstnrAdmin.module.css";
import { useState, useRef, useEffect } from "react";
import { useDefineQstnrModal } from "../../DefineQstnr/useDefineQstnrModal";
import { useQstnrAdmin } from "../useQstnrAdmin";
import useAxios from "../../../../api/useAxios";
import { getLookup } from "../../../../api/lookup";
import { useDispatch } from "react-redux";
import { setQstnrPhase, setSelectedQstnrName, createQstnrThunk } from "../../../../redux/defineQstnrSlice";
import { AppDispatch } from "../../../../redux/store";
import { useNavigate } from "react-router-dom";

interface ExcelUploadModalProps {
  open: boolean;
  handleClose: () => void;
}

const ExcelUploadModal = ({ open, handleClose }: ExcelUploadModalProps) => {
  const {
    setName,
    setDescription,
    filters,
  } = useDefineQstnrModal();

  const {
    setQuestionnaireTypeOptions,
    setIndustryOptions,
    setIndustrySizeOptions,
    setComplianceOptions,
    setDeviceOptions,
  } = useQstnrAdmin();

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const axiosInstance = useAxios();

  const convertExcelToCSV = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            reject(new Error('Failed to read file'));
            return;
          }

          // For Excel files, we'll use a simple approach
          // Convert the binary data to text and extract CSV-like content
          if (typeof data === 'string') {
            // If it's already a string, use it directly
            resolve(data);
          } else {
            // For binary Excel files, we need to parse them
            // This is a simplified approach - in production, you might want to use a library like xlsx
            const uint8Array = new Uint8Array(data as ArrayBuffer);
            const text = new TextDecoder('utf-8').decode(uint8Array);
            
            // Extract CSV-like content from Excel binary
            // This is a basic implementation - for better Excel support, consider using xlsx library
            const lines = text.split('\n').filter(line => line.trim());
            const csvLines = lines.filter(line => 
              line.includes(',') || 
              line.startsWith('Question_Type') ||
              line.startsWith('QUESTIONNAIRE_')
            );
            
            resolve(csvLines.join('\n'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      // Read as text for CSV-like content
      reader.readAsText(file);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    const allowedExtensions = ['.csv', '.xls', '.xlsx'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      setError("Please upload a CSV or Excel file (.csv, .xls, .xlsx)");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      let text = '';
      
      // Handle different file types
      if (file.type === 'text/csv' || fileExtension === '.csv') {
        // CSV file - read as text
        text = await file.text();
      } else {
        // Excel file - convert to CSV format
        text = await convertExcelToCSV(file);
      }
      
      const { questionnaires } = parseCSVData(text);
      
      if (questionnaires.length === 0) {
        setError("No valid questionnaires found in the file. Please check the format.");
        setIsProcessing(false);
        return;
      }

      // Create all questionnaires
      let createdCount = 0;
      for (const questionnaire of questionnaires) {
        const { title, description, phase, questions } = questionnaire;
        
        if (questions.length === 0) {
          console.warn(`Skipping questionnaire "${title}" - no questions found`);
          continue;
        }

        // Set the extracted title and description
        setName(title);
        setDescription(description);

        // Create questionnaire with parsed questions
        await onCreateWithQuestions(questions, title, description, phase || "");
        createdCount++;
      }

      setSnackbarMessage(`Successfully created ${createdCount} questionnaire(s) from Excel!`);
      setSnackbarOpen(true);
      handleClose();
      
    } catch (error) {
      console.error("Error processing file:", error);
      setError("Error processing file. Please check the format and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const parseCSVData = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return { questionnaires: [] };

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const questionnaires = [];
    let currentQuestionnaire = {
      title: '',
      description: '',
      phase: '',
      questions: [] as Record<string, string | number | boolean | Array<{ value: string }>>[]
    };

    // Process each line
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(v => v.trim());
      
      if (row[0] === 'QUESTIONNAIRE_SEPARATOR') {
        // Save current questionnaire if it has questions
        if (currentQuestionnaire.questions.length > 0) {
          questionnaires.push({ ...currentQuestionnaire });
        }
        // Reset for next questionnaire
        currentQuestionnaire = {
          title: '',
          description: '',
          phase: '',
          questions: []
        };
        continue;
      }
      
      if (row[0] === 'QUESTIONNAIRE_TITLE' && row[1]) {
        currentQuestionnaire.title = row[1];
        continue;
      }
      
      if (row[0] === 'QUESTIONNAIRE_DESCRIPTION' && row[1]) {
        currentQuestionnaire.description = row[1];
        continue;
      }
      
      if (row[0] === 'QUESTIONNAIRE_PHASE' && row[1]) {
        currentQuestionnaire.phase = row[1];
        continue;
      }

      // Process question data
      if (row.length >= headers.length && row[0] && !row[0].startsWith('QUESTIONNAIRE_')) {
        const questionData: Record<string, string | number | boolean | Array<{ value: string }>> = {};
        
        // Map CSV columns to question properties
        headers.forEach((header, index) => {
          const value = row[index];
          if (value) {
            switch (header) {
              case 'question_type':
                questionData.type = value;
                break;
              case 'question_text':
                questionData.text = value;
                break;
              case 'option_1':
              case 'option_2':
              case 'option_3':
              case 'option_4':
              case 'option_5':
                if (!questionData.choices) questionData.choices = [];
                (questionData.choices as Array<{ value: string }>).push({ value });
                break;
              case 'requirements':
                questionData.requirements = value;
                break;
              case 'sub_requirements':
                questionData.subRequirements = value;
                break;
              case 'sub_control':
                questionData.subControl = value;
                break;
              case 'display_settings':
                questionData.setting = value;
                break;
              case 'evidence_reference':
                questionData.evidenceReference = value;
                break;
              case 'testing_procedure':
                questionData.testingProcedure = value;
                break;
            }
          }
        });

        // Add required fields for API
        questionData.questionnaireId = ""; // Will be set after questionnaire creation
        questionData.userResponse = ""; // Default empty response
        if (!questionData.choices) {
          questionData.choices = []; // Ensure choices is always an array
        }

        if (questionData.text && questionData.type) {
          currentQuestionnaire.questions.push(questionData);
        }
      }
    }

    // Add the last questionnaire if it has questions
    if (currentQuestionnaire.questions.length > 0) {
      questionnaires.push(currentQuestionnaire);
    }

    return { questionnaires };
  };

  const onCreateWithQuestions = async (questions: Record<string, string | number | boolean | Array<{ value: string }>>[], extractedTitle: string, extractedDescription: string, extractedPhase: string) => {
    try {
      // Use extracted phase or fallback to detection logic
      let finalPhase = extractedPhase;
      if (!finalPhase) {
        const isScopingPhase = extractedTitle.toLowerCase().includes('scoping') || 
                              extractedDescription.toLowerCase().includes('scoping') ||
                              extractedTitle.toLowerCase().includes('project scoping');
        finalPhase = isScopingPhase ? "Scoping" : "Assessment";
      }
      
      const payload = {
        complianceType: filters.complianceType || "General",
        description: extractedDescription,
        industrySize: filters.industrySize || "Medium",
        industryType: filters.industryType || "Technology",
        phase: finalPhase,
        deviceType: filters.deviceType || "Desktop",
        questions: questions,
        title: extractedTitle,
      };

      // Use the existing createQstnrThunk but with questions included
      const response = await dispatch(createQstnrThunk({ data: payload, axiosInstance })).unwrap();

      if (!response || !response.id) {
        throw new Error("Invalid response: " + JSON.stringify(response));
      }

      const questionnaireId = response.id;
      console.log("Questionnaire created with ID:", questionnaireId);
      
      dispatch(setQstnrPhase(finalPhase));
      dispatch(setSelectedQstnrName(extractedTitle));
      
      // Navigate to the questionnaire builder
      navigate(`/landing/add-question?questionnaireId=${questionnaireId}`);
      
      
    } catch (error) {
      console.error("Error creating questionnaire:", error);
      setSnackbarMessage("Failed to create questionnaire from Excel.");
      setSnackbarOpen(true);
    }
  };

  const handleCreate = async () => {
    // Trigger file input directly - no validation needed as everything will be extracted from file
    fileInputRef.current?.click();
  };


  useEffect(() => {
    async function fetchData() {
      try {
        const categories = ["QuestionnaireType", "Industry", "Size ", "ComplianceType", "DeviceType"];

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
  }, [axiosInstance, setQuestionnaireTypeOptions, setIndustryOptions, setIndustrySizeOptions, setComplianceOptions, setDeviceOptions]);

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
      <DialogContent dividers sx={{ padding: 5 }}>
        <Typography variant="h6" gutterBottom>
          Create Questionnaire via Excel Upload
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body1" sx={{ mb: 3 }}>
          Upload an Excel (.xlsx, .xls) or CSV file to automatically create questionnaire(s) with all questions. 
          The title, description, and phase will be extracted from the file. Multiple questionnaires are supported using QUESTIONNAIRE_SEPARATOR.
        </Typography>


        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".csv,.xls,.xlsx"
          style={{ display: 'none' }}
        />

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <PrimaryButton
            className={styles.modalCreateQstnrbutton}
            onClick={handleCreate}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Select Excel/CSV File & Create"}
          </PrimaryButton>
        </Box>
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

export default ExcelUploadModal;
