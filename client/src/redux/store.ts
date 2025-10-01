import { combineReducers, configureStore } from "@reduxjs/toolkit";
import loginReducer from "./loginSlice";
import lpSideMenuReducer from "./lpSideMenuSlice";
import lpMainAreaReducer from "./lpMainAreaSlice";
import userManagementReducer from "./userManagementSlice";
import modalReducer from "./DeleteUserModalSlice";
import newUserModalReducer from "./AddNewUserSlice";
import editUserReducer from "./EditUserSlice";
import clientManagementReducer from "./clientManagementSlice";
import editClientReducer from "./EditClientSlice";
import newClientModalReducer from "./AddNewClientSlice";
import clientDeleteModalReducer from "./DeleteClientModalSlice";
import QstnrQuestionReducer from "./qstnrQuestion";
import qstnrFilterReducer from "./qstnrFilterSlice";
import defineQstnrReducer from "./defineQstnrSlice";
import projectViewReducer from "./projectViewSlice";
import phaseReducer from "./phaseSlice";
import scopingReducer from "./scopingSlice";
import scopeDocumentReducer from './scopeDocumentSlice';
import viewReducer from "./viewSlice";
import plReducer from "./plSlice";
import deviceIdentificationReducer from "./deviceIdentificationSlice";
import salesScopingReducer from "./salesScopingSlice";
import projectmodalReducer from "./DeleteProjectModalSlice";
import projectManagementReducer from "./projectManagementSlice";
import assessmentReducer from "./assessmentSlice";
import createNewProjectReducer from "./createNewProjectSlice";
import digitalAvatarReducer from "./DigitalAvatarSlice";
import gapRemedaitionReducer from "./GapsRemediationSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import complianceReportReducer from "./complianceReportSlice";
import rocReducer from "./rocSlice";
import forbiddenReducer from './forbiddenSlice';
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";


const persistConfig = {
  key: "root",
  storage,
  whitelist: ["login","projectView","gapsRemediation","projectManagement","assessment", "phase","defineQstnr","qstnrQuestion"], 
};


const rootReducer = combineReducers({
  login: loginReducer,
  lpSideMenu: lpSideMenuReducer,
  lpMainArea: lpMainAreaReducer,
  userManagement: userManagementReducer,
  userDeleteModal: modalReducer,
  clientDeleteModal: clientDeleteModalReducer,
  usermodal: newUserModalReducer,
  editUser: editUserReducer,
  clientManagement: clientManagementReducer,
  clientmodal: newClientModalReducer,
  editClient: editClientReducer,
  filters: qstnrFilterReducer,
  defineQstnr: defineQstnrReducer,
  qstnrQuestion: QstnrQuestionReducer,
  salesScoping: salesScopingReducer,
  assessment: assessmentReducer,
  projectView: projectViewReducer,
  phase: phaseReducer,
  scoping: scopingReducer,
  complianceReport : complianceReportReducer,
  scopeDocument: scopeDocumentReducer,
  view: viewReducer,
  pl: plReducer,
  deviceIdentification: deviceIdentificationReducer,
  projectDeleteModal: projectmodalReducer,
  projectManagement: projectManagementReducer,
  createNewProject: createNewProjectReducer,
  digitalAvatar: digitalAvatarReducer,
  gapsRemediation: gapRemedaitionReducer,
  roc: rocReducer,
  forbidden: forbiddenReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
