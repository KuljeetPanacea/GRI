import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  CardActions,
  Box,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import styles from "../QstnrAdmin.module.css";
import { useQstnrAdmin } from "../useQstnrAdmin";
import { Pagination } from "../../../../common/ui/Pagination";

const QstnrGridView = () => {

    const {
      handlePageChange,
      currentPage,
      totalPages,
      totalCount,
    } = useQstnrAdmin();
  const { qstnrList }: { qstnrList: { title: string; icon: string; complianceType: string; createDtTime: string; updateDtTime: string; status: string }[] } = useQstnrAdmin();
  const rows = qstnrList;

  return (
    <>
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {rows.map((row, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card className={styles.qstnrCardView}>
            <CardContent>
              <Box className={styles.qstnrCardViewContent}>
                <Typography variant="h2">{row.icon}</Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", mb: 1, fontSize: "1rem" }}
                >
                  {row.title}
                </Typography>
              </Box>
              <Box className={styles.qstnDetails}>
              <Typography variant="body2" sx={{ mt: 2}}>
                Compliance 
              </Typography>
              <Typography variant="body2" sx={{ mt: 2, color:"#008BE8" }}>
                {row.complianceType}
              </Typography>
              </Box>
              <Box className={styles.qstnDetails}>
              <Typography variant="body2">
                Last modified
              </Typography>
              <Typography variant="body2">
                {new Date(row.updateDtTime).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Typography>
                </Box>
            </CardContent>
            <CardActions
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
             <Box>
              {row.status}
             </Box>
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>

      <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={5}
            totalItems={totalCount}
            onPageChange={handlePageChange}
          />
          </>
  );
};

export default QstnrGridView;
