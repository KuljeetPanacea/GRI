import { Building2, CheckCircle, Clock, Target, AlertCircle } from 'lucide-react';
import styles from './departmentProgress.module.css';
import useDashboard from '../useDashboard';

const DepartmentProgress = () => {
  const { project, departments, gaps } = useDashboard();

  const currentStage = project?.currentAuditStage?.toLowerCase();

  const isScopingStage = currentStage === 'scoping';
  const isGapStage = currentStage === 'gap';

  if (isScopingStage) {
    return (
      <div>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <Target className={styles.headerIcon} />
            <h2 className={styles.title}>Scoping Phase</h2>
          </div>
        </div>
        <div className={styles.scopingContainer}>
          <div className={styles.scopingCard}>
            <div className={styles.scopingIcon}>
              <Target size={32} style={{ color: '#F97316' }} />
            </div>
            <div className={styles.scopingContent}>
              <h3 className={styles.scopingTitle}>Scoping Phase in Progress</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isGapStage) {
    return (
      <div>
        {/* Gap Phase Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <AlertCircle className={styles.headerIcon} />
            <h2 className={styles.title}>Gap Phase Department Progress</h2>
          </div>
        </div>

        {/* Gap Department Cards */}
        <div className={styles.grid}>
          {gaps?.filteredGaps?.map((gap, idx: number) => {
            const total = gap.identifiedGaps?.length || 0;
            const pending = gap.identifiedGaps?.filter(g => g.status === 'Yet to send').length || 0;
            const submitted = total - pending;
            const completion = total > 0 ? Math.round((submitted / total) * 100) : 0;
            const color = completion < 50 ? 'red' : 'blue';

            return (
              <div key={idx} className={styles.card}>
                <h3 className={styles.departmentName}>{gap.department || 'Unknown'}</h3>
                <div className={styles.completionLabel}>Completion</div>
                <div className={styles.progressBar}>
                  <div
                    className={`${styles.progressFill} ${
                      color === 'red' ? styles.progressFillRed : styles.progressFillBlue
                    }`}
                    style={{ width: `${completion}%` }}
                  ></div>
                </div>
                <div className={styles.completionPercentage}>{completion}%</div>

                <div className={styles.statusRow}>
                  <div className={styles.statusItem}>
                    <CheckCircle className={`${styles.statusIcon} ${styles.statusIconGreen}`} />
                    <span className={styles.statusLabel}>Submitted</span>
                    <span className={`${styles.statusValue} ${styles.statusValueGreen}`}>
                      {submitted}
                    </span>
                  </div>
                  <div className={styles.statusItem}>
                    <Clock className={`${styles.statusIcon} ${styles.statusIconOrange}`} />
                    <span className={styles.statusLabel}>Pending</span>
                    <span className={`${styles.statusValue} ${styles.statusValueOrange}`}>
                      {pending.toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Default Assessment Phase
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Building2 className={styles.headerIcon} />
          <h2 className={styles.title}>Department progress for assessment phase</h2>
        </div>
      </div>

      <div className={styles.grid}>
        {departments.map((dept, idx) => (
          <div key={idx} className={styles.card}>
            <h3 className={styles.departmentName}>{dept.name}</h3>
            <div className={styles.completionLabel}>Completion</div>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${
                  dept.color === 'red' ? styles.progressFillRed : styles.progressFillBlue
                }`}
                style={{ width: `${dept.completion}%` }}
              ></div>
            </div>
            <div className={styles.completionPercentage}>{dept.completion}%</div>

            <div className={styles.statusRow}>
              <div className={styles.statusItem}>
                <CheckCircle className={`${styles.statusIcon} ${styles.statusIconGreen}`} />
                <span className={styles.statusLabel}>Submitted</span>
                <span className={`${styles.statusValue} ${styles.statusValueGreen}`}>
                  {dept.submitted}
                </span>
              </div>
              <div className={styles.statusItem}>
                <Clock className={`${styles.statusIcon} ${styles.statusIconOrange}`} />
                <span className={styles.statusLabel}>AE Pending</span>
                <span className={`${styles.statusValue} ${styles.statusValueOrange}`}>
                  {dept.pending.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentProgress;
