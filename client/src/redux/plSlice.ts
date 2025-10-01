import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { parse, isAfter, isBefore, subDays, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale";


interface Project {
  id: string;
  projectName: string;
  company: string;
  assignedDate: string;
  priority: string;
  status: string;
  pmo: string;
  industry: string;
  size: string;
  aepoc:string;
}

interface FilterState {
  projectStatus: string;
  projectPriority: string;
  activeProjects: string;
}

interface PLState {
  projects: Project[];
  filters: FilterState;
}

const initialState: PLState = {
    projects: [
      {
        id: "1",
        projectName: "HDFC 2024 PCI DSS",
        company: "HDFC",
        assignedDate: "21 Feb 2025",
        priority: "Low",
        status: "New",
        pmo: "Eshmeet Kaur",
        industry: 'Banking',
        aepoc:'Nirmal Sharma',
        size:'250+ (Mid-size Merchant)'
      },
      {
        id: "2",
        projectName: "ICICI 2023 PCI DSS",
        company: "ICICI",
        assignedDate: "5 Feb 2025",
        priority: "High",
        status: "In Progress",
        pmo: "John Doe",
        industry: 'Banking',
        aepoc:'Abhay Singh',
        size:'250+ (Mid-size Merchant)'
      },
    ],
    filters: {
      projectStatus: "",
      projectPriority: "",
      activeProjects: "",
    },
  };

// Function to parse "10 Jan 2024" format to a Date object
const parseCustomDate = (dateStr: string) => {
  return parse(dateStr, "dd MMM yyyy", new Date(), { locale: enUS });
};

// Function to check if a date is within the given range
const isWithinDateRange = (assignedDate: string, filterType: string) => {
  const today = new Date();
  const assigned = parseCustomDate(assignedDate);

  switch (filterType) {
    case "This week":
      return isAfter(assigned, startOfWeek(today)) || assigned.toDateString() === today.toDateString();

    case "Past week":
      return isAfter(assigned, subDays(startOfWeek(today), 7)) && isBefore(assigned, startOfWeek(today));

    case "Past 30 days":
      return isAfter(assigned, subDays(today, 30));

    default:
      return true; // No filter applied
  }
};

// **Selector for filtered projects**
export const selectFilteredProjects = (state: RootState) => {
  const { projects, filters } = state.pl;

  return projects.filter((project) => {
    // Filter by status
    if (filters.projectStatus && project.status !== filters.projectStatus) {
      return false;
    }

    // Filter by priority
    if (filters.projectPriority && project.priority !== filters.projectPriority) {
      return false;
    }

    // Filter by active projects (date-based)
    if (filters.activeProjects && !isWithinDateRange(project.assignedDate, filters.activeProjects)) {
      return false;
    }

    return true;
  });
};

// Redux slice
const plSlice = createSlice({
  name: "pl",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ key: keyof FilterState; value: string }>) => {
      state.filters[action.payload.key] = action.payload.value;
    },
  },
});

export const { setFilter } = plSlice.actions;
export default plSlice.reducer;
