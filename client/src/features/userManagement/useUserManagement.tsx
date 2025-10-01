import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "../../redux/store";
import { setViewMode, fetchUsers } from "../../redux/userManagementSlice";
import {
  openAddNewUserModal,
  closeAddNewUserModal,
  addUser,
} from "../../redux/AddNewUserSlice";
import useAxios from "../../api/useAxios";
import { validateEmail } from "./utils/validateEmail";
import { validatePhone } from "./utils/validatePhone";
import { showSnackbar } from "../../redux/userManagementSlice";
import { AxiosInstance } from "axios";
import { getLookup } from "../../api/lookup";
export const useUserManagement = () => {
  const dispatch: AppDispatch = useDispatch();
  const viewMode = useSelector(
    (state: RootState) => state.userManagement.viewMode
  );
  const users = useSelector((state: RootState) => state.userManagement.users);
  const axiosInstance = useAxios();
  const open = useSelector(
    (state: RootState) => state.usermodal.isAddUserModalOpen
  );
  // const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRole] = useState<string[]>([]);
  const [mobileNumber, setMobileNumber] = useState("");
  const [roleError, setRoleError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const { currentPage } = useAppSelector(
    (state: RootState) => state.userManagement
  );
  const [createUserRoles, setCreateUserRoles] = useState<string[]>([]);
  const usersOnboarded = useSelector(
    (state: RootState) => state.userManagement.usersOnboarded
  );
  const search = useSelector((state: RootState) => state.userManagement.search);

  const handleCreateUser = async () => {
    let hasError = false;
    if (!name || !email || !mobileNumber) {
      alert("Please fill in all required fields.");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError(true);
      hasError = true;
    }
    if (roles.length === 0) {
      setRoleError(true);
      hasError = true;
    }
    if (!validatePhone(mobileNumber)) {
      setPhoneError(true);
      hasError = true;
    }

    if (hasError) return;

    const userData = {
      username: email,
      email,
      password: "Test@123",
      roles,
      name,
      countryCode: 91,
      mobileNumber: Number(mobileNumber),
      __v: 0,
    };

    const resultAction = await dispatch(addUser({ userData, axiosInstance }));

    if (addUser.rejected.match(resultAction)) {
      const error = resultAction.payload as {
        message: string;
        status?: number;
      };

      if (error?.status === 409) {
        setEmailError(true);
        setEmailErrorMessage("User already exists with this email ID.");
        return;
      }

      dispatch(
        showSnackbar({
          message: `Failed to create user: ${
            error?.message || "Unknown error"
          }`,
          severity: "error",
        })
      );
      return;
    }

    handleAddNewUserClose();

    dispatch(
      fetchUsers({
        axiosInstance,
        page: currentPage,
        limit: 5,
        filters: {
          search,
          status,
          usersOnboarded,
          roles: Array.isArray(roles) ? roles.join(",") : roles,
        },
      })
    );
    dispatch(
      showSnackbar({
        message: "User added successfully.",
        severity: "success",
      })
    );
  };

  const handleAddNewUserClick = () => {
    dispatch(openAddNewUserModal());
  };

  const handleAddNewUserClose = () => {
    dispatch(closeAddNewUserModal());
    setName("");
    setEmail("");
    setRole([]);
    setMobileNumber("");
    setEmailError(false);
    setRoleError(false);
    setPhoneError(false);
    setEmailErrorMessage("");
  };

  const handleViewChange = (newViewMode: "list" | "grid" | null) => {
    if (newViewMode) {
      dispatch(setViewMode(newViewMode));
    }
  };

  const fetchRoles = async (axiosInstance: AxiosInstance) => {
    try {
      const formattedOptions = await getLookup("CreateUserRole", axiosInstance);
      setCreateUserRoles(formattedOptions);
    } catch (error) {
      console.log("Error fetching CreateUserRole options", error);
    }
  };

  return {
    open,
    handleViewChange,
    viewMode,
    handleAddNewUserClick,
    handleAddNewUserClose,
    users,
    name,
    setName,
    email,
    setEmail,
    roles,
    setRole,
    mobileNumber,
    setMobileNumber,
    fetchRoles,
    handleCreateUser,
    roleError,
    setRoleError,
    emailError,
    setEmailError,
    phoneError,
    setPhoneError,
    emailErrorMessage,
    setEmailErrorMessage,
    createUserRoles,
    usersOnboarded,
  };
};

export default useUserManagement;
