import { Users, Mail } from 'lucide-react';
import styles from './stakeholders.module.css';
import useDashboard from '../useDashboard';


type Stakeholder = {
  name: string;
  email?: string;
  role: string;
};

const Stakeholders = () => {
  const { project } = useDashboard();

  const stakeholders = project?.assignedTo || [];

  return (
    <div>
      <div className={styles.header}>
        <Users className={styles.headerIcon} />
        <h3 className={styles.title}>Stakeholders</h3>
      </div>

      <div className={styles.grid}>
        {stakeholders.map((stakeholder: Stakeholder, idx: number) => {
          const initials = stakeholder.name
            .split(' ')
            .map((word: string) => word[0])
            .join('')
            .toUpperCase();

          let color = '#F3F4F6';
          let textColor = '#374151';

          if (stakeholder.role === 'QSA') {
            color = '#E9D5FF';
            textColor = '#9333EA';
          } else if (stakeholder.role.includes('AE')) {
            color = '#DBEAFE';
            textColor = '#2563EB';
          } else if (stakeholder.role.includes('Client')) {
            color = '#D1FAE5';
            textColor = '#059669';
          }

          return (
            <div key={idx} className={styles.stakeholderCard}>
              <div className={styles.avatar}>{initials}</div>

              <div className={styles.stakeholderInfo}>
                <h4 className={styles.name}>{stakeholder.name}</h4>

                <span
                  className={styles.roleBadge}
                  style={{
                    backgroundColor: color,
                    color: textColor,
                  }}
                >
                  {stakeholder.role}
                </span>

                {/* {stakeholder.email && ( */}
                  <div className={styles.email}>
                    <Mail className={styles.emailIcon} />
                    {stakeholder.email || "example@gmail.com"}
                  </div>
                {/* )} */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stakeholders;
