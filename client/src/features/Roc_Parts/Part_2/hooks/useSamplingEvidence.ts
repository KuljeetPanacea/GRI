import { useState, useCallback } from 'react';

// Types for the form data
interface SampleSetRow {
  TestedSampleSetRefNumber: string;
  SampleTypeDescription: string;
  SampleSetItemsList: string;
  SelectionMethod: string;
  TotalSampledCount: string;
  TotalPopulationCount: string;
}

interface DocumentEvidenceRow {
  DocumentReviewEvidenceReferenceNumber: string;
  DocumentNameAndVersion: string;
  DocumentPurposeDescription: string;
  DocumentRevisionDate: string;
}

interface InterviewEvidenceRow {
  InterviewEvidenceReferenceNumber: string;
  InterviewEvidenceWorkpaperTitle: string;
  InterviewTopicsDescription: string;
  IntervieweeRoles: string;
}

interface AssessmentEvidenceRow {
  AEvidenceRefNo: string;
  ATitle_Evidence: string;
  ATopicsCovered: string;
  ASampleSetRefNo: string;
}

interface SamplingEvidenceFormData {
  // Evidence Retention fields
  EvidenceRepoDetails: string;
  EvidenceRepoControlEntities: string;
  EvidenceRetention_3Years_Yes: boolean;
  EvidenceRetention_3Years_No: boolean;
  EvidenceAttestingAssessor: string;
  
  // Sampling fields
  Sampling_Used_Yes: boolean;
  Sampling_Used_No: boolean;
  Attesting_Assessor: string;
  Sampling_Rationale_Desc: string;
  Sampling_Method_justification: string;
  StandardSampleControls_Yes: boolean;
  StandardSampleControls_No: boolean;
  StandardSample_Desc: string;
  
  // Table data
  sampleSets: SampleSetRow[];
  documentEvidence: DocumentEvidenceRow[];
  interviewEvidence: InterviewEvidenceRow[];
  assessmentEvidence: AssessmentEvidenceRow[];
}

const initialFormData: SamplingEvidenceFormData = {
  EvidenceRepoDetails: '',
  EvidenceRepoControlEntities: '',
  EvidenceRetention_3Years_Yes: false,
  EvidenceRetention_3Years_No: false,
  EvidenceAttestingAssessor: '',
  Sampling_Used_Yes: false,
  Sampling_Used_No: false,
  Attesting_Assessor: '',
  Sampling_Rationale_Desc: '',
  Sampling_Method_justification: '',
  StandardSampleControls_Yes: false,
  StandardSampleControls_No: false,
  StandardSample_Desc: '',
  sampleSets: [{
    TestedSampleSetRefNumber: '',
    SampleTypeDescription: '',
    SampleSetItemsList: '',
    SelectionMethod: '',
    TotalSampledCount: '',
    TotalPopulationCount: ''
  }],
  documentEvidence: [{
    DocumentReviewEvidenceReferenceNumber: '',
    DocumentNameAndVersion: '',
    DocumentPurposeDescription: '',
    DocumentRevisionDate: ''
  }],
  interviewEvidence: [{
    InterviewEvidenceReferenceNumber: '',
    InterviewEvidenceWorkpaperTitle: '',
    InterviewTopicsDescription: '',
    IntervieweeRoles: ''
  }],
  assessmentEvidence: [{
    AEvidenceRefNo: '',
    ATitle_Evidence: '',
    ATopicsCovered: '',
    ASampleSetRefNo: ''
  }]
};

