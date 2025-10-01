import { useEffect, useState } from "react";
import { useLPSideMenuBar } from "./hooks/useLPSideMenuBar";
import styles from "./styles/LPSideMenuBar.module.css";
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import { NavLink } from "react-router-dom";
import { Tooltip, useMediaQuery } from "@mui/material";
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';

const iconMap = {
  Dashboard: DashboardRoundedIcon,
  Projects: FolderRoundedIcon,
  Clients: AccountBoxRoundedIcon,
  Users: PeopleAltRoundedIcon,
  DigitalAvatar: MicRoundedIcon,
  Quiz: QuizRoundedIcon,
  DefaultIcon: DisabledByDefaultRoundedIcon,
};

const LPSideMenuBar = () => {
  const { isCollapsed, menuItems, handleToggleSidebar } = useLPSideMenuBar();

  const isMobile = useMediaQuery("(max-width:768px)");
  const [mobileView, setMobileView] = useState(false);

  useEffect(() => {
    setMobileView(isMobile);
  }, [isMobile]);

  return (
    <div
      className={`${styles.sidebar} ${
        isMobile ? styles.mobile : isCollapsed ? styles.collapsed : ""
      }`}
    >
      <div className={styles.menuList}>
        {menuItems?.map((item) => {
          const Icon =
            iconMap[item.icon as keyof typeof iconMap] || iconMap.DefaultIcon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `${styles.menuItem} ${isActive ? styles.activeMenuItem : ""} ${
                  mobileView ? styles.mobileMenuItem : ""
                }`
              }
            >
              {isCollapsed && !mobileView ? (
                <Tooltip
                  key={item.label}
                  title={item.tooltip || item.label}
                  placement="right"
                >
                  <Icon className={styles.icon} />
                </Tooltip>
              ) : (
                <Icon className={styles.icon} />
              )}

              {(mobileView || !isCollapsed) && (
                <span className={styles.label}>{item.label} </span>
              )}
{( !isCollapsed && !mobileView) &&
(<ChevronLeftIcon 
                style={{ transform: "rotate(180deg)", width:'12px' }}
              />)}
            </NavLink>
          );
        })}
      </div>
      {!mobileView && (
        <div className={styles.toolbar} onClick={handleToggleSidebar}>
          <div className={styles.toggleButton}>
            <ChevronLeftIcon
              style={{ transform: isCollapsed ? "rotate(180deg)" : "none", width:'12px'  }}
            />
          </div>
          {!isCollapsed && <span className={styles.label}>Collapse</span>}
        </div>
      )}
    </div>
  );
};

export default LPSideMenuBar;
