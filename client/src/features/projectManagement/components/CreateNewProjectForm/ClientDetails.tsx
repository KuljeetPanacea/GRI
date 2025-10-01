import React, { useEffect, useState } from "react";
import TextInput from "../../../../common/ui/TextInput";
import styles from "../../ProjectManagement.module.css";
import { Typography, Autocomplete } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { NewProject, updateSelectedClient } from "../../../../redux/createNewProjectSlice";
import { getClients } from "../../../../api/client";
import useAxios from "../../../../api/useAxios";
import { useAppDispatch } from "../../../../redux/store";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store"; 

interface Client {
  clientName: string;
  clientId: string;
  businessName: string;
  websiteLink: string;
  pocName: string;
  pocContactNumber: string;
  pocEmailId: string;
  leadershipName: string;
  leadershipEmailId: string;
  leadershipContactNo: string;

}

interface ProjectDetailsProps {
  handleChange: (field: keyof NewProject, value: string) => void;
}

const ClientDetails: React.FC<ProjectDetailsProps> = ({ handleChange }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const axiosInstance = useAxios();
  const dispatch = useAppDispatch();

  // Get the selected client data directly from the Redux store
  const selectedClientData = useSelector((state: RootState) => state.createNewProject.client);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientList = await getClients(axiosInstance);
        setClients(clientList.clients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = clients.filter((client) =>
        client.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients([]);
    }
  }, [searchTerm]);

  const handleClientSelect = (value: Client | null) => {
    if (value) {
      handleChange("client", value.clientId);
      dispatch(updateSelectedClient({
        clientName: value.clientName,
        clientDBA: value.businessName,
        clientEmailAddress: value.pocEmailId,
        clientContactNumber: value.pocContactNumber,
        clientPocName: value.pocName,
        clientWebsiteLink: value.websiteLink,
        leadershipContactNo: value.leadershipContactNo,
        leadershipEmailId: value.leadershipEmailId,
        leadershipName: value.leadershipName 
      }));
    }
  };

  return (
    <React.Fragment>
      <div className={styles.details}>
        <div className={styles.formRow}>
          <div>
            <Typography variant="body2">Client Name</Typography>
           <Autocomplete
  options={filteredClients}
  getOptionLabel={(option) => option.clientName}
  inputValue={searchTerm}
  onInputChange={(_event, newInputValue, reason) => {
    setSearchTerm(newInputValue);
    // If input is cleared, also clear the selected client in Redux
    if (reason === "clear" || newInputValue === "") {
      dispatch(updateSelectedClient({}));
      handleChange("client", "");
    }
  }}
  onChange={(_event, value) => {
    if (value) {
      setSearchTerm(value.clientName);
      handleClientSelect(value);
    } else {
      setSearchTerm("");
      dispatch(updateSelectedClient({}));
      handleChange("client", "");
    }
  }}
  renderInput={(params) => (
    <div ref={params.InputProps.ref}>
      <div className={styles.customInputWrapper}>
        <input
          {...params.inputProps}
          placeholder="Write client name"
          className={styles.customInput}
        />
        <div className={styles.searchIconWrapper}>
          <SearchIcon className={styles.searchIcon} />
        </div>
      </div>
      {/* Preserve the hidden input for Autocomplete functionality */}
      <input type="hidden" {...params.inputProps} />
    </div>
  )}
/>
          </div>
          <div>
            <Typography variant="body2">Doing business as (DBA)</Typography>
            <TextInput
              className={styles.clientTextInput}
              value={selectedClientData?.clientDBA || ""}
              onChange={() => {}}
              disabled
              placeholder="Write client's business name"
            />
          </div>
          <div>
            <Typography variant="body2">Website link</Typography>
            <TextInput
              className={styles.clientTextInput}
              value={selectedClientData?.clientWebsiteLink || ""}
              onChange={() => {}}
              disabled
              placeholder="Add business website link"
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div>
            <Typography variant="body2">POC name</Typography>
            <TextInput
              className={styles.clientTextInput}
              value={selectedClientData?.clientPocName || ""}
              onChange={() => {}}
              disabled
              placeholder="Write point of contact's name"
            />
          </div>
          <div>
            <Typography variant="body2">Contact number</Typography>
            <TextInput
              className={styles.clientTextInput}
              value={selectedClientData?.clientContactNumber || ""}
              onChange={() => {}}
              disabled
              placeholder="Enter POC's contact number"
            />
          </div>
          <div>
            <Typography variant="body2">Email address</Typography>
            <TextInput
              className={styles.clientTextInput}
              value={selectedClientData?.clientEmailAddress || ""}
              onChange={() => {}}
              disabled
              placeholder="Enter POC's email address"
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div>
            <Typography variant="body2">AELeadership Name</Typography>
            <TextInput
              className={styles.clientTextInput}
              value={selectedClientData?.leadershipName|| ""}
              onChange={() => {}}
              disabled
              placeholder="Write AELeadership's name"
            />
          </div>
          <div>
            <Typography variant="body2">AELeadership Contact number</Typography>
            <TextInput
              className={styles.clientTextInput}
              value={selectedClientData?.leadershipContactNo || ""}
              onChange={() => {}}
              disabled
              placeholder="Enter AELeadership's contact number"
            />
          </div>
          <div>
            <Typography variant="body2">AELeaderShip Email address</Typography>
            <TextInput
              className={styles.clientTextInput}
              value={selectedClientData?.leadershipEmailId || ""}
              onChange={() => {}}
              disabled
              placeholder="Enter AELeadership's email address"
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ClientDetails;
