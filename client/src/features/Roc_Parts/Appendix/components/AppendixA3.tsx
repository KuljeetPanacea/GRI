import React from 'react'
import styles from '../../Part_1/styles/ContactInfo.module.css'

const AppendixA3: React.FC = () => {
  return (
    <div className={styles.container}>
    <h3>A3	Designated Entities Supplemental Validation (DESV)	</h3>
    
    <p className={styles.info}>
        This Appendix applies only to entities designated by a payment brand(s) or acquirer as requiring additional validation of existing PCI DSS requirements.<br/>
Entities that are required to validate to these requirements should refer to the following documents for reporting:<br/>
<div className={styles.list}>
    
•	PCI DSS v4.0.1 Supplemental Report on Compliance Template - Designated Entities Supplemental Validation<br/>
•	PCI DSS v4.0.1 Supplemental Attestation of Compliance for Report on Compliance - Designated Entities Supplemental Validation<br/>
</div>
These documents are available in the PCI SSC Document Library. <br/>
Note that an entity is ONLY required to undergo an assessment according to this Appendix if instructed to do so by an acquirer or a payment brand.

    </p>
        
    </div>
  )
}

export default AppendixA3