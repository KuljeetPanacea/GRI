import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  Box,
  Typography,
  FormControl
} from '@mui/material';
import { TableConfig, TableColumn } from '../../../../redux/qstnrQuestion';

interface TemplateTableInputProps {
  config: TableConfig;
  data: Record<string, string | number | boolean>[];
  onDataChange: (data: Record<string, string | number | boolean>[]) => void;
  readOnly?: boolean;
}

const TemplateTableInput: React.FC<TemplateTableInputProps> = ({
  config,
  data,
  onDataChange,
  readOnly = false
}) => {
  const [tableData, setTableData] = useState<Record<string, string | number | boolean>[]>(data || []);

  useEffect(() => {
    // Initialize table data with empty values for each row and column combination
    if (config && config.rows && config.columns) {
      const initializedData = config.rows.map((row: { id: string; label: string }) => {
        const rowData: Record<string, string | number | boolean> = {};
        config.columns.forEach((column: TableColumn) => {
          const key = `${row.id}_${column.id}`;
          rowData[key] = tableData.find(d => d[`${row.id}_${column.id}`] !== undefined)?.[`${row.id}_${column.id}`] || (column.type === 'checkbox' ? false : '');
        });
        return rowData;
      });
      setTableData(initializedData);
      onDataChange(initializedData);
    }
  }, [config, onDataChange, tableData]);

  useEffect(() => {
    setTableData(data || []);
  }, [data]);

  const handleCellChange = (rowId: string, columnId: string, value: string | number | boolean) => {
    const key = `${rowId}_${columnId}`;
    const newData = [...tableData];
    const rowIndex = config.rows?.findIndex((row: { id: string; label: string }) => row.id === rowId) ?? -1;
    
    if (rowIndex !== -1) {
      if (!newData[rowIndex]) {
        newData[rowIndex] = {};
      }
      newData[rowIndex][key] = value;
      setTableData(newData);
      onDataChange(newData);
    }
  };

  const renderCell = (rowId: string, column: TableColumn, rowIndex: number) => {
    const key = `${rowId}_${column.id}`;
    const cellValue = tableData[rowIndex]?.[key] || '';

    switch (column.type) {
      case 'text':
        return (
          <TextField
            size="small"
            fullWidth
            value={cellValue}
            onChange={(e) => handleCellChange(rowId, column.id, e.target.value)}
            disabled={readOnly}
            placeholder={column.label}
            multiline
            rows={2}
          />
        );
      
      case 'number':
        return (
          <TextField
            size="small"
            fullWidth
            type="number"
            value={cellValue}
            onChange={(e) => handleCellChange(rowId, column.id, e.target.value)}
            disabled={readOnly}
            placeholder={column.label}
            inputProps={{
              min: column.validation?.min,
              max: column.validation?.max
            }}
          />
        );
      
      case 'date':
        return (
          <TextField
            size="small"
            fullWidth
            type="date"
            value={cellValue}
            onChange={(e) => handleCellChange(rowId, column.id, e.target.value)}
            disabled={readOnly}
            InputLabelProps={{ shrink: true }}
          />
        );
      
      case 'select':
        return (
          <FormControl size="small" fullWidth>
            <Select
              value={cellValue}
              onChange={(e) => handleCellChange(rowId, column.id, e.target.value)}
              disabled={readOnly}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select {column.label}</em>
              </MenuItem>
              {column.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      
      case 'checkbox':
        return (
          <Checkbox
            checked={Boolean(cellValue)}
            onChange={(e) => handleCellChange(rowId, column.id, e.target.checked)}
            disabled={readOnly}
          />
        );
      
      default:
        return (
          <TextField
            size="small"
            fullWidth
            value={cellValue}
            onChange={(e) => handleCellChange(rowId, column.id, e.target.value)}
            disabled={readOnly}
            placeholder={column.label}
            multiline
            rows={2}
          />
        );
    }
  };

  if (!config || !config.rows || !config.columns || config.rows.length === 0 || config.columns.length === 0) {
    return (
      <Box p={2}>
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No template table configuration found. Please configure the template table structure first.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
          Go to the question builder and add rows and columns for your template table.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxHeight: 600, width: '100%', overflowX: 'auto' }}>
        <Table stickyHeader sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white', minWidth: 150 }}>
                Area of Change
              </TableCell>
              {config.columns.map((column: TableColumn) => (
                <TableCell 
                  key={column.id} 
                  sx={{ 
                    fontWeight: 'bold', 
                    backgroundColor: '#1976d2', 
                    color: 'white',
                    minWidth: 150 
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {config.rows?.map((row: { id: string; label: string }, rowIndex: number) => (
              <TableRow key={row.id}>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: 150 }}>
                  {row.label}
                </TableCell>
                {config.columns.map((column: TableColumn) => (
                  <TableCell key={column.id} sx={{ minWidth: 150, verticalAlign: 'top' }}>
                    {renderCell(row.id, column, rowIndex)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TemplateTableInput;
