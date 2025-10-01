import React from "react";
import usePhaseView from "../hooks/usePhaseContainer";
import styles from "../styles/PV360.module.css";

const PhaseContainer: React.FC = () => {
  const { PhaseComponent } = usePhaseView();

  return (
    <div className={styles.phaseView}>
      <PhaseComponent />
    </div>
  );
};

export default PhaseContainer;
