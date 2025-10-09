import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { Card, List, ListItem, ListItemText } from "@mui/material";
import styles from "../BuildQstnr.module.css";
import useBuildQstnr from "../useBuildQstnr";
import { useEffect, useRef } from "react";

const QstnrNoOfQstnList = () => {
  const questions = useSelector(
    (state: RootState) => state.qstnrQuestion.questions
  );
  const selectedQuestionId = useSelector(
    (state: RootState) => state.qstnrQuestion.selectedQuestion?._id
  );
  const { selectQstn } = useBuildQstnr();
  const dispatch = useDispatch();

  const effectHasRun = useRef(false);


  useEffect(() => {
    // Only run this effect once when questions are available
    if (!effectHasRun.current && questions.length > 0 && questions[0]._id) {
      console.log("Questions are available, selecting first question:", questions[0]._id);
      selectQstn(questions[0]._id);
      effectHasRun.current = true;
    } else if (!effectHasRun.current && questions.length === 0) {
      console.log("No questions available, setting newQuestion to false");
    }
  }, [questions, selectQstn, dispatch]); 

  return (
    <Card
      className={styles.listCard}
      elevation={0}
      style={{ boxShadow: "none" }}
    >
      <List>
        {questions.length === 0 ? (
          <ListItem>
            <ListItemText 
              primary="No questions found" 
              secondary="Add a question to get started"
            />
          </ListItem>
        ) : (
          questions.map((question, index) => {
            const displayText = question.text?.trim() || 
                               `Question ${index + 1} (${question.type?.replace('_', ' ') || 'Unknown Type'})`;
            
            return (
              <ListItem
                key={question._id}
                className={styles.listItem}
                onClick={() => question._id && selectQstn(question._id)}
                style={
                  question._id === selectedQuestionId
                    ? { backgroundColor: "#e3f2fd" } // Light blue background for selected item
                    : {}
                }
              >
                <ListItemText 
                  primary={`${index + 1}. ${displayText}`}

                />
              </ListItem>
            );
          })
        )}
      </List>
    </Card>
  );
};

export default QstnrNoOfQstnList;