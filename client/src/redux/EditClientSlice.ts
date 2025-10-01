import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isEditClientModalOpen: false,
};

const editClientSlice = createSlice({
    name: "editClient",
    initialState,
    reducers: {
        openEditClientModal: (state) => {
            state.isEditClientModalOpen = true;
        },
        closeEditClientModal: (state) => {
            state.isEditClientModalOpen = false;
        },
    },
});

export const { openEditClientModal, closeEditClientModal } = editClientSlice.actions;
export default editClientSlice.reducer;