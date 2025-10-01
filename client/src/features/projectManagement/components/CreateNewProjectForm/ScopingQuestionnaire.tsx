import React, { useEffect, useState } from 'react'
import styles from '../../ProjectManagement.module.css'
import SelectDropdown from '../../../../common/ui/SelectDropdown'
import { NewProject } from "../../../../redux/createNewProjectSlice"
import { getScopingQstnr } from "../../../../api/qstnr"
import useAxios from "../../../../api/useAxios"

interface ProjectDetailsProps {
  formData: NewProject;
  handleChange: (field: keyof NewProject, value: string) => void;
}

interface Questionnaire {
  id: string;
  title: string;
  isDeleted: boolean;
  isPublished: boolean;
}

const ScopingQuestionnaire: React.FC<ProjectDetailsProps> = ({ formData, handleChange }) => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([])
  const axios = useAxios(); 

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const data = await getScopingQstnr(axios)
        console.log("This is the scoping questionnaire data", data);
        const filtered = data.filter((q: Questionnaire) => !q.isDeleted)
        setQuestionnaires(filtered)
      } catch (err) {
        console.error("Failed to load scoping questionnaires", err)
      }
    }

    fetchQuestionnaires()
  }, [])

  const options = questionnaires.map(q => ({
    value: q.id,
    label: q.title
  }))

  return (
    <div className={styles.teamDetails}>
      <SelectDropdown
      isMultiple={true}
        options={options}
        value={formData.scopingQSTRNR}
        title="Scoping Questionnaire"
        onChange={(event) => handleChange("scopingQSTRNR", event.target.value)}
      />
    </div>
  )
}

export default ScopingQuestionnaire
