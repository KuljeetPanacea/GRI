
import style from '../components/AEPoc.module.css'
import SearchBar from '../../../common/ui/SearchBar'
import { Button, ButtonGroup, FormControl } from '@mui/material';
import SelectDropdown from '../../../common/ui/SelectDropdown';
import useAEPoc from '../useAEPoc';

const AEPocHeader : React.FC = () =>{
    const {setActiveTab,handleComplianceChange,activeTab ,complianceType} = useAEPoc();
  
  return (

    <div className={style.container}>
         <div className={style.PLHeader}>
    <div>
    <h1 className={style.PLHeading}>My Projects</h1>
    </div>
    <div className={style.PLSearch}> 
        <SearchBar value='search' onChange={()=> {}} />
    </div>


    </div>
      {/* Header Section */}
      <div className={style.header}>
        <FormControl className={style.dropdown}>
        <SelectDropdown
       title='Compliance Type'
          options={[
            { value: "PCIDSS", label: "PCI DSS" },
            { value: "ISO27001", label: "ISO 27001" },
            { value: "SOC2", label: "SOC 2" },
            { value: "HIPAA", label: "HIPAA" },
            { value: "GDPR", label: "GDPR" },]}
          value={complianceType}
          onChange={handleComplianceChange}
        />
        </FormControl>

        <ButtonGroup className={style.tabGroup}>
          <Button
            className={`${style.tabButton} ${
              activeTab === "Current" ? style.activeTab : style.inactiveTab
            }`}
            onClick={() => setActiveTab("Current")}
          >
            Current
          </Button>
          <Button
            className={`${style.tabButton} ${
              activeTab === "Prior" ? style.activeTab : style.inactiveTab
            }`}
            onClick={() => setActiveTab("Prior")}
          >
            Prior
          </Button>
        </ButtonGroup>
      </div>
   
      </div>
  )
}

export default AEPocHeader