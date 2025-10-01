import React, { ReactNode } from "react";
import { styled } from "@mui/material";
import { IconButton, Tooltip, Checkbox } from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useNavigate } from "react-router-dom";

export const TableContainer = styled("div")({
  width: "100%",
  overflow: "hidden",
});

export const StyledTable = styled("table")({
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0px 2px",
  borderRadius: "6px",
});

export const StyledTableHead = styled("thead")({
  backgroundColor: "#f9fafb",
  borderRadius: "6px",
  display: "table-header-group", // Ensures proper table rendering
  "& tr": {
    position: "relative",
  },
  "& tr::after": {
    content: '""',
    display: "block",
    height: "12px", // Adds space **below the header row only**
  },
});

export const StyledTableHeaderCell = styled("th")({
  padding: "6px 16px",
  textAlign: "left",
  color: "#6b7280",
  fontWeight: 500,
  backgroundColor: "#f1f1f1",
  fontSize: "1rem",
  border: "1px solid #EAEAEA",
  "&:first-of-type": {
    paddingLeft: "24px",
    borderTopLeftRadius: "6px",
    borderBottomLeftRadius: "6px",
  },
  "&:last-of-type": {
    paddingRight: "24px",
    borderTopRightRadius: "6px",
    borderBottomRightRadius: "6px",
  },
});

export const StyledTableBody = styled("tbody")({
  "& tr:hover": {
    backgroundColor: "#f9fafb",
  },
});

export const StyledTableCell = styled("td")({
  padding: "6px 16px",
  fontSize: "14px",
  border: "1px solid #e5e7eb",
  backgroundColor: "#fff",
  color: "#374151",
  "&:first-of-type": {
    paddingLeft: "24px",
  },
  "&:last-of-type": {
    paddingRight: "24px",
  },
});

export const StyledTableRow = styled("tr")({
  transition: "background-color 0.2s ease",
  "& td:first-child": {
    borderTopLeftRadius: "6px",
    borderBottomLeftRadius: "6px",
  },
  "& td:last-child": {
    borderTopRightRadius: "6px",
    borderBottomRightRadius: "6px",
  },
});

export const IconsCell = styled("div")({
  display: "flex",
  gap: "8px",
  alignItems: "center",
  justifyContent: "flex-start",
});

export const StatusCell = styled("div")<{
  status: "active" | "inactive" | "draft";
}>((props) => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 12px",
  borderRadius: "16px",
  fontSize: "12px",
  fontWeight: 500,
  backgroundColor:
    props.status === "active"
      ? "#ecfdf5"
      : props.status === "draft"
      ? "#eff6ff"
      : "#f3f4f6",
  color:
    props.status === "active"
      ? "#059669"
      : props.status === "draft"
      ? "#3b82f6"
      : "#6b7280",
}));

interface TableIcon {
  icon: ReactNode;
  onclick?: () => void;
  tooltip?: string;
}

interface TableColumn {
  key: string;
  header: ReactNode;
  render?: (value: any, row: any) => ReactNode;
  icons?: TableIcon[];
}

interface EnhancedTableProps {
  columns: TableColumn[];
  data: any[];
  onRowClick?: (row: any) => void;
  showCheckbox?: boolean;
  selectedRows?: string[];
  onRowSelect?: (selectedIds: string[]) => void;
  idField?: string;
  getRowStyle?: (row: any) => React.CSSProperties;
  getRowLink?: (row: any) => string | undefined;
}

export const EnhancedTable: React.FC<EnhancedTableProps> = ({
  columns,
  data,
  onRowClick,
  showCheckbox = false,
  selectedRows = [],
  onRowSelect,
  idField = "id",
  getRowStyle,
  getRowLink,
}) => {
  const navigate = useNavigate();
  const handleCheckboxChange = (rowId: string) => {
    if (!onRowSelect) return;

    const newSelected = selectedRows.includes(rowId)
      ? selectedRows.filter((id) => id !== rowId)
      : [...selectedRows, rowId];

    onRowSelect(newSelected);
  };

  const handleHeaderCheckboxChange = () => {
    if (!onRowSelect) return;

    const allIds = data.map((row) => row[idField]);
    const newSelected = selectedRows.length === data.length ? [] : allIds;

    onRowSelect(newSelected);
  };

  return (
    <TableContainer>
      <StyledTable>
        <StyledTableHead>
          <StyledTableRow>
            {showCheckbox && (
              <StyledTableHeaderCell style={{ width: "48px" }}>
                <Checkbox
                  checked={
                    data?.length > 0 && selectedRows.length === data.length
                  }
                  indeterminate={
                    selectedRows.length > 0 && selectedRows.length < data.length
                  }
                  onChange={handleHeaderCheckboxChange}
                  size="small"
                  icon={<RadioButtonUncheckedIcon />}
                  checkedIcon={<CheckCircleIcon />}
                  indeterminateIcon={<RemoveCircleOutlineIcon />}
                  sx={{
                    color: "#DB1F42",
                    "&.Mui-checked": {
                      color: "#DB1F42",
                    },
                    "&.MuiCheckbox-indeterminate": {
                      color: "#DB1F42",
                    },
                  }}
                />
              </StyledTableHeaderCell>
            )}
            {columns.map((column, index) => (
              <StyledTableHeaderCell key={index}>
                {column.header}
              </StyledTableHeaderCell>
            ))}
          </StyledTableRow>
          <div style={{ marginBottom: "4px" }}></div>
        </StyledTableHead>
        <StyledTableBody>
          {data?.map((row, rowIndex) => (
            <StyledTableRow
              key={rowIndex}
              onClick={() => {
                const path = getRowLink?.(row);
                if (path) {
                  navigate(path);
                  return;
                }
                onRowClick?.(row);
              }}
              sx={{
                backgroundColor: getRowStyle?.(row)?.backgroundColor,
                borderTop: getRowStyle?.(row)?.borderTop,
                cursor: onRowClick || getRowLink ? "pointer" : "default",
              }}
            >
              {showCheckbox && (
                <StyledTableCell style={{ width: "48px" }}>
                  <Checkbox
                    checked={selectedRows.includes(row[idField])}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleCheckboxChange(row[idField]);
                    }}
                    size="small"
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                    indeterminateIcon={<RemoveCircleOutlineIcon />}
                    sx={{
                      color: "#DB1F42",
                      "&.Mui-checked": {
                        color: "#DB1F42",
                      },
                      "&.MuiCheckbox-indeterminate": {
                        color: "#DB1F42",
                      },
                    }}
                  />
                </StyledTableCell>
              )}
              {columns.map((column, cellIndex) => (
                <StyledTableCell
                  key={cellIndex}
                  style={{
                    borderTop: getRowStyle?.(row)?.borderTop,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                     {row &&
                      (column.render
                        ? column.render(row[column.key as string], row)
                        : (row[column.key as string] as React.ReactNode))}

                    {column.icons && (
                      <IconsCell>
                        {column.icons.map((iconConfig, iconIndex) => (
                          <Tooltip
                            key={iconIndex}
                            title={iconConfig.tooltip || ""}
                            placement="top"
                          >
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                iconConfig?.onclick?.();
                              }}
                            >
                              {iconConfig.icon}
                            </IconButton>
                          </Tooltip>
                        ))}
                      </IconsCell>
                    )}
                  </div>
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </StyledTableBody>
      </StyledTable>
    </TableContainer>
  );
};

export default EnhancedTable;
