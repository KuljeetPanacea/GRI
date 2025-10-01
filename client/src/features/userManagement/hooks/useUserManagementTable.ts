import { RootState, useAppSelector } from "../../../redux/store";
import { selectFilteredUsers } from "../../../redux/userManagementSlice";

export const useUserManagementTable = () => {
    const filteredUsers = useAppSelector(selectFilteredUsers);
    const {currentPage, rowsPerPage, totalCount, totalPages} = useAppSelector((state: RootState) => state.userManagement);   
    const currentPageData = filteredUsers.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    console.log("Users in current page data:", currentPageData);

    return { users: filteredUsers, currentPageData, totalPages, currentPage, rowsPerPage, totalCount };
};
