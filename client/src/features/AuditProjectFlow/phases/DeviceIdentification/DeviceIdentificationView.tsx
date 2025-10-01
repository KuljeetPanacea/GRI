import { useDispatch } from "react-redux";
import { setActiveTab, setModalOpen, setSearchTerm } from "../../../../redux/deviceIdentificationSlice";
import styles from "./DeviceIdentificationView.module.css";
import Device from "./components/Device";
import SearchBar from "../../../../common/ui/SearchBar";
import AddDeviceModal from "./components/AddDeviceModel";
import { useDeviceIdentification } from "./useDeviceIdentificationView";
import CDEDocuments from "../Scoping/components/CDEDocuments";

const DeviceIdentificationView = () => {
  const dispatch = useDispatch();
  const {
    activeTab,
    searchTerm,
    isModalOpen,
  } = useDeviceIdentification(); 
  
  const handleTabClick = (tabName: string) => {
    dispatch(setActiveTab(tabName));
  };

  return (
    <div className={styles.deviceContainer}>
      
      <div className={styles.headerContainer}>
        <div className={styles.ScopingtabContainer}>
          {["Device", "CDE Documents"].map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={styles.rightControls}>
          <button
            className={styles.addDeviceButton}
            onClick={() => dispatch(setModalOpen(true))}
          >
            + Add Device
          </button>
          <AddDeviceModal isOpen={isModalOpen} onClose={() => dispatch(setModalOpen(false))} />
          <div className={styles.searchBarContainer}>
            <SearchBar
              className={styles.searchBar}
              value={searchTerm}
              
              onChange={(e) => dispatch(setSearchTerm(e.target.value))} 
            />
          </div>
        </div>
      </div>

     
      <div className={styles.tabContent}>
        {activeTab === "Device" && <Device />}
        {activeTab === "CDE Documents" && <CDEDocuments />}
      </div>

      
    </div>
  );
};

export default DeviceIdentificationView;