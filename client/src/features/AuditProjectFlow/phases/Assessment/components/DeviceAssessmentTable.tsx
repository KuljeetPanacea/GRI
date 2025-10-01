import React, { useEffect } from "react";
import { Typography, Input, Box, FormControl, MenuItem, Select } from "@mui/material";
import style from "./AssessmentComponents.module.css";
import { useDispatch } from "react-redux";
import {
  setSelectedRow,
} from "../../../../../redux/assessmentSlice";
import { EnhancedTable } from "../../../../../common/ui/EnhancedTable";
import useAssessmentTable, { AssessmentData, TableColumn, TableRow } from "../useAssessmentTable";

const DeviceAssessmentTable = ({ data = [] as AssessmentData[] }) => {
  const {
    handleRowClick,
    selectedRow,
  } = useAssessmentTable();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data.length > 0 && data[0].DeviceReference.length > 0) {
      dispatch(
        setSelectedRow({
          row: "0-0",
          deviceName: data[0].DeviceReference[0].DeviceName,
        })
      );
    }
  }, [data, dispatch]);

  const renderRadioButtons = (): JSX.Element => {
    const options = ["In Place", "Not in Place", "Not tested", "Not Applicable"];
    let selectedOption = options[0];

    return (
      <Box className={style.radioButtonsContainer}>
        <FormControl variant="outlined" sx={{ minWidth: 100 }}>
          <Select
            value={selectedOption}
            onChange={(e) => (selectedOption = e.target.value)}
            labelId="sort-select-label"
            id="sort-select"
            className={style.customSelect}
          >
            {options.map((data, index) => (
              <MenuItem key={index} value={data}>
                <Typography>{data}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box className={style.reasonInputContainer} onClick={(e) => e.stopPropagation()}>
          <Input
            placeholder="Write reason for your finding here..."
            className={style.reasonInput}
          />
        </Box>
      </Box>
    );
  };

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        color: '#666',
        fontStyle: 'italic'
      }}>
        {data === undefined ? 'Loading device data...' : 'No device data available for this control'}
      </div>
    );
  }

  const tableData: TableRow[] = data.flatMap((item, rowIndex) => {
    const groupId = `group-${rowIndex}`;
    return item.DeviceReference.map((ref, refIndex) => ({
      id: `${rowIndex}-${refIndex}`,
      groupId,
      deviceType: item.DeviceType,
      questionnaire: item.Questionnaire,
      stakeholder: item.AEInternalAssessor,
      deviceName: ref.DeviceName,
      assessmentQuestion: ref.AssessmentQuestion,
      clientResponse: ref.ClientResponse,
      questionFinding: ref.QuestionFinding,
      responseReason: ref.ResponseReason,
      rowData: { rowIndex, refIndex, itemComments: item.Comments },
      isFirstInGroup: refIndex === 0,
      groupLength: item.DeviceReference.length,
      _deviceType: "",
      _questionnaire: "",
      _stakeholder: "",
      _addComment: false,
    }));
  });

  const processTableData = (data: TableRow[]): TableRow[] => {
    const processedGroups = new Set<string>();
    return data.map((row) => {
      if (!row.isFirstInGroup || processedGroups.has(row.groupId)) {
        return {
          ...row,
          _deviceType: "",
          _questionnaire: "",
          _stakeholder: "",
          _addComment: false,
        };
      }
      processedGroups.add(row.groupId);
      return {
        ...row,
        _deviceType: row.deviceType,
        _questionnaire: row.questionnaire,
        _stakeholder: row.stakeholder,
        _addComment: true,
      };
    });
  };

  const processedData = processTableData(tableData);

  const columns: TableColumn<TableRow>[] = [
    {
      key: "_deviceType",
      header: "Device Type",
    },
    {
      key: "_questionnaire",
      header: "Questionnaire & Stakeholder",
      render: (_value, row) => {
        if (!row._addComment) return null;
        return (
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
          </div>
        );
      },
    },
    {
      key: "deviceName",
      header: "Device Reference",
    },
    {
      key: "assessmentQuestion",
      header: "Assessment Question",
    },
    {
      key: "clientResponse",
      header: "Client Response",
    },
    {
      key: "Devicereffinding",
      header: "Asset finding",
      render: () => renderRadioButtons(),
    },
  ];

  const getRowStyle = (row: TableRow): React.CSSProperties => {
    const isSelected = selectedRow?.id === row.id;
    const isSelectedGroup =
      selectedRow?.id.split("-")[0] === row.id.split("-")[0];

    const style: React.CSSProperties = {
      backgroundColor: isSelected
        ? "#f0f8ff"
        : isSelectedGroup
        ? "#f9fafb"
        : undefined,
    };

    if (row.isFirstInGroup) {
      style.borderTop = "4px solid #eaeaea";
    }
    return style;
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
    </div>
  );
};

export default DeviceAssessmentTable;
