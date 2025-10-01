import React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { StepIconProps } from '@mui/material/StepIcon';
import styles from '../../ProjectManagement.module.css';
import CircleIcon from '@mui/icons-material/Circle';
import { setStep } from '../../../../redux/createNewProjectSlice';
import { useAppDispatch } from '../../../../redux/store';

const steps = [
  'Project description',
  'Client details',
  'Assessed entity details',
  'Audit team details',
  'Scoping questionnaire'
];

interface ProgressStepperProps {
  activeStep: number;
}

const CustomStepIcon: React.FC<StepIconProps> = ({ active = false, completed = false }) => {
  return completed ? (
    <CircleIcon style={{ color: '#207D48' }} />
  ) : active ? (
    <CircleIcon style={{ color: '#DB1F42' }} />
  ) : (
    <CircleIcon style={{ color: '#AFAFAF' }} />
  );
};



export default function ProgressStepper({ activeStep }: ProgressStepperProps) {
  const dispatch = useAppDispatch();
  
  const handleStepperClick= (activeStep: number, index:number)=>{
    if (index < activeStep){
      dispatch(setStep(index));
    }
  }
  return (
    <Box className={styles.stepperContainer} sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel StepIconComponent={CustomStepIcon} sx={{
                '& .MuiStepLabel-label': {
                  color: activeStep === index ? '#DB1F42' : activeStep > index ? '#207D48' : '#AFAFAF',
                }
              }} onClick = {() => handleStepperClick(activeStep,index)}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