export const useSamplingEvidence = () => {
  const [formData, setFormData] = useState<SamplingEvidenceFormData>(initialFormData);

  // Handle regular input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Handle mutually exclusive checkboxes
    if (type === 'checkbox') {
      if (name === 'EvidenceRetention_3Years_Yes' && checked) {
        setFormData(prev => ({ ...prev, EvidenceRetention_3Years_No: false }));
      } else if (name === 'EvidenceRetention_3Years_No' && checked) {
        setFormData(prev => ({ ...prev, EvidenceRetention_3Years_Yes: false }));
      } else if (name === 'Sampling_Used_Yes' && checked) {
        setFormData(prev => ({ ...prev, Sampling_Used_No: false }));
      } else if (name === 'Sampling_Used_No' && checked) {
        setFormData(prev => ({ ...prev, Sampling_Used_Yes: false }));
      } else if (name === 'StandardSampleControls_Yes' && checked) {
        setFormData(prev => ({ ...prev, StandardSampleControls_No: false }));
      } else if (name === 'StandardSampleControls_No' && checked) {
        setFormData(prev => ({ ...prev, StandardSampleControls_Yes: false }));
      }
    }
  }, []);

  // Handle table row changes
  const handleTableInputChange = useCallback((
    tableType: 'sampleSets' | 'documentEvidence' | 'interviewEvidence' | 'assessmentEvidence',
    rowIndex: number,
    fieldName: string,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [tableType]: prev[tableType].map((row, index) => 
        index === rowIndex ? { ...row, [fieldName]: value } : row
      )
    }));
  }, []);

  // Add new row to table
  const addTableRow = useCallback((tableType: 'sampleSets' | 'documentEvidence' | 'interviewEvidence' | 'assessmentEvidence') => {
    const newRow = (() => {
      switch (tableType) {
        case 'sampleSets':
          return {
            TestedSampleSetRefNumber: '',
            SampleTypeDescription: '',
            SampleSetItemsList: '',
            SelectionMethod: '',
            TotalSampledCount: '',
            TotalPopulationCount: ''
          };
        case 'documentEvidence':
          return {
            DocumentReviewEvidenceReferenceNumber: '',
            DocumentNameAndVersion: '',
            DocumentPurposeDescription: '',
            DocumentRevisionDate: ''
          };
        case 'interviewEvidence':
          return {
            InterviewEvidenceReferenceNumber: '',
            InterviewEvidenceWorkpaperTitle: '',
            InterviewTopicsDescription: '',
            IntervieweeRoles: ''
          };
        case 'assessmentEvidence':
          return {
            AEvidenceRefNo: '',
            ATitle_Evidence: '',
            ATopicsCovered: '',
            ASampleSetRefNo: ''
          };
        default:
          return {};
      }
    })();

    setFormData(prev => ({
      ...prev,
      [tableType]: [...prev[tableType], newRow]
    }));
  }, []);

  // Remove row from table
  const removeTableRow = useCallback((
    tableType: 'sampleSets' | 'documentEvidence' | 'interviewEvidence' | 'assessmentEvidence',
    rowIndex: number
  ) => {
    setFormData(prev => ({
      ...prev,
      [tableType]: prev[tableType].filter((_, index) => index !== rowIndex)
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation logic
    const errors: string[] = [];
    
    if (!formData.EvidenceRepoDetails.trim()) {
      errors.push('Evidence repository details are required');
    }
    
    if (!formData.EvidenceRepoControlEntities.trim()) {
      errors.push('Evidence repository control entities are required');
    }
    
    if (!formData.EvidenceRetention_3Years_Yes && !formData.EvidenceRetention_3Years_No) {
      errors.push('Please indicate if evidence retention requirements are understood');
    }
    
    if (!formData.Sampling_Used_Yes && !formData.Sampling_Used_No) {
      errors.push('Please indicate if sampling is used');
    }
    
    if (formData.Sampling_Used_No && !formData.Attesting_Assessor.trim()) {
      errors.push('Attesting assessor name is required when sampling is not used');
    }
    
    if (formData.Sampling_Used_Yes) {
      if (!formData.Sampling_Rationale_Desc.trim()) {
        errors.push('Sampling rationale description is required');
      }
      if (!formData.Sampling_Method_justification.trim()) {
        errors.push('Sampling method justification is required');
      }
    }
    
    if (errors.length > 0) {
      alert('Please fix the following errors:\n' + errors.join('\n'));
      return;
    }
    
    // Process form data
    console.log('Form submitted:', formData);
    
    // Here you would typically send the data to an API
    // Example: await submitAssessmentData(formData);
    
    return formData;
  }, [formData]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  // Get form data as JSON
  const getFormDataAsJSON = useCallback(() => {
    return JSON.stringify(formData, null, 2);
  }, [formData]);

  return {
    formData,
    handleInputChange,
    handleTableInputChange,
    addTableRow,
    removeTableRow,
    handleSubmit,
    resetForm,
    getFormDataAsJSON
  };
};