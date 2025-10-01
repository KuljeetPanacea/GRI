import React, { useEffect, useState } from "react";
import EnhancedTable from "../../../common/ui/EnhancedTable";
import SearchBar from "../../../common/ui/SearchBar";
import usePVHeader from "../hooks/useAuditProjectHeader";
import AddNewAEInternalAssesssors from "./AddNewAEInternalAssesssors";
import PrimaryButton from "../../../common/ui/PrimaryButton";
import { getAEProjects } from "../../../api/project";
import useAxios from "../../../api/useAxios";

const AEInternalAssessorsList = () => {
  const { project,
    showAEInternalAssesssorsModal,
    closeAEInternalAssesssorsModal,
    openAEInternalAssesssorsModal
 } = usePVHeader();

 const [aeInternal,setAEInternal] = useState([])
 const axiosInstance = useAxios();
  const columns = [
    {
      key: "name",
      header: "Full Name",
    },
    { key: "email", header: "Email" },
    {
      key: "role",
      header: "Role",
    },
    {
      key: "department",
      header: "Department",
    },
    {
      key: "assignedDevice",
      header: "Assigned Device Category",
    },
  ];

  useEffect(()=>{
      const fetchAE = (async ()=>{
        const response = await getAEProjects(axiosInstance,project?._id || "")
        setAEInternal(response)
      })
      fetchAE()
    },[])

  return (
    <React.Fragment>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div
          style={{
            marginBottom:'1rem',
            marginRight:'1rem'
          }}
        >
        <PrimaryButton
          children={"+ Add AE Internal Assessors"}
          onClick={openAEInternalAssesssorsModal}
        />

      </div>
        <div
          style={{
            width: "216px",
            height: "38px",
            marginBottom:'1rem'
          }}
        >
          <SearchBar value={"Search"} onChange={() => {}} />
        </div>
        
      </div>
      <EnhancedTable
        columns={columns}
        data={aeInternal || []}
        showCheckbox={false}
        idField="projectId"
      />
       {showAEInternalAssesssorsModal && (
        <AddNewAEInternalAssesssors 
          open={showAEInternalAssesssorsModal} 
          onClose={closeAEInternalAssesssorsModal} 
        />
    )}
    </React.Fragment>
  );
};

export default AEInternalAssessorsList;
