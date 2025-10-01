import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Dashboard from "../../AELeadership/Dashboard";

const componentMap: { [key: string]: { component: React.FC; displayName: string } } = {
  dashboard: { component: Dashboard, displayName: "Dashboard" },
};

export const useLPMainAreaContainer = () => {
  const selectedMenuItem = useSelector((state: RootState) => state.lpMainArea.selectedItem);
  const selectedKey = selectedMenuItem.toLowerCase();
  const SelectedComponent = componentMap[selectedKey]?.component || Dashboard;
  const selectedDisplayName = componentMap[selectedKey]?.displayName || "Dashboard";

  return { SelectedComponent, selectedDisplayName };
};
