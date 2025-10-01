import React from "react";
import { Outlet } from "react-router-dom";
import styles from './styles/LandingPage.module.css'

const LPMainAreaContainer: React.FC = () => {
  return (
    <div className={styles.mainContainer}>
      <Outlet /> 
    </div>
  );
};

export default LPMainAreaContainer;
