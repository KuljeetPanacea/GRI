
import styles from './styles/StatusBar.module.css';

const StatusBar = ({ totalNoOfGaps, PendingClient, PendingQsa }: { totalNoOfGaps: number, PendingClient: number, PendingQsa: number }) => {
  const statusData = [
    { label: "Total gaps", count: totalNoOfGaps, color: "#1E88E5", type: "total" },
    { label: "Pending client", count: PendingClient, color: "#2E7D32", type: "completed" },
    { label: "Pending QSA", count: PendingQsa, color: "#FF9800", type: "pending" },
  ];

  // Calculate total and percentages
  const totalGaps = statusData.find(item => item.type === "total")?.count || 0;
  const pendingClient = statusData.find(item => item.type === "completed")?.count || 0;
  const pendingQSA = statusData.find(item => item.type === "pending")?.count || 0;
  
  const clientPercentage = Math.round((pendingClient / totalGaps) * 100);
  const qsaPercentage = Math.round((pendingQSA / totalGaps) * 100);
  
  // Calculate angles for the donut segments
  const clientAngle = (pendingClient / totalGaps) * 360;
  const qsaAngle = (pendingQSA / totalGaps) * 360;
  
  const radius = 120;
  const strokeWidth = 20;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  // Calculate stroke dash arrays for each segment
  const clientStrokeDasharray = `${(clientAngle / 360) * circumference} ${circumference}`;
  const qsaStrokeDasharray = `${(qsaAngle / 360) * circumference} ${circumference}`;
  
  // Calculate rotation for QSA segment (starts after client segment)
  const qsaRotation = clientAngle;

  return (
    <div className={styles.container}>
      <div className={styles.chartWrapper}>
        {/* SVG Donut Chart */}
        <svg
          height={radius * 2}
          width={radius * 2}
          className={styles.chart}
        >
          {/* Background circle */}
          <circle
            stroke="#f3f4f6"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          
          {/* Pending Client segment */}
          <circle
            stroke="#EC8526"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={clientStrokeDasharray}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className={styles.segment}
          />
          
          {/* Pending QSA segment */}
          <circle
            stroke="#ef4444"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={qsaStrokeDasharray}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={{
              transform: `rotate(${qsaRotation}deg)`,
              transformOrigin: `${radius}px ${radius}px`
            }}
            className={styles.segment}
          />
        </svg>
        
        {/* Center text */}
        <div className={styles.centerText}>
          <div className={styles.totalCount}>{totalGaps}</div>
          <div className={styles.totalLabel}>Total Gaps</div>
        </div>
        
        {/* Percentage labels */}
        <div className={styles.clientLabel}>
          <div className={styles.percentageClient}>{clientPercentage}%</div>
          <div className={styles.labelText}>pending client</div>
        </div>
        
        <div className={styles.qsaLabel}>
          <div className={styles.percentageQsa}>{qsaPercentage}%</div>
          <div className={styles.labelText}>pending QSA</div>
        </div>
      </div>
      
      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendColorClient}></div>
          <span className={styles.legendText}>
            {pendingClient} pending client ({clientPercentage}%)
          </span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColorQsa}></div>
          <span className={styles.legendText}>
            {pendingQSA} pending QSA ({qsaPercentage}%)
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;