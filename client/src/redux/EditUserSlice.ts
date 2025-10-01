import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isEditUserModalOpen: false,
};

const editUserSlice = createSlice({
    name: "editUser",
    initialState,
    reducers: {
        openEditUserModal: (state) => {
            state.isEditUserModalOpen = true;
        },
        closeEditUserModal: (state) => {
            state.isEditUserModalOpen = false;
        },
    },
});

export const { openEditUserModal, closeEditUserModal } = editUserSlice.actions;
export default editUserSlice.reducer;
