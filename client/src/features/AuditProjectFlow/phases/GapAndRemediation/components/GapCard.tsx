// GapCard.tsx
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import styles from "./styles/gapAndRemediationView.module.css";
import { GapCardProps } from "../useGapAndRemediationView";


const GapCard = ({
  title,
  description,
  totalGaps,
  completedGaps,
  onClick,
}: GapCardProps) => {
  return (
    <Card className={styles.reqCard}>
      <CardContent className={styles.reqCardContent}>
        <Box>
          <Typography variant="subtitle1" className={styles.reqTitle}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" className={styles.reqDescription}>
              {description}
            </Typography>
          )}
          <Box className={styles.gapStatsRow}>
            <Box className={styles.gapStat}>
              <Typography variant="caption">Total gaps</Typography>
              <Typography className={styles.gapCount}>{totalGaps}</Typography>
            </Box>
            <Box className={styles.gapStat}>
              <Typography variant="caption">Completed gaps</Typography>
              <Typography
                className={`${styles.gapCount} ${styles.completed}`}
              >
                {completedGaps}
              </Typography>
            </Box>
          </Box>
        </Box>
        <IconButton className={styles.arrowButton} onClick={onClick}>
          <ArrowForwardIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default GapCard;
