import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../../../redux/scopingSlice";
import styles from "./ScopingView.module.css";
import Questionnaire from "./components/Questionnaire";
import ScopingQuestionnaire from "./components/ScopingQuestionnaire";
import QuestionList from "./components/QuestionList";
import ScopeGraph from "./components/ScopeGraph";
import CDEDocuments from "./components/CDEDocuments";
import { RootState } from "../../../../redux/store";
import ScopeDocuments from "./components/ScopeDocuments";
import useScopingQuestionnaire from "./hooks/useScopingQuestionnaire";

const ScopingView = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.scoping.activeTab);
  const { questionnaires, isLoading, error } = useScopingQuestionnaire();

  const handleTabClick = (tabName: string) => {
    dispatch(setActiveTab(tabName));
  };

  return (
    <div>
      <div className={styles.ScopingtabContainer}>
        {[
          "Questionnaire",
          "Question List",
          "Scope Graph",
          "CDE Documents",
          "Scope Documents",
        ].map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${
              activeTab === tab ? styles.activeTab : ""
            }`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {activeTab === "Questionnaire" && <ScopingQuestionnaire />}
        {activeTab === "Question List" && (
          <QuestionList 
            questionnaires={questionnaires} 
            isLoading={isLoading} 
            error={error} 
          />
        )}
        {activeTab === "Scope Graph" && <ScopeGraph />}
        {activeTab === "CDE Documents" && <CDEDocuments />}
        {activeTab === "Scope Documents" && <ScopeDocuments />}
      </div>
    </div>
  );
};

export default ScopingView;
