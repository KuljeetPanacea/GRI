import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const useProjectView = () => {
  const project = useSelector((state: RootState) => state.projectView.selectedProject) 
    || JSON.parse(localStorage.getItem("selectedProject") || "null");

  return { project };
};

export default useProjectView;
