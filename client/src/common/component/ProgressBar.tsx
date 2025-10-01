import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import styles from './ProgressBar.module.css';

const steps = [
  'Company details',
  'Verification',
  'Done',
];

interface ProgressBarProps {
  activeStep: number;
}

export default function ProgressBar({ activeStep }: ProgressBarProps) {
  return (
    <Box className={styles["box-container"]} sx={{ width: '100%' }} >
    <Stepper className={styles["active-step"]} activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
            <Step className={styles["step"]} key={label}>
                <StepLabel className={styles["step-label"]}>{label}</StepLabel>
            </Step>
        ))}
    </Stepper>
</Box>

  );
}