import React, { useEffect, useState } from "react";
import styles from "../../ProjectManagement.module.css";
import SelectDropdown from "../../../../common/ui/SelectDropdown";
import { assignedEntity, NewProject } from "../../../../redux/createNewProjectSlice";
import useAxios from "../../../../api/useAxios";
import { getUserByRole } from "../../../../api/user";
import { User } from "../../../../redux/userManagementSlice";
interface ProjectDetailsProps {
  formData: NewProject;
  handleChange: (field: keyof NewProject, value: assignedEntity[]) => void;
}

interface DropdownOption {
  label: string;
  value: string;
}

const AuditTeamDetails: React.FC<ProjectDetailsProps> = ({
  formData,
  handleChange,
}) => {
  const axiosInstance = useAxios();
  const [Auditor, setAuditor] = useState<DropdownOption[]>([]);
  const [QA, setQA] = useState<DropdownOption[]>([]);
  useEffect(() => {
    const fetchQSA = async () => {
      try {
        const responseOfQSA = await getUserByRole(axiosInstance, "Auditor");
        const responseofQA = await getUserByRole(axiosInstance, "QA");
        const responseAELeadership = await getUserByRole(axiosInstance, "AELeadership");

        const QSAvalues = responseOfQSA.map((user: User) => ({
          label: `${user.name} (${user.email})`,
          value: user.id,
        }));
        const QAvalues = responseofQA.map((user: User) => ({
          label: `${user.name} (${user.email})`,
          value: user.id,
        }));


         const leadershipEmail = formData.auditEntity?.leadershipEmailId?.trim();
    if (leadershipEmail) {
      const matchedLeadership = responseAELeadership.find(
        (user: User) => user.email.trim().toLowerCase() === leadershipEmail.toLowerCase()
      );

      if (matchedLeadership) {
        const alreadyAssigned = formData.assignedTo?.some(
          (entity) => entity.role === "AELeadership"
        );

        if (!alreadyAssigned) {
          const updatedAssignedEntities = [
            ...(formData.assignedTo || []),
            {
              id: matchedLeadership.id,
              role: "AELeadership",
              name: matchedLeadership.name,
            },
          ];
          handleChange("assignedTo", updatedAssignedEntities);
        }
      }
    }

        setAuditor(QSAvalues);
        setQA(QAvalues);
      } catch (error) {
        console.error("Error fetching Auditor:", error);
      }
    };
    fetchQSA();
  }, []);

  const handleAssignChange = (role: string, selectedUserId: string, options: DropdownOption[]) => {
    const selectedUser = options.find((option) => option.value === selectedUserId);

    if (!selectedUser) return; // If somehow not found, don't proceed

    const updatedAssignedEntities = formData.assignedTo
      ? formData.assignedTo.filter((entity) => entity.role !== role)
      : [];

    updatedAssignedEntities.push({ id: selectedUserId, role, name: selectedUser.label.split(" (")[0] });
    handleChange("assignedTo", updatedAssignedEntities);
  };
  return (
    <div className={styles.teamDetails}>
      <SelectDropdown
        options={Auditor}
        value={
          formData.assignedTo?.find((entity) => entity.role === "Auditor")?.id || ""
        }
        title="Auditor (Qualified Security Assessor)"
        onChange={(event) => {
          handleAssignChange("Auditor", event.target.value, Auditor);
        }}
      />
      <SelectDropdown
        options={QA}
        value={
          formData.assignedTo?.find((entity) => entity.role === "QA")?.id || ""
        }
        title="QA"
        onChange={(event) => {
          handleAssignChange("QA", event.target.value, QA);
        }}
      />
    </div>
  );
};

export default AuditTeamDetails;
