// import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// import DashboardSuperAdmin from "./roles/DashboardSuperAdmin";
// import DashboardAdmin from "./roles/DashboardAdmin";
// import DashboardQSA from "./roles/DashboardQSA";
// import DashboardQA from "./roles/DashboardQA";
import Dashboard from "../AELeadership/Dashboard";
// import DashboardAEPoC from "./roles/DashboardAEPoC";
// import DashboardAEStakeholder from "./roles/DashboardAEStakeholder";

const DashboardRouter = () => {
  const user = useSelector((state: RootState) => state.login.user);

  if (!user) return <div>Loading...</div>;

  const dashboardMap: Record<string, JSX.Element> = {
    // DashboardSuperAdmin: <DashboardSuperAdmin />,
    // DashboardAdmin: <DashboardAdmin />,
    // DashboardQSA: <DashboardQSA />,
    // DashboardQA: <DashboardQA />,
    AELeadership : <Dashboard />,
    // DashboardAEPoC: <DashboardAEPoC />,
    // DashboardAEStakeholder: <DashboardAEStakeholder />,
  };

  const dashboardPermission = user.roles?.find((role) =>
    role.startsWith("")
  );

  const DashboardComponent = dashboardMap[dashboardPermission || ""];
  return DashboardComponent || <div>No Dashboard Found</div>;
};

export default DashboardRouter;
