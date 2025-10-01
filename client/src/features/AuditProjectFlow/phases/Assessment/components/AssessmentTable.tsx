import { ReactNode, ReactPortal, useEffect } from "react";
import { Typography, Box, CircularProgress,} from "@mui/material";
import style from "./AssessmentComponents.module.css";
import { useDispatch, useSelector } from "react-redux";

import {
  setSelectedRow,
  selectedDeviceKey,
  setSelectedDeviceKey,
  selectSelectedControl,
  selectTableLoading,
} from "../../../../../redux/assessmentSlice";
import { SidebarItem } from "../useAssessmentView";
import { EnhancedTable } from "../../../../../common/ui/EnhancedTable";
import VisibilityIcon from '@mui/icons-material/Visibility';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckToggle from "../../../../../common/component/CheckToggle";
import IconLabel from "../../../../../common/component/IconLable";
import useAssessmentTable from "../useAssessmentTable";
import { RadioButtons} from "./renderRadioButton";
import useExpandPanel from "../useExpandPanel";
import AISummaryDialog from "../../Assessment/components/AISummaryDialog";
import useAssessmentAI from "./useAssessmentAI";

const AssessmentTable = ({ data = [] as SidebarItem[] }) => {
  const {
    handleRowClick,
    selectedRow
  } = useAssessmentTable();
  const dispatch = useDispatch();
  const selectedControl = useSelector(selectSelectedControl);
  const { handleButtonSelect } = useExpandPanel();
  const deviceRefKey = useSelector(selectedDeviceKey);
  const tableLoading = useSelector(selectTableLoading);
  const{ handleGenerateAI }=useAssessmentAI();
  useEffect(() => {
    if (data.length > 0) {
      dispatch(
        setSelectedRow({
          row: "0",
          deviceName: data[0].deviceRef[0],
        })
      );
    }
  }, [data, dispatch]);

   useEffect(() => {
      dispatch(setSelectedDeviceKey(""));
   },[selectedControl,dispatch]);

  if (!Array.isArray(data) || data.length === 0) {
    if (tableLoading) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          color: '#666',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CircularProgress size={24} />
          <span>Loading device data...</span>
        </div>
      );
    }
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        color: '#666',
        fontStyle: 'italic'
      }}>
        {selectedControl ? 'No device data available for this control' : 'Select a control to view device data'}
      </div>
    );
  }
  const processedData = data.map((item, index) => ({
    id: `${index}`,
    deviceType: item.deviceType,
    stakeholder: item.AEInternalAssessor,
    questionnaire: item.qstnrName,
    deviceName: Array.isArray(item.deviceRef) ? item.deviceRef : [item.deviceRef],
    assessmentQuestion: item.qstnDesc,
    clientResponse: item.response,
    questionFinding: item.qstnFinding || "",
    rowData: { rowIndex: index, itemComments: [] },
    isFirstInGroup: true,
    groupId: `group-${index}`,
    assetRefFinding: item.deviceRefFinding || "",
  }));

  const columns = [
    {
      key: "deviceType",
      header: "Asset Type",
    },
    {
      key: "questionnaire",
      header: "Questionnaire & Stakeholder",
      render: (_: unknown, row: { questionnaire: string | number | boolean | Iterable<ReactNode> | ReactPortal | null | undefined; stakeholder: string | number | boolean | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
        <div>
          <Typography
            variant="body1"
            component="strong"
            className={style.questionnaireTitle}
          >
            {row.questionnaire}
          </Typography>
          <br />
          <Typography
            variant="body2"
            component="em"
            className={style.stakeholderText}
          >
            {row.stakeholder}
          </Typography>
          <br />
        </div>
      ),
    },
    {
      key: "deviceName",
      header: "Asset Reference",
      render: (_: unknown, row: { deviceName: string[]; id: string; _id: string; rowIndex: number; }) => (
        <Box display="flex" flexDirection="column" width="100%">
          {row.deviceName?.map((name: string, index: number) => {
            const deviceKey = `${row.id || row._id || row.rowIndex}_${name}`;
      
            return (
              <Box key={name}>
                <Box
                  display="flex"
                  alignItems="center"
                  paddingY={1.5}
                  paddingX={0.5}
                  width="100%"
                >
                  <CheckToggle
                    label={name}
                    checked={deviceRefKey === deviceKey}
                    onToggle={(val) => {
                      dispatch(setSelectedDeviceKey(val ? deviceKey : ""));
                    }}
                    className={style.questionnaireTitle}
                  />
                </Box>
                {index !== row.deviceName.length - 1 && (
                  <Box
                    sx={{
                      height: '1px',
                      backgroundColor: '#f0f0f0',
                      width: '100%',
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      )
      
    },
    {
      key: "clientResponse",
      header: "Client Response",
      render: (_: unknown, row: { deviceName: string[]; deviceType:string}) => (
        <Box display="flex" flexDirection="column" width="100%">
          { row.deviceName?.map((name: string, index: number) => (
            <Box key={name}>
              <IconLabel
                items={[
                  {
                    icon: <VisibilityIcon fontSize="small" />,
                    label: 'See client response',
                    onClick: () => handleButtonSelect("All assessment Questions"),
                  },
                  {
                    icon: <AutoAwesomeIcon fontSize="small" />,
                    label: 'Generate AI response',
                    onClick: () => handleGenerateAI(row.deviceType, deviceRefKey.split("_")[1]),
                  },
                ]}
              />
              {index !== row.deviceName.length - 1 && (
                <Box
                  sx={{
                    height: '1px',
                    width: '100%',
                    backgroundColor: '#eee',
                    my: 1,
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      ),
    },    
    {
      key: "Devicereffinding",
      header: "Asset finding",
      render: (_: unknown, row: { deviceName: string[]; id: string; _id: string; rowIndex: number; assetRefFinding: string; }) => (
        <Box display="flex" flexDirection="column" width="100%">
          {row.deviceName?.map((name: string, index: number) => {
            const deviceKey = `${row.id || row._id || row.rowIndex}_${name}`;
            const isSelected = deviceRefKey === deviceKey;
    
            return (
              <Box key={name}>
                {<RadioButtons
                disabled={!isSelected}
                value={row.assetRefFinding}
              />}
                {index !== row.deviceName.length - 1 && (
                  <Box
                    sx={{
                      height: '1px',
                      width: '100%',
                      backgroundColor: '#eee',
                      my: 1,
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      ),
    }
  ];

  const getRowStyle = (row: { id: string | undefined; }) => {
    const isSelected = selectedRow?.id === row.id;
    return {
      backgroundColor: isSelected ? "#f0f8ff" : undefined,
      borderTop: "4px solid #eaeaea",
    };
  };

  return (
    <div className={style.tableContainer}>
      <EnhancedTable
        columns={columns}
        data={processedData}
        onRowClick={(row) => handleRowClick(row.deviceName, row.id)}
        idField="id"
        getRowStyle={getRowStyle}
      />
      <AISummaryDialog />
    </div>
  );
};

export default AssessmentTable;
