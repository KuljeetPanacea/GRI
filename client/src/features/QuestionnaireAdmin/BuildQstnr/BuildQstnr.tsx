import QstnrHeader from "./components/QstnrHeader";
import styles from "./BuildQstnr.module.css"; // Import external CSS
import AddQstnMenu from "./components/AddQstnMenu";
import QstnrNoOfQstnList from "./components/QstnrQstnList";
import QuestionSettings from "./components/QuestionSettings";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addQstnrId } from "../../../redux/defineQstnrSlice";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const BuildQstnr = () => {
  const query = useQuery();
  const dispatch = useDispatch();
  const questionnaireId = query.get("questionnaireId");
  
  if (questionnaireId) {
    dispatch(addQstnrId(questionnaireId));
  }

  return (
    <div className={styles.buildQstnrContainer}>
      <div className={styles.addQstnMenu}>
        <AddQstnMenu />
        <QstnrNoOfQstnList />
      </div>
      <div className={styles.buildQstnrContent}>
        <QstnrHeader />
      </div>
      <QuestionSettings />
    </div>
  );
};

export default BuildQstnr;
