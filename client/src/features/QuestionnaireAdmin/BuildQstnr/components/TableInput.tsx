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
  Button,
  Box,
  Typography,
  IconButton,
  FormControl
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { TableColumn } from '../../../../redux/qstnrQuestion';

interface TableInputProps {
  columns: TableColumn[];
  data: Record<string, string | number | boolean>[];
  onDataChange: (data: Record<string, string | number | boolean>[]) => void;
  readOnly?: boolean;
}

const TableInput: React.FC<TableInputProps> = ({
  columns,
  data,
  onDataChange,
  readOnly = false
}) => {
  const [tableData, setTableData] = useState<Record<string, string | number | boolean>[]>(data || []);

  useEffect(() => {
    setTableData(data || []);
  }, [data]);

  const handleCellChange = (rowIndex: number, columnId: string, value: string | number | boolean) => {
    const newData = [...tableData];
    if (!newData[rowIndex]) {
      newData[rowIndex] = {};
    }
    newData[rowIndex][columnId] = value;
    setTableData(newData);
    onDataChange(newData);
  };

  const addRow = () => {
    const newRow: Record<string, string | number | boolean> = {};
    columns.forEach(col => {
      newRow[col.id] = col.type === 'checkbox' ? false : '';
    });
    const newData = [...tableData, newRow];
    setTableData(newData);
    onDataChange(newData);
  };

  const removeRow = (rowIndex: number) => {
    const newData = tableData.filter((_, index) => index !== rowIndex);
    setTableData(newData);
    onDataChange(newData);
  };

  const renderCell = (column: TableColumn, value: string | number | boolean, rowIndex: number) => {
    const cellValue = tableData[rowIndex]?.[column.id] || value || '';

    switch (column.type) {
      case 'text':
        return (
          <TextField
            size="small"
            fullWidth
            value={cellValue}
            onChange={(e) => handleCellChange(rowIndex, column.id, e.target.value)}
            disabled={readOnly}
            placeholder={column.label}
          />
        );
      
      case 'number':
        return (
          <TextField
            size="small"
            fullWidth
            type="number"
            value={cellValue}
            onChange={(e) => handleCellChange(rowIndex, column.id, e.target.value)}
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
            onChange={(e) => handleCellChange(rowIndex, column.id, e.target.value)}
            disabled={readOnly}
            InputLabelProps={{ shrink: true }}
          />
        );
      
      case 'select':
        return (
          <FormControl size="small" fullWidth>
            <Select
              value={cellValue}
              onChange={(e) => handleCellChange(rowIndex, column.id, e.target.value)}
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
            onChange={(e) => handleCellChange(rowIndex, column.id, e.target.checked)}
            disabled={readOnly}
          />
        );
      
      default:
        return (
          <TextField
            size="small"
            fullWidth
            value={cellValue}
            onChange={(e) => handleCellChange(rowIndex, column.id, e.target.value)}
            disabled={readOnly}
            placeholder={column.label}
          />
        );
    }
  };

  if (!columns || columns.length === 0) {
    return (
      <Box p={2}>
        <Typography color="text.secondary">
          No table columns configured. Please configure the table structure first.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxHeight: 400, width: '100%', overflowX: 'auto' }}>
        <Table stickyHeader sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} sx={{ fontWeight: 'bold', minWidth: 150 }}>
                  {column.label}
                </TableCell>
              ))}
              {!readOnly && (
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.id} sx={{ minWidth: 150 }}>
                  {renderCell(column, row[column.id], rowIndex)}
                </TableCell>
              ))}
                {!readOnly && (
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => removeRow(rowIndex)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {!readOnly && (
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addRow}
            size="small"
          >
            Add Row
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TableInput;
