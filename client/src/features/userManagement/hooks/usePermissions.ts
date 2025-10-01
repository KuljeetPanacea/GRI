import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { User } from "../../../redux/userManagementSlice";

export const usePermissions = () => {
  const currentUser = useSelector((state: RootState) => state.login.user);

  const canEditUser = (targetUser: User) => {
    if (!currentUser) return false;
    const isSameAdmin = currentUser.id === targetUser.id;
    const isAdmin = currentUser.roles.includes("ProjectManager");
    const isSuperAdmin = currentUser.roles.includes("SuperAdmin");
    if (targetUser.roles.includes("ProjectManager")) {
      return isSuperAdmin || (isAdmin && isSameAdmin);
    }
    return true;
  };

  const canDeleteUser = (targetUser: User) => {
    if (!currentUser) return false;
    const isSuperAdmin = currentUser.roles.includes("SuperAdmin");

    if (targetUser.roles.includes("ProjectManager")) {
      return isSuperAdmin ;
    }
    return true;
  };

  return { canEditUser, canDeleteUser };
};
