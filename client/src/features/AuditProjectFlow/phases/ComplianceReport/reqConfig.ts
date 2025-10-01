import { ControlStructure } from "../../../Roc_Parts/Part_2/types";

// {
//                 id: 3,
//                 title: "1.2.3",
//                 desc: "",
//                 assessmentDesc: "",
//                 testingProcedures: [
//                   {
//                     id: "",
//                     description: "",
//                     reportingInstructions: [
//                       { id: "", description: "", evidenceReference: "" },
//                     ],
//                   },
//                 ],
//               },

export interface SubRequirement {
  id: number;
  title: string;
  desc?: string;
  controls?: ControlStructure[];
}

export interface Requirement {
  id: number;
  reqName: string;
  reqDesc?: string;
  subReq?: SubRequirement[];
}

export interface Requirements {
  part1: {
    id: number;
    title: string;
    requirements: Requirement[];
  };
  part2a: {
    id: number;
    title: string;
    requirements: Requirement[];
  };
  part2b: {
    id: number;
    title: string;
    requirements: Requirement[];
  };
  appendix: {
    id: number;
    title: string;
    requirements: Requirement[];
  };
}

// Define the requirement configuration array
const reqConfig: Requirements = {
  part1: {
    id: 1,
    title: "ROC Part 1 - Assessment overview",
    requirements: [
      {
        id: 1,
        reqName: "Contact Information",
      },
      {
        id: 2,
        reqName: "Business Overview",
      },
      {
        id: 3,
        reqName: "Scope of work",
      },
      {
        id: 4,
        reqName: "Reviewed Environments",
      },
      {
        id: 5,
        reqName: "Quarterly Scans",
      },
    ],
  },
  part2a: {
    id: 1,
    title: "ROC Part 2 - Sampling and Evidence",
    requirements: [
      {
        id: 1,
        reqName: "Sampling and Evidences",
      },
    ],
  },
  part2b: {
    id: 1,
    title: "ROC Part 2 - Findings and Observations",
    requirements:[
  {
    "id": 1,
    "reqName": "Req 1",
    "reqDesc": "Install and Maintain Network Security Controls",
    "subReq": [
      {
        "id": 1.1,
        "title": "Sub-req 1.1",
        "desc": "Processes and mechanisms for installing and maintaining network security controls are defined and understood.",
        "controls": [
          {
            "id": 1,
            "title": "1.1.1",
            "desc": "All security policies and operational procedures that are identified in Requirement 1 are: \n \u2022 Documented \n \u2022 Kept up to date \n \u2022  In use \n \u2022  Known to all affected parties.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "1.1.1",
                "description": "Examine documentation and interview personnel to verify that security policies and operational procedures identified in Requirement 1 are managed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "1.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "1.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "1.1.2",
            "desc": "Roles and responsibilities for performing activities in Requirement 1 are documented, assigned, and understood.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "1.1.2a",
                "description": "Examine documentation to verify that descriptions of roles and responsibilities for performing activities in Requirement 1 are documented and assigned.",
                "reportingInstructions": [
                  {
                    "id": "1.1.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "1.1.2b",
                "description": "Interview personnel responsible for performing activities in Requirement 1 to verify that roles and responsibilities are assigned as documented and are understood.",
                "reportingInstructions": [
                  {
                    "id": "1.1.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 1.2,
        "title": "Sub-req 1.2",
        "desc": "Network security controls (NSCs) are configured and maintained.",
        "controls": [
          {
            "id": 1,
            "title": "1.2.1",
            "desc": "Configuration standards for NSC rulesets are:  \n \u2022 Defined \n \u2022  Implemented \n \u2022  Maintained.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "1.2.1a",
                "description": "Examine the configuration standards for NSC rulesets to verify the standards are in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "1.2.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configuration standards examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "1.2.1b",
                "description": "Examine configuration settings for NSC rulesets to verify that rulesets are implemented according to the configuration standards.",
                "reportingInstructions": [
                  {
                    "id": "1.2.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-configSetting"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "1.2.2",
            "desc": "All changes to network connections and to configurations of NSCs are approved and managed in accordance with the change control process defined at Requirement 6.5.1.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "1.2.2a",
                "description": "Examine documented procedures to verify that changes to network connections and configurations of NSCs are included in the formal change control process in accordance with Requirement 6.5.1.",
                "reportingInstructions": [
                  {
                    "id": "1.2.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "1.2.2b",
                "description": "Examine network configuration settings to identify changes made to network connections. Interview responsible personnel and examine change control records to verify that identified changes to network connections were approved and managed in accordance with Requirement 6.5.1.",
                "reportingInstructions": [
                  {
                    "id": "1.2.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all network configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-networkConfigSt"
                  },
                  {
                    "id": "1.2.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "1.2.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all change control records examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "1.2.2c",
                "description": "Examine network configuration settings to identify changes made to configurations of NSCs. Interview responsible personnel and examine change control records to verify that identified changes to configurations of NSCs were approved and managed in accordance with Requirement 6.5.1.",
                "reportingInstructions": [
                  {
                    "id": "1.2.2c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all network configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-networkConfigSt"
                  },
                  {
                    "id": "1.2.2c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "1.2.2c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all change control records examined for this testing procedure.",
                    "evidenceReference": "others-changeControl"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "1.2.3",
            "desc": "An accurate network diagram(s) is maintained that shows all connections between the CDE and other networks, including any wireless networks.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "1.2.3a",
                "description": "Examine diagram(s) and network configurations to verify that an accurate network diagram(s) exists in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "1.2.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all diagrams examined for this testing procedure.",
                    "evidenceReference": "others-diagrams"
                  },
                  {
                    "id": "1.2.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all network configurations examined for this testing procedure.",
                    "evidenceReference": "others-networkConfig"
                  }
                ]
              },
              {
                "id": "1.2.3b",
                "description": "Examine documentation and interview responsible personnel to verify that the network diagram(s) is accurate and updated when there are changes to the environment.",
                "reportingInstructions": [
                  {
                    "id": "1.2.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "1.2.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "1.2.4",
            "desc": "An accurate data-flow diagram(s) is maintained that meets the following:  \n \u2022 Shows all account data flows across systems and networks \n \u2022  Updated as needed upon changes to the environment.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "1.2.4a",
                "description": "Examine data-flow diagram(s) and interview personnel to verify the diagram(s) show all account data flows in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "1.2.4a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all dataflow diagram(s) examined for this testing procedure.",
                    "evidenceReference": "others-dataFlowDg"
                  },
                  {
                    "id": "1.2.4a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "1.2.4b",
                "description": "Examine documentation and interview responsible personnel to verify that the data-flow diagram(s) is accurate and updated when there are changes to the environment.",
                "reportingInstructions": [
                  {
                    "id": "1.2.4b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "1.2.4b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "1.2.5",
            "desc": "All services, protocols, and ports allowed are identified, approved, and have a defined business need.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "1.2.5a",
                "description": "Examine documentation to verify that a list exists of all allowed services, protocols, and ports, including business justification and approval for each.",
                "reportingInstructions": [
                  {
                    "id": "1.2.5a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "1.2.5b",
                "description": "Examine configuration settings for NSCs to verify that only approved services, protocols, and ports are in use.",
                "reportingInstructions": [
                  {
                    "id": "1.2.5b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-configSt"
                  }
                ]
              }
            ]
          },
          {
            "id": 6,
            "title": "1.2.6",
            "desc": "Security features are defined and implemented for all services, protocols, and ports that are in use and considered to be insecure, such that the risk is mitigated.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "1.2.6a",
                "description": "Examine documentation that identifies all insecure services, protocols, and ports in use to verify that for each, security features are defined to mitigate the risk.",
                "reportingInstructions": [
                  {
                    "id": "1.2.6a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "1.2.6b",
                "description": "Examine configuration settings for NSCs to verify that the defined security features are implemented for each identified insecure service, protocol, and port.",
                "reportingInstructions": [
                  {
                    "id": "1.2.6b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-configSt"
                  }
                ]
              }
            ]
          },
          {
            "id": 7,
            "title": "1.2.7",
            "desc": "Configurations of NSCs are reviewed at least once every six months to confirm they are relevant and effective.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "1.2.7a",
                "description": "Examine documentation to verify procedures are defined for reviewing configurations of NSCs at least once every six months.",
                "reportingInstructions": [
                  {
                    "id": "1.2.7a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "1.2.7b",
                "description": "Examine documentation of reviews of configurations for NSCs and interview responsible personnel to verify that reviews occur at least once every six months.",
                "reportingInstructions": [
                  {
                    "id": "1.2.7b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "1.2.7b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "1.2.7c",
                "description": "Examine configurations for NSCs to verify that configurations identified as no longer being supported by a business justification are removed or updated.",
                "reportingInstructions": [
                  {
                    "id": "1.2.7c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configurations examined for this testing procedure.",
                    "evidenceReference": "others-config"
                  }
                ]
              }
            ]
          },
          {
            "id": 8,
            "title": "1.2.8",
            "desc": "Configuration files for NSCs are:  \n \u2022 Secured from unauthorized access \n \u2022  Kept consistent with active network configurations.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "1.2.8",
                "description": "Examine configuration files for NSCs to verify they are in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "1.2.8",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configuration files examined for this testing procedure.",
                    "evidenceReference": "others-configFiles"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 1.3,
        "title": "Sub-req 1.3",
        "desc": "Network access to and from the cardholder data environment is restricted.",
        "controls": [
          {
            "id": 1,
            "title": "1.3.1",
            "desc": "Inbound traffic to the CDE is restricted as follows:  \n \u2022 To only traffic that is necessary \n \u2022 All other traffic is specifically denied.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "1.3.1a",
                "description": "Examine configuration standards for NSCs to verify that they define restricting inbound traffic to the CDE is in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "1.3.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configuration standards examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "1.3.1b",
                "description": "Examine configurations of NSCs to verify that inbound traffic to the CDE is restricted in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "1.3.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configurations examined for this testing procedure.",
                    "evidenceReference": "others-config"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "1.3.2",
            "desc": "Outbound traffic from the CDE is restricted as follows: \n \u2022 To only traffic that is necessary \n \u2022  All other traffic is specifically denied.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "1.3.2a",
                "description": "Examine configuration standards for NSCs to verify that they define restricting outbound traffic from the CDE in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "1.3.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configuration standards examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "1.3.2b",
                "description": "Examine configurations of NSCs to verify that outbound traffic from the CDE is restricted in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "1.3.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configurations examined for this testing procedure.",
                    "evidenceReference": "others-config"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "1.3.3",
            "desc": "NSCs are installed between all wireless networks and the CDE, regardless of whether the wireless network is a CDE, such that: All wireless traffic from wireless networks into the CDE is denied by default, Only wireless traffic with an authorized business purpose is allowed into the CDE.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "1.3.3",
                "description": "Examine configuration settings and network diagrams to verify that NSCs are implemented between all wireless networks and the CDE, in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "1.3.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-networkDiagram"
                  },
                  {
                    "id": "1.3.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all network diagrams examined for this testing procedure.",
                    "evidenceReference": "others-networkDiagram"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 1.4,
        "title": "Sub-req 1.4",
        "desc": "Network connections between trusted and untrusted networks are controlled.",
        "controls": [
          {
            "id": 1,
            "title": "1.4.1",
            "desc": "NSCs are implemented between trusted and untrusted networks.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "1.4.1a",
                "description": "Examine configuration standards and network diagrams to verify that NSCs are defined between trusted and untrusted networks.",
                "reportingInstructions": [
                  {
                    "id": "1.4.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configuration standards examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "1.4.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all network diagrams examined for this testing procedure.",
                    "evidenceReference": "others-networkDiagram"
                  }
                ]
              },
              {
                "id": "1.4.1b",
                "description": "Examine network configurations to verify that NSCs are in place between trusted and untrusted networks, in accordance with the documented configuration standards and network diagrams.",
                "reportingInstructions": [
                  {
                    "id": "1.4.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all network configurations examined for this testing procedure.",
                    "evidenceReference": "others-networkConfig"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "1.4.2",
            "desc": "Inbound traffic from untrusted networks to trusted networks is restricted to: Communications with system components that are authorized to provide publicly accessible services, protocols, and ports, Stateful responses to communications initiated by system components in a trusted network, All other traffic is denied.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "1.4.2",
                "description": "Examine vendor documentation and configurations of NSCs to verify that inbound traffic from untrusted networks to trusted networks is restricted in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "1.4.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all vendor documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "1.4.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configurations examined for this testing procedure.",
                    "evidenceReference": "others-config"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "1.4.3",
            "desc": "Anti-spoofing measures are implemented to detect and block forged source IP addresses from entering the trusted network.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "1.4.3",
                "description": "Examine vendor documentation and configurations for NSCs to verify that anti-spoofing measures are implemented to detect and block forged source IP addresses from entering the trusted network.",
                "reportingInstructions": [
                  {
                    "id": "1.4.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all vendor documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "1.4.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configurations examined for this testing procedure.",
                    "evidenceReference": "others-config"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "1.4.4",
            "desc": "System components that store cardholder data are not directly accessible from untrusted networks.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "1.4.4a",
                "description": "Examine the data-flow diagram and network diagram to verify that it is documented that system components storing cardholder data are not directly accessible from the untrusted networks.",
                "reportingInstructions": [
                  {
                    "id": "1.4.4a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all data-flow diagram examined for this testing procedure.",
                    "evidenceReference": "others-networkDiagram"
                  },
                  {
                    "id": "1.4.4a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all network diagram examined for this testing procedure.",
                    "evidenceReference": "others-networkDiagram"
                  }
                ]
              },
              {
                "id": "1.4.4b",
                "description": "Examine configurations of NSCs to verify that controls are implemented such that system components storing cardholder data are not directly accessible from untrusted networks.",
                "reportingInstructions": [
                  {
                    "id": "1.4.4b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configurations examined for this testing procedure.",
                    "evidenceReference": "others-config"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "1.4.5",
            "desc": "The disclosure of internal IP addresses and routing information is limited to only authorized parties.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "1.4.5a",
                "description": "Examine configurations of NSCs to verify that the disclosure of internal IP addresses and routing information is limited to only authorized parties.",
                "reportingInstructions": [
                  {
                    "id": "1.4.5a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configurations examined for this testing procedure.",
                    "evidenceReference": "others-config"
                  }
                ]
              },
              {
                "id": "1.4.5b",
                "description": "Interview personnel and examine documentation to verify that controls are implemented such that any disclosure of internal IP addresses and routing information is limited to only authorized parties.",
                "reportingInstructions": [
                  {
                    "id": "1.4.5b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "1.4.5b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 1.5,
        "title": "Sub-req 1.5",
        "desc": "Risks to the CDE from computing devices that are able to connect to both untrusted networks and the CDE are mitigated.",
        "controls": [
          {
            "id": 1,
            "title": "1.5.1",
            "desc": "Security controls are implemented on any computing devices, including company- and employee-owned devices, that connect to both untrusted networks (including the Internet) and the CDE as follows: Specific configuration settings are defined to prevent threats being introduced into the entity's network, Security controls are actively running, Security controls are not alterable by users of the computing devices unless specifically documented and authorized by management on a case-by-case basis for a limited period.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "1.5.1a",
                "description": "Examine policies and configuration standards and interview personnel to verify security controls for computing devices that connect to both untrusted networks, and the CDE, are implemented in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "1.5.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "1.5.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configuration standards examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "1.5.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "1.5.1b",
                "description": "Examine configuration settings on computing devices that connect to both untrusted networks and the CDE to verify settings are implemented in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "1.5.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-configSetting"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 2,
    "reqName": "Req 2",
    "reqDesc": "Apply Secure Configurations to All System Components",
    "subReq": [
      {
        "id": 2.1,
        "title": "Sub-req 2.1",
        "desc": "Processes and mechanisms for applying secure configurations to all system components are defined and understood.",
        "controls": [
          {
            "id": 1,
            "title": "2.1.1",
            "desc": "All security policies and operational procedures that are identified in Requirement 2 are: Documented, Kept up to date, In use, Known to all affected parties.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "2.1.1",
                "description": "Examine documentation and interview personnel to verify that security policies and operational procedures identified in Requirement 2 are managed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "2.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "2.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "2.1.2",
            "desc": "Roles and responsibilities for performing activities in Requirement 2 are documented, assigned, and understood.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "2.1.2a",
                "description": "Examine documentation to verify that descriptions of roles and responsibilities for performing activities in Requirement 2 are documented and assigned.",
                "reportingInstructions": [
                  {
                    "id": "2.1.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "2.1.2b",
                "description": "Interview personnel with responsibility for performing activities in Requirement 2 to verify that roles and responsibilities are assigned as documented and are understood.",
                "reportingInstructions": [
                  {
                    "id": "2.1.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 2.2,
        "title": "Sub-req 2.2",
        "desc": "System components are configured and managed securely.",
        "controls": [
          {
            "id": 1,
            "title": "2.2.1",
            "desc": "Configuration standards are developed, implemented, and maintained to: Cover all system components, Address all known security vulnerabilities, Be consistent with industry-accepted system hardening standards or vendor hardening recommendations, Be updated as new vulnerability issues are identified, as defined in Requirement 6.3.1, Be applied when new systems are configured and verified as in place before or immediately after a system component is connected to a production environment.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "2.2.1a",
                "description": "Examine system configuration standards to verify they define processes that include all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "2.2.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configuration standards examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigSt"
                  }
                ]
              },
              {
                "id": "2.2.1b",
                "description": "Examine policies and procedures and interview personnel to verify that system configuration standards are updated as new vulnerability issues are identified, as defined in Requirement 6.3.1.",
                "reportingInstructions": [
                  {
                    "id": "2.2.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "others-policies&Procedures"
                  },
                  {
                    "id": "2.2.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "2.2.1c",
                "description": "Examine configuration settings and interview personnel to verify that system configuration standards are applied when new systems are configured and verified as being in place before or immediately after a system component is connected to a production environment.",
                "reportingInstructions": [
                  {
                    "id": "2.2.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-configSetting"
                  },
                  {
                    "id": "2.2.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "2.2.2",
            "desc": "Vendor default accounts are managed as follows: If the vendor default account(s) will be used, the default password is changed per Requirement 8.3.6, If the vendor default account(s) will not be used, the account is removed or disabled.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "2.2.2a",
                "description": "Examine system configuration standards to verify they include managing vendor default accounts in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "2.2.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configuration standards examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigSt"
                  }
                ]
              },
              {
                "id": "2.2.2b",
                "description": "Examine vendor documentation and observe a system administrator logging on using vendor default accounts to verify accounts are implemented in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "2.2.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all vendor documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "2.2.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations conducted for this testing procedure.",
                    "evidenceReference": "others-allObservations"
                  }
                ]
              },
              {
                "id": "2.2.2c",
                "description": "Examine configuration files and interview personnel to verify that all vendor default accounts that will not be used are removed or disabled.",
                "reportingInstructions": [
                  {
                    "id": "2.2.2c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configuration files examined for this testing procedure.",
                    "evidenceReference": "others-configFiles"
                  },
                  {
                    "id": "2.2.2c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "2.2.3",
            "desc": "Primary functions requiring different security levels are managed as follows: Only one primary function exists on a system component, OR Primary functions with differing security levels that exist on the same system component are isolated from each other, OR Primary functions with differing security levels on the same system component are all secured to the level required by the function with the highest security need.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "2.2.3a",
                "description": "Examine system configuration standards to verify they include managing primary functions requiring different security levels as specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "2.2.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configuration standards examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "2.2.3b",
                "description": "Examine system configurations to verify that primary functions requiring different security levels are managed per one of the ways specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "2.2.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  }
                ]
              },
              {
                "id": "2.2.3c",
                "description": "Where virtualization technologies are used, examine the system configurations to verify that system functions requiring different security levels are managed in one of the following ways: \n \u2022 Functions with differing security needs do not co-exist on the same system component, \n \u2022 Functions with differing security needs that exist on the same system component are isolated from each other, \n \u2022 Functions with differing security needs on the same system component are all secured to the level required by the function with the highest security need.",
                "reportingInstructions": [
                  {
                    "id": "2.2.3c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "2.2.4",
            "desc": "Only necessary services, protocols, daemons, and functions are enabled, and all unnecessary functionality is removed or disabled.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "2.2.4a",
                "description": "Examine system configuration standards to verify necessary services, protocols, daemons, and functions are identified and documented.",
                "reportingInstructions": [
                  {
                    "id": "2.2.4a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configuration standards examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "2.2.4b",
                "description": "Examine system configurations to verify the following: \n \u2022 All unnecessary functionality is removed or disabled .\n \u2022 Only required functionality, as documented in the configuration standards, is enabled.",
                "reportingInstructions": [
                  {
                    "id": "2.2.4b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                    "evidenceReference": "others-SystemConfig"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "2.2.5",
            "desc": "If any insecure services, protocols, or daemons are present: Business justification is documented, Additional security features are documented and implemented that reduce the risk of using insecure services, protocols, or daemons.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "2.2.5a",
                "description": "If any insecure services, protocols, or daemons are present, examine system configuration standards and interview personnel to verify they are managed and implemented in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "2.2.5a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configuration standards examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "2.2.5a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "2.2.5b",
                "description": "If any insecure services, protocols, or daemons are present, examine configuration settings to verify that additional security features are implemented to reduce the risk of using insecure services, daemons, and protocols.",
                "reportingInstructions": [
                  {
                    "id": "2.2.5b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-configSetting"
                  }
                ]
              }
            ]
          },
          {
            "id": 6,
            "title": "2.2.6",
            "desc": "System security parameters are configured to prevent misuse.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "2.2.6a",
                "description": "Examine system configuration standards to verify they include configuring system security parameters to prevent misuse.",
                "reportingInstructions": [
                  {
                    "id": "2.2.6a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configuration standards examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "2.2.6b",
                "description": "Interview system administrators and/or security managers to verify they have knowledge of common security parameter settings for system components.",
                "reportingInstructions": [
                  {
                    "id": "2.2.6b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "2.2.6c",
                "description": "Examine system configurations to verify that common security parameters are set appropriately and in accordance with the system configuration standards.",
                "reportingInstructions": [
                  {
                    "id": "2.2.6c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  }
                ]
              }
            ]
          },
          {
            "id": 7,
            "title": "2.2.7",
            "desc": "All non-console administrative access is encrypted using strong cryptography.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "2.2.7a",
                "description": "Examine system configuration standards to verify they include encrypting all non-console administrative access using strong cryptography.",
                "reportingInstructions": [
                  {
                    "id": "2.2.7a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configuration standards examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "2.2.7b",
                "description": "Observe an administrator log on to system components and examine system configurations to verify that non-console administrative access is managed in accordance with this requirement.",
                "reportingInstructions": [
                  {
                    "id": "2.2.7b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of administrator log on(s) for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  },
                  {
                    "id": "2.2.7b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  }
                ]
              },
              {
                "id": "2.2.7c",
                "description": "Examine settings for system components and authentication services to verify that insecure remote login services are not available for non-console administrative access.",
                "reportingInstructions": [
                  {
                    "id": "2.2.7c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all settings for system components and authentication services examined for this testing procedure.",
                    "evidenceReference": "others-systemComponentAuthSetting"
                  }
                ]
              },
              {
                "id": "2.2.7d",
                "description": "Examine vendor documentation and interview personnel to verify that strong cryptography for the technology in use is implemented according to industry best practices and/or vendor recommendations.",
                "reportingInstructions": [
                  {
                    "id": "2.2.7d",
                    "description": "Identify the evidence reference number(s) from Section 6 for all vendor documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "2.2.7d",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 2.3,
        "title": "Sub-req 2.3",
        "desc": "Wireless environments are configured and managed securely.",
        "controls": [
          {
            "id": 1,
            "title": "2.3.1",
            "desc": "For wireless environments connected to the CDE or transmitting account data, all wireless vendor defaults are changed at installation or are confirmed to be secure, including but not limited to: Default wireless encryption keys, Passwords on wireless access points, SNMP defaults, Any other security-related wireless vendor defaults.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "2.3.1a",
                "description": "Examine policies and procedures and interview responsible personnel to verify that processes are defined for wireless vendor defaults to either change them upon installation or to confirm them to be secure in accordance with all elements of this requirement.",
                "reportingInstructions": [
                  {
                    "id": "2.3.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "2.3.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "2.3.1b",
                "description": "Examine vendor documentation and observe a system administrator logging into wireless devices to verify:\n \u2022 SNMP defaults are not used.\n \u2022  Default passwords/passphrases on wireless access points are not used.",
                "reportingInstructions": [
                  {
                    "id": "2.3.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all vendor documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "2.3.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for the observations of administrator log in(s) for this testing procedure.",
                    "evidenceReference": "others-observationOfAdminLog"
                  }
                ]
              },
              {
                "id": "2.3.1c",
                "description": "Examine vendor documentation and wireless configuration settings to verify other security-related wireless vendor defaults were changed, if applicable.",
                "reportingInstructions": [
                  {
                    "id": "2.3.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all vendor documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "2.3.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all wireless configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-wirelessConfigSetting"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "2.3.2",
            "desc": "For wireless environments connected to the CDE or transmitting account data, wireless encryption keys are changed as follows: Whenever personnel with knowledge of the key leave the company or the role for which the knowledge was necessary, Whenever a key is suspected of or known to be compromised.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "2.3.2",
                "description": "Interview responsible personnel and examine key-management documentation to verify that wireless encryption keys are changed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "2.3.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "2.3.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all key-management documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 3,
    "reqName": "Req 3",
    "reqDesc": "Protect Stored Account Data",
    "subReq": [
      {
        "id": 3.1,
        "title": "Sub-req 3.1",
        "desc": "Processes and mechanisms for protecting stored account data are defined and understood.",
        "controls": [
          {
            "id": 1,
            "title": "3.1.1",
            "desc": "All security policies and operational procedures that are identified in Requirement 3 are: Documented, Kept up to date, In use, Known to all affected parties.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.1.1",
                "description": "Examine documentation and interview personnel to verify that security policies and operational procedures identified in Requirement 3 are managed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "3.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "3.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "3.1.2",
            "desc": "Roles and responsibilities for performing activities in Requirement 3 are documented, assigned, and understood.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.1.2a",
                "description": "Examine documentation to verify that descriptions of roles and responsibilities performing activities in Requirement 3 are documented and assigned.",
                "reportingInstructions": [
                  {
                    "id": "3.1.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "3.1.2b",
                "description": "Interview personnel with responsibility for performing activities in Requirement 3 to verify that roles and responsibilities are assigned as documented and are understood.",
                "reportingInstructions": [
                  {
                    "id": "3.1.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 3.2,
        "title": "Sub-req 3.2",
        "desc": "Storage of account data is kept to a minimum.",
        "controls": [
          {
            "id": 1,
            "title": "3.2.1",
            "desc": "Account data storage is kept to a minimum through implementation of data retention and disposal policies, procedures, and processes that include at least the following: Coverage for all locations of stored account data, Coverage for any sensitive authentication data (SAD) stored prior to completion of authorization, Limiting data storage amount and retention time to that which is required for legal or regulatory, and/or business requirements, Specific retention requirements for stored account data that defines length of retention period and includes a documented business justification, Processes for secure deletion or rendering account data unrecoverable when no longer needed per the retention policy, A process for verifying, at least once every three months, that stored account data exceeding the defined retention period has been securely deleted or rendered unrecoverable.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.2.1a",
                "description": "Examine the data retention and disposal policies, procedures, and processes and interview personnel to verify processes are defined to include all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "3.2.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all data retention and disposal policies, procedures, and processes examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "3.2.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "3.2.1b",
                "description": "Examine files and system records on system components where account data is stored to verify that the data storage amount and retention time does not exceed the requirements defined in the data retention policy.",
                "reportingInstructions": [
                  {
                    "id": "3.2.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all files and system records examined for this testing procedure.",
                    "evidenceReference": "others-files&SystemRecords"
                  }
                ]
              },
              {
                "id": "3.2.1c",
                "description": "Observe the mechanisms used to render account data unrecoverable to verify data cannot be recovered.",
                "reportingInstructions": [
                  {
                    "id": "3.2.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for the observations of the mechanisms used for this testing procedure.",
                    "evidenceReference": "others-observationOfMechanismUsed"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 3.3,
        "title": "Sub-req 3.3",
        "desc": "Sensitive authentication data (SAD) is not stored after authorization.",
        "controls": [
          {
            "id": 1,
            "title": "3.3.1",
            "desc": "SAD is not stored after authorization, even if encrypted. All sensitive authentication data received is rendered unrecoverable upon completion of the authorization process.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach Appendix C to support this method.",
            "testingProcedures": [
              {
                "id": "3.3.1a",
                "description": "If SAD is received, examine documented policies, procedures, and system configurations to verify the data is not stored after authorization.",
                "reportingInstructions": [
                  {
                    "id": "3.3.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "3.3.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  }
                ]
              },
              {
                "id": "3.3.1b",
                "description": "If SAD is received, examine the documented procedures and observe the secure data deletion processes to verify the data is rendered unrecoverable upon completion of the authorization process.",
                "reportingInstructions": [
                  {
                    "id": "3.3.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "3.3.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for the observations of the secure data deletion processes for this testing procedure.",
                    "evidenceReference": "others-secureDataDeletionProcess"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "3.3.1.1",
            "desc": "The full contents of any track are not stored upon completion of the authorization process.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach Appendix C to support this method.",
            "testingProcedures": [
              {
                "id": "3.3.1.1",
                "description": "Examine data sources to verify that the full contents of any track are not stored upon completion of the authorization process.",
                "reportingInstructions": [
                  {
                    "id": "3.3.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all data sources examined for this testing procedure.",
                    "evidenceReference": "others-dataSources"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "3.3.1.2",
            "desc": "The card verification code is not stored upon completion of the authorization process.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach Appendix C to support this method.",
            "testingProcedures": [
              {
                "id": "3.3.1.2",
                "description": "Examine data sources to verify that the card verification code is not stored upon completion of the authorization process.",
                "reportingInstructions": [
                  {
                    "id": "3.3.1.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all data sources examined for this testing procedure.",
                    "evidenceReference": "others-dataSources"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "3.3.1.3",
            "desc": "The personal identification number (PIN) and the PIN block are not stored upon completion of the authorization process.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach Appendix C to support this method.",
            "testingProcedures": [
              {
                "id": "3.3.1.3",
                "description": "Examine data sources to verify that PINs and PIN blocks are not stored upon completion of the authorization process.",
                "reportingInstructions": [
                  {
                    "id": "3.3.1.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all data sources examined for this testing procedure.",
                    "evidenceReference": "others-dataSources"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "3.3.2",
            "desc": "SAD that is stored electronically prior to completion of authorization is encrypted using strong cryptography. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach Appendix C to support this method.",
            "testingProcedures": [
              {
                "id": "3.3.2",
                "description": "Examine data stores, system configurations, and/or vendor documentation to verify that all SAD that is stored electronically prior to completion of authorization is encrypted using strong cryptography.",
                "reportingInstructions": [
                  {
                    "id": "3.3.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all data stores examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  },
                  {
                    "id": "3.3.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  },
                  {
                    "id": "3.3.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all vendor documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 6,
            "title": "3.3.3",
            "desc": "Additional requirement for issuers and companies that support issuing services and store sensitive authentication data: Any storage of sensitive authentication data is: Limited to that which is needed for a legitimate issuing business need and is secured, Encrypted using strong cryptography. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.3.3a",
                "description": "Additional testing procedure for issuers and companies that support issuing services and store sensitive authentication data: Examine documented policies and interview personnel to verify there is a documented business justification for the storage of sensitive authentication data.",
                "reportingInstructions": [
                  {
                    "id": "3.3.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented policies examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "3.3.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "3.3.3b",
                "description": "Additional testing procedure for issuers and companies that support issuing services and store sensitive authentication data: Examine data stores and system configurations to verify that the sensitive authentication data is stored securely.",
                "reportingInstructions": [
                  {
                    "id": "3.3.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all data stores examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  },
                  {
                    "id": "3.3.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 3.4,
        "title": "Sub-req 3.4",
        "desc": "Access to displays of full PAN and ability to copy PAN are restricted.",
        "controls": [
          {
            "id": 1,
            "title": "3.4.1",
            "desc": "PAN is masked when displayed (the BIN and last four digits are the maximum number of digits to be displayed), such that only personnel with a legitimate business need can see more than the BIN and last four digits of the PAN.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.4.1a",
                "description": "Examine documented policies and procedures for masking the display of PANs to verify: \n \u2022 A list of roles that need access to more than the BIN and last four digits of the PAN (includes full PAN) is documented, together with a legitimate business need for each role to have such access.\n \u2022 PAN is masked when displayed such that only personnel with a legitimate business need can see more than the BIN and last four digits of the PAN.\n \u2022 All roles not specifically authorized to see the full PAN must only see masked PANs.",
                "reportingInstructions": [
                  {
                    "id": "3.4.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "3.4.1b",
                "description": "Examine system configurations to verify that full PAN is only displayed for roles with a documented business need, and that PAN is masked for all other requests.",
                "reportingInstructions": [
                  {
                    "id": "3.4.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  }
                ]
              },
              {
                "id": "3.4.1c",
                "description": "Examine displays of PAN (for example, on screen, on paper receipts) to verify that PANs are masked when displayed, and that only those with a legitimate business need are able to see more than the BIN and/or last four digits of the PAN.",
                "reportingInstructions": [
                  {
                    "id": "3.4.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all displays of PAN examined for this testing procedure.",
                    "evidenceReference": "others-displayOfPan"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "3.4.2",
            "desc": "When using remote-access technologies, technical controls prevent copy and/or relocation of PAN for all personnel, except for those with documented, explicit authorization and a legitimate, defined business need. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.4.2a",
                "description": "Examine documented policies and procedures and documented evidence for technical controls that prevent copy and/or relocation of PAN when using remote-access technologies onto local hard drives or removable electronic media to verify the following: \n \u2022 Technical controls prevent all personnel not specifically authorized from copying and/or relocating PAN.\n \u2022 A list of personnel with permission to copy and/or relocate PAN is maintained, together with the documented, explicit authorization and legitimate, defined business need.",
                "reportingInstructions": [
                  {
                    "id": "3.4.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "3.4.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented evidence for technical controls examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "3.4.2b",
                "description": "Examine configurations for remote-access technologies to verify that technical controls to prevent copy and/or relocation of PAN for all personnel, unless explicitly authorized.",
                "reportingInstructions": [
                  {
                    "id": "3.4.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configurations examined for this testing procedure.",
                    "evidenceReference": "others-config"
                  }
                ]
              },
              {
                "id": "3.4.2c",
                "description": "Observe processes and interview personnel to verify that only personnel with documented, explicit authorization and a legitimate, defined business need have permission to copy and/or relocate PAN when using remote-access technologies.",
                "reportingInstructions": [
                  {
                    "id": "3.4.2c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations conducted for this testing procedure.",
                    "evidenceReference": "others-observations"
                  },
                  {
                    "id": "3.4.2c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 3.5,
        "title": "Sub-req 3.5",
        "desc": "Primary account number (PAN) is secured wherever it is stored.",
        "controls": [
          {
            "id": 1,
            "title": "3.5.1",
            "desc": "PAN is rendered unreadable anywhere it is stored by using any of the following approaches: One-way hashes based on strong cryptography of the entire PAN, Truncation (hashing cannot be used to replace the truncated segment of PAN), If hashed and truncated versions of the same PAN, or different truncation formats of the same PAN, are present in an environment, additional controls are in place such that the different versions cannot be correlated to reconstruct the original PAN, Index tokens, Strong cryptography with associated key-management processes and procedures.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.5.1a",
                "description": "Examine documentation about the system used to render PAN unreadable, including the vendor, type of system/process, and the encryption algorithms (if applicable) to verify that the PAN is rendered unreadable using any of the methods specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "3.5.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "3.5.1b",
                "description": "Examine data repositories and audit logs, including payment application logs, to verify the PAN is rendered unreadable using any of the methods specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "3.5.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all data repositories examined for this testing procedure.",
                    "evidenceReference": "others-dataRepositories"
                  },
                  {
                    "id": "3.5.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all audit logs examined for this testing procedure.",
                    "evidenceReference": "others-dataRepositories"
                  }
                ]
              },
              {
                "id": "3.5.1c",
                "description": "If hashed and truncated versions of the same PAN are present in the environment, examine implemented controls to verify that the hashed and truncated versions cannot be correlated to reconstruct the original PAN.",
                "reportingInstructions": [
                  {
                    "id": "3.5.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all implemented controls examined for this testing procedure.",
                    "evidenceReference": "others-implementedControls"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "3.5.1.1",
            "desc": "Hashes used to render PAN unreadable (per the first bullet of Requirement 3.5.1) are keyed cryptographic hashes of the entire PAN, with associated key-management processes and procedures in accordance with Requirements 3.6 and 3.7. (Note: This requirement is considered a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment. This requirement will replace the bullet in Requirement 3.5.1 for one-way hashes once its effective date is reached.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.5.1.1a",
                "description": "Examine documentation about the hashing method used to render PAN unreadable, including the vendor, type of system/process, and the encryption algorithms (as applicable) to verify that the hashing method results in keyed cryptographic hashes of the entire PAN, with associated key management processes and procedures.",
                "reportingInstructions": [
                  {
                    "id": "3.5.1.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "3.5.1.1b",
                "description": "Examine documentation about the key management procedures and processes associated with the keyed cryptographic hashes to verify keys are managed in accordance with Requirements 3.6 and 3.7.",
                "reportingInstructions": [
                  {
                    "id": "3.5.1.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "3.5.1.1c",
                "description": "Examine data repositories to verify the PAN is rendered unreadable.",
                "reportingInstructions": [
                  {
                    "id": "3.5.1.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all data repositories examined for this testing procedure.",
                    "evidenceReference": "others-dataRepositories"
                  }
                ]
              },
              {
                "id": "3.5.1.1d",
                "description": "Examine audit logs, including payment application logs, to verify the PAN is rendered unreadable.",
                "reportingInstructions": [
                  {
                    "id": "3.5.1.1d",
                    "description": "Identify the evidence reference number(s) from Section 6 for all audit logs examined for this testing procedure.",
                    "evidenceReference": "others-auditLogs"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "3.5.1.2",
            "desc": "If disk-level or partition-level encryption (rather than file-, column-, or field-level database encryption) is used to render PAN unreadable, it is implemented only as follows: On removable electronic media, OR If used for non-removable electronic media, PAN is also rendered unreadable via another mechanism that meets Requirement 3.5.1. (Note: This requirement is considered a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.5.1.2a",
                "description": "Examine encryption processes to verify that, if disk-level or partition-level encryption is used to render PAN unreadable, it is implemented only as follows:\n \u2022 On removable electronic media, \n OR \n \u2022 If used for non-removable electronic media, examine encryption processes used to verify that PAN is also rendered unreadable via another method that meets Requirement 3.5.1.",
                "reportingInstructions": [
                  {
                    "id": "3.5.1.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all encryption processes examined for this testing procedure.",
                    "evidenceReference": "others-encryptionProcesses"
                  }
                ]
              },
              {
                "id": "3.5.1.2b",
                "description": "Examine configurations and/or vendor documentation and observe encryption processes to verify the system is configured according to vendor documentation the result is that the disk or the partition is rendered unreadable.",
                "reportingInstructions": [
                  {
                    "id": "3.5.1.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configurations examined for this testing procedure.",
                    "evidenceReference": "others-observationsOfEncryptionProcess"
                  },
                  {
                    "id": "3.5.1.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all vendor documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "3.5.1.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for the observations of the encryption processes for this testing procedure.",
                    "evidenceReference": "others-observationsOfEncryptionProcess"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "3.5.1.3",
            "desc": "If disk-level or partition-level encryption is used (rather than file-, column-, or field-level database encryption) to render PAN unreadable, it is managed as follows: Logical access is managed separately and independently of native operating system authentication and access control mechanisms, Decryption keys are not associated with user accounts, Authentication factors (passwords, passphrases, or cryptographic keys) that allow access to unencrypted data are stored securely.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.5.1.3a",
                "description": "If disk-level or partition-level encryption is used to render PAN unreadable, examine the system configuration and observe the authentication process to verify that logical access is implemented in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "3.5.1.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  },
                  {
                    "id": "3.5.1.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of the authentication process for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  }
                ]
              },
              {
                "id": "3.5.1.3b",
                "description": "Examine files containing authentication factors (passwords, passphrases, or cryptographic keys) and interview personnel to verify that authentication factors that allow access to unencrypted data are stored securely and are independent from the native operating system's authentication and access control methods.",
                "reportingInstructions": [
                  {
                    "id": "3.5.1.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all files containing authentication factors examined for this testing procedure.",
                    "evidenceReference": "others-filesContainingAuthFactors"
                  },
                  {
                    "id": "3.5.1.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 3.6,
        "title": "Sub-req 3.6",
        "desc": "Cryptographic keys used to protect stored account data are secured.",
        "controls": [
          {
            "id": 1,
            "title": "3.6.1",
            "desc": "Procedures are defined and implemented to protect cryptographic keys used to protect stored account data against disclosure and misuse that include: Access to keys is restricted to the fewest number of custodians necessary, Key-encrypting keys are at least as strong as the data-encrypting keys they protect, Key-encrypting keys are stored separately from data-encrypting keys, Keys are stored securely in the fewest possible locations and forms.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.6.1",
                "description": "Examine documented key-management policies and procedures to verify that processes to protect cryptographic keys used to protect stored account data against disclosure and misuse are defined to include all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "3.6.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "3.6.1.1",
            "desc": "Additional requirement for service providers only: A documented description of the cryptographic architecture is maintained that includes: Details of all algorithms, protocols, and keys used for the protection of stored account data, including key strength and expiry date, Preventing the use of the same cryptographic keys in production and test environments, Description of the key usage for each key, Inventory of any hardware security modules (HSMs), key management systems (KMS), and other secure cryptographic devices (SCDs) used for key management, including type and location of devices, to support meeting Requirement 12.3.4.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.6.1.1",
                "description": "Additional testing procedure for service provider assessments only: Interview responsible personnel and examine documentation to verify that a document exists to describe the cryptographic architecture that includes all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "3.6.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "3.6.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "3.6.1.2",
            "desc": "Secret and private keys used to protect stored account data are stored in one (or more) of the following forms at all times: Encrypted with a key-encrypting key that is at least as strong as the data-encrypting key, and that is stored separately from the data-encrypting key, Within a secure cryptographic device (SCD), such as a hardware security module (HSM) or PTS-approved point-of-interaction device, As at least two full-length key components or key shares, in accordance with an industry-accepted method.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.6.1.2a",
                "description": "Examine documented procedures to verify it is defined that cryptographic keys used to encrypt/decrypt stored account data must exist only in one (or more) of the forms specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "3.6.1.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "3.6.1.2b",
                "description": "Examine system configurations and key storage locations to verify that cryptographic keys used to encrypt/decrypt stored account data exist in one (or more) of the forms specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "3.6.1.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  },
                  {
                    "id": "3.6.1.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all key storage locations examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  }
                ]
              },
              {
                "id": "3.6.1.2c",
                "description": "Wherever key-encrypting keys are used, examine system configurations and key storage locations to verify: \n \u2022 Key-encrypting keys are at least as strong as the data-encrypting keys they protect.\n \u2022 Key-encrypting keys are stored separately from data-encrypting keys.",
                "reportingInstructions": [
                  {
                    "id": "3.6.1.2c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  },
                  {
                    "id": "3.6.1.2c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all key storage locations examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "3.6.1.3",
            "desc": "Access to cleartext cryptographic key components is restricted to the fewest number of custodians necessary.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.6.1.3",
                "description": "Examine user access lists to verify that access to cleartext cryptographic key components is restricted to the fewest number of custodians necessary.",
                "reportingInstructions": [
                  {
                    "id": "3.6.1.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all user access lists examined for this testing procedure.",
                    "evidenceReference": "others-userAccessList"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "3.6.1.4",
            "desc": "Cryptographic keys are stored in the fewest possible locations.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.6.1.4",
                "description": "Examine key storage locations and observe processes to verify that keys are stored in the fewest possible locations.",
                "reportingInstructions": [
                  {
                    "id": "3.6.1.4",
                    "description": "Identify the evidence reference number(s) from Section 6 for all key storage locations examined for this testing procedure.",
                    "evidenceReference": "others-observationOfProcesses"
                  },
                  {
                    "id": "3.6.1.4",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of processes for this testing procedure.",
                    "evidenceReference": "others-observationOfProcesses"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 3.7,
        "title": "Sub-req 3.7",
        "desc": "Where cryptography is used to protect stored account data, key management processes and procedures covering all aspects of the key lifecycle are defined and implemented.",
        "controls": [
          {
            "id": 1,
            "title": "3.7.1",
            "desc": "Key-management policies and procedures are implemented to include generation of strong cryptographic keys used to protect stored account data.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.7.1a",
                "description": "Examine the documented key-management policies and procedures for keys used for protection of stored account data to verify that they define generation of strong cryptographic keys.",
                "reportingInstructions": [
                  {
                    "id": "3.7.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented key-management policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "3.7.1b",
                "description": "Observe the method for generating keys to verify that strong keys are generated.",
                "reportingInstructions": [
                  {
                    "id": "3.7.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of the methods for generating keys for this testing procedure.",
                    "evidenceReference": "others-keyGeneratingMethodObservations"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "3.7.2",
            "desc": "Key-management policies and procedures are implemented to include secure distribution of cryptographic keys used to protect stored account data.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.7.2a",
                "description": "Examine the documented key-management policies and procedures for keys used for protection of stored account data to verify that they define secure distribution of cryptographic keys.",
                "reportingInstructions": [
                  {
                    "id": "3.7.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the documented key management policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "3.7.2b",
                "description": "Observe the method for distributing keys to verify that keys are distributed securely.",
                "reportingInstructions": [
                  {
                    "id": "3.7.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of the method for distributing keys for this testing procedure.",
                    "evidenceReference": "others-keyDistMethodObservations"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "3.7.3",
            "desc": "Key-management policies and procedures are implemented to include secure storage of cryptographic keys used to protect stored account data.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.7.3a",
                "description": "Examine the documented key-management policies and procedures for keys used for protection of stored account data to verify that they define secure storage of cryptographic keys.",
                "reportingInstructions": [
                  {
                    "id": "3.7.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the documented key-management policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "3.7.3b",
                "description": "Observe the method for storing keys to verify that keys are stored securely.",
                "reportingInstructions": [
                  {
                    "id": "3.7.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of the method for storing keys for this testing procedure.",
                    "evidenceReference": "others-keyStoringMethodObservations"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "3.7.4",
            "desc": "Key management policies and procedures are implemented for cryptographic key changes for keys that have reached the end of their cryptoperiod, as defined by the associated application vendor or key owner, and based on industry best practices and guidelines, including the following: A defined cryptoperiod for each key type in use, A process for key changes at the end of the defined cryptoperiod.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.7.4a",
                "description": "Examine the documented key-management policies and procedures for keys used for protection of stored account data to verify that they define changes to cryptographic keys that have reached the end of their cryptoperiod and include all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "3.7.4a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the documented key-management policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "3.7.4b",
                "description": "Interview personnel, examine documentation, and observe key storage locations to verify that keys are changed at the end of the defined cryptoperiod(s).",
                "reportingInstructions": [
                  {
                    "id": "3.7.4b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "3.7.4b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "3.7.4b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of key storage locations for this testing procedure.",
                    "evidenceReference": "others-keyStorageLocations"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "3.7.5",
            "desc": "Key management policies procedures are implemented to include the retirement, replacement, or destruction of keys used to protect stored account data, as deemed necessary when: The key has reached the end of its defined cryptoperiod, The integrity of the key has been weakened, including when personnel with knowledge of a cleartext key component leaves the company, or the role for which the key component was known, The key is suspected of or known to be compromised, Retired or replaced keys are not used for encryption operations.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.7.5a",
                "description": "Examine the documented key-management policies and procedures for keys used for protection of stored account data and verify that they define retirement, replacement, or destruction of keys in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "3.7.5a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the documented key-management policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "3.7.5b",
                "description": "Interview personnel to verify that processes are implemented in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "3.7.5b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 6,
            "title": "3.7.6",
            "desc": "Where manual cleartext cryptographic key-management operations are performed by personnel, key-management policies and procedures are implemented, including managing these operations using split knowledge and dual control.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.7.6a",
                "description": "Examine the documented key-management policies and procedures for keys used for protection of stored account data and verify that they define using split knowledge and dual control.",
                "reportingInstructions": [
                  {
                    "id": "3.7.6a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented key-management policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "3.7.6b",
                "description": "Interview personnel and/or observe processes to verify that manual cleartext keys are managed with split knowledge and dual control.",
                "reportingInstructions": [
                  {
                    "id": "3.7.6b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "3.7.6b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of processes for this testing procedure.",
                    "evidenceReference": "others-observationOfProcesses"
                  }
                ]
              }
            ]
          },
          {
            "id": 7,
            "title": "3.7.7",
            "desc": "Key management policies and procedures are implemented to include the prevention of unauthorized substitution of cryptographic keys.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.7.7a",
                "description": "Examine the documented key-management policies and procedures for keys used for protection of stored account data and verify that they define prevention of unauthorized substitution of cryptographic keys.",
                "reportingInstructions": [
                  {
                    "id": "3.7.7a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the documented key-management policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "3.7.7b",
                "description": "Interview personnel and/or observe processes to verify that unauthorized substitution of keys is prevented.",
                "reportingInstructions": [
                  {
                    "id": "3.7.7b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "3.7.7b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of processes for this testing procedure.",
                    "evidenceReference": "others-observationOfProcesses"
                  }
                ]
              }
            ]
          },
          {
            "id": 8,
            "title": "3.7.8",
            "desc": "Key management policies and procedures are implemented to include that cryptographic key custodians formally acknowledge (in writing or electronically) that they understand and accept their key-custodian responsibilities.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.7.8a",
                "description": "Examine the documented key-management policies and procedures for keys used for protection of stored account data and verify that they define acknowledgments for key custodians in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "3.7.8a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the documented key-management policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "3.7.8b",
                "description": "Examine documentation or other evidence showing that key custodians have provided acknowledgments in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "3.7.8b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation or other evidence examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 9,
            "title": "3.7.9",
            "desc": "Additional requirement for service providers only: Where a service provider shares cryptographic keys with its customers for transmission or storage of account data, guidance on secure transmission, storage and updating of such keys is documented and distributed to the service provider's customers.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "3.7.9",
                "description": "Additional testing procedure for service provider assessments only: If the service provider shares cryptographic keys with its customers for transmission or storage of account data, examine the documentation that the service provider provides to its customers to verify it includes guidance on how to securely transmit, store, and update customers' keys in accordance with all elements specified in Requirements 3.7.1 through 3.7.8 above.",
                "reportingInstructions": [
                  {
                    "id": "3.7.9",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 4,
    "reqName": "Req 4",
    "reqDesc": "Protect Cardholder Data with Strong Cryptography During Transmission Over Open, Public Networks",
    "subReq": [
      {
        "id": 4.1,
        "title": "Sub-req 4.1",
        "desc": "Processes and mechanisms for protecting cardholder data with strong cryptography during transmission over open, public networks are defined and understood.",
        "controls": [
          {
            "id": 1,
            "title": "4.1.1",
            "desc": "All security policies and operational procedures that are identified in Requirement 4 are: Documented, Kept up to date, In use, Known to all affected parties.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "4.1.1",
                "description": "Examine documentation and interview personnel to verify that security policies and operational procedures identified in Requirement 4 are managed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "4.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "4.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "4.1.2",
            "desc": "Roles and responsibilities for performing activities in Requirement 4 are documented, assigned, and understood.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "4.1.2a",
                "description": "Examine documentation to verify that descriptions of roles and responsibilities for performing activities in Requirement 4 are documented and assigned.",
                "reportingInstructions": [
                  {
                    "id": "4.1.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "4.1.2b",
                "description": "Interview personnel with responsibility for performing activities in Requirement 4 to verify that roles and responsibilities are assigned as documented and are understood.",
                "reportingInstructions": [
                  {
                    "id": "4.1.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 4.2,
        "title": "Sub-req 4.2",
        "desc": "PAN is protected with strong cryptography during transmission.",
        "controls": [
          {
            "id": 1,
            "title": "4.2.1",
            "desc": "Strong cryptography and security protocols are implemented as follows to safeguard PAN during transmission over open, public networks: Only trusted keys and certificates are accepted, Certificates used to safeguard PAN during transmission over open, public networks are confirmed as valid and are not expired or revoked, The protocol in use supports only secure versions or configurations and does not support fallback to, or use of insecure versions, algorithms, key sizes, or implementations, The encryption strength is appropriate for the encryption methodology in use.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "4.2.1a",
                "description": "Examine documented policies and procedures and interview personnel to verify processes are defined to include all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "4.2.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the documented policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "4.2.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "4.2.1b",
                "description": "Examine system configurations to verify that strong cryptography and security protocols are implemented in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "4.2.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  }
                ]
              },
              {
                "id": "4.2.1c",
                "description": "Examine cardholder data transmissions to verify that all PAN is encrypted with strong cryptography when it is transmitted over open, public networks.",
                "reportingInstructions": [
                  {
                    "id": "4.2.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all cardholder data transmissions examined for this testing procedure.",
                    "evidenceReference": "others-cardholderDataTransmissions"
                  }
                ]
              },
              {
                "id": "4.2.1d",
                "description": "Examine system configurations to verify that keys and/or certificates that cannot be verified as trusted are rejected.",
                "reportingInstructions": [
                  {
                    "id": "4.2.1d",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "4.2.1.1",
            "desc": "An inventory of the entity's trusted keys and certificates used to protect PAN during transmission is maintained. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "4.2.1.1a",
                "description": "Examine documented policies and procedures to verify processes are defined for the entity to maintain an inventory of its trusted keys and certificates.",
                "reportingInstructions": [
                  {
                    "id": "4.2.1.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the documented policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "4.2.1.1b",
                "description": "Examine the inventory of trusted keys and certificates to verify it is kept up to date.",
                "reportingInstructions": [
                  {
                    "id": "4.2.1.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all inventories of trusted keys examined for this testing procedure.",
                    "evidenceReference": "others-inventoriesOfTrustedKeys"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "4.2.1.2",
            "desc": "Wireless networks transmitting PAN or connected to the CDE use industry best practices to implement strong cryptography for authentication and transmission.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "4.2.1.2",
                "description": "Examine system configurations to verify that wireless networks transmitting PAN or connected to the CDE use industry best practices to implement strong cryptography for authentication and transmission.",
                "reportingInstructions": [
                  {
                    "id": "4.2.1.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "4.2.2",
            "desc": "PAN is secured with strong cryptography whenever it is sent via end-user messaging technologies.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "4.2.2a",
                "description": "Examine documented policies and procedures to verify that processes are defined to secure PAN with strong cryptography whenever sent over end-user messaging technologies.",
                "reportingInstructions": [
                  {
                    "id": "4.2.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "4.2.2b",
                "description": "Examine system configurations and vendor documentation to verify that PAN is secured with strong cryptography whenever it is sent via end-user messaging technologies.",
                "reportingInstructions": [
                  {
                    "id": "4.2.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  },
                  {
                    "id": "4.2.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all vendor documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 5,
    "reqName": "Req 5",
    "reqDesc": "Protect All Systems and Networks from Malicious Software",
    "subReq": [
      {
        "id": 5.1,
        "title": "Sub-req 5.1",
        "desc": "Processes and mechanisms for protecting all systems and networks from malicious software are defined and understood.",
        "controls": [
          {
            "id": 1,
            "title": "5.1.1",
            "desc": "All security policies and operational procedures that are identified in Requirement 5 are: Documented, Kept up to date, In use, Known to all affected parties.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "5.1.1",
                "description": "Examine documentation and interview personnel to verify that security policies and operational procedures identified in Requirement 5 are managed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "5.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "5.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "5.1.2",
            "desc": "Roles and responsibilities for performing activities in Requirement 5 are documented, assigned, and understood.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "5.1.2a",
                "description": "Examine documentation to verify that descriptions of roles and responsibilities for performing activities in Requirement 5 are documented and assigned.",
                "reportingInstructions": [
                  {
                    "id": "5.1.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "5.1.2b",
                "description": "Interview personnel with responsibility for performing activities in Requirement 5 to verify that roles and responsibilities are assigned as documented and are understood.",
                "reportingInstructions": [
                  {
                    "id": "5.1.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 5.2,
        "title": "Sub-req 5.2",
        "desc": "Malicious software (malware) is prevented or detected and addressed.",
        "controls": [
          {
            "id": 1,
            "title": "5.2.1",
            "desc": "An anti-malware solution(s) is deployed on all system components, except for those system components identified in periodic evaluations per Requirement 5.2.3 that concludes the system components are not at risk from malware.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "5.2.1a",
                "description": "Examine system components to verify that an anti-malware solution(s) is deployed on all system components, except for those determined to not be at risk from malware based on periodic evaluations per Requirement 5.2.3.",
                "reportingInstructions": [
                  {
                    "id": "5.2.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system components examined for this testing procedure.",
                    "evidenceReference": "others-systemComponents"
                  }
                ]
              },
              {
                "id": "5.2.1b",
                "description": "For any system components without an anti-malware solution, examine the periodic evaluations to verify the component was evaluated and the evaluation concludes that the component is not at risk from malware.",
                "reportingInstructions": [
                  {
                    "id": "5.2.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all periodic evaluations examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "5.2.2",
            "desc": "The deployed anti-malware solution(s): Detects all known types of malware, Removes, blocks, or contains all known types of malware.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "5.2.2",
                "description": "Examine vendor documentation and configurations of the anti-malware solution(s) to verify that the solution: \n \u2022 Detects all known types of malware \n \u2022  Removes, blocks, or contains all known types of malware.",
                "reportingInstructions": [
                  {
                    "id": "5.2.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all vendor documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "5.2.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configurations examined for this testing procedure.",
                    "evidenceReference": "others-config"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "5.2.3",
            "desc": "Any system components that are not at risk for malware are evaluated periodically to include the following: A documented list of all system components not at risk for malware, Identification and evaluation of evolving malware threats for those system components, Confirmation whether such system components continue to not require anti-malware protection.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "5.2.3a",
                "description": "Examine documented policies and procedures to verify that a process is defined for periodic evaluations of any system components that are not at risk for malware that includes all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "5.2.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "5.2.3b",
                "description": "Interview personnel to verify that the evaluations include all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "5.2.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "5.2.3c",
                "description": "Examine the list of system components identified as not at risk of malware and compare to the system components without an anti-malware solution deployed per Requirement 5.2.1 to verify that the system components match for both requirements.",
                "reportingInstructions": [
                  {
                    "id": "5.2.3c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all lists of system components examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "5.2.3.1",
            "desc": "The frequency of periodic evaluations of system components identified as not at risk for malware is defined in the entity's targeted risk analysis, which is performed according to all elements specified in Requirement 12.3.1. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "5.2.3.1a",
                "description": "Examine the entity's targeted risk analysis for the frequency of periodic evaluations of system components identified as not at risk for malware to verify the risk analysis was performed in accordance with all elements specified in Requirement 12.3.1.",
                "reportingInstructions": [
                  {
                    "id": "5.2.3.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the targeted risk analysis examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "5.2.3.1b",
                "description": "Examine documented results of periodic evaluations of system components identified as not at risk for malware and interview personnel to verify that evaluations are performed at the frequency defined in the entity's targeted risk analysis performed for this requirement.",
                "reportingInstructions": [
                  {
                    "id": "5.2.3.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented results of periodic evaluations of system components examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "5.2.3.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 5.3,
        "title": "Sub-req 5.3",
        "desc": "Anti-malware mechanisms and processes are active, maintained, and monitored.",
        "controls": [
          {
            "id": 1,
            "title": "5.3.1",
            "desc": "The anti-malware solution(s) is kept current via automatic updates.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "5.3.1a",
                "description": "Examine anti-malware solution(s) configurations, including any master installation of the software, to verify the solution is configured to perform automatic updates.",
                "reportingInstructions": [
                  {
                    "id": "5.3.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all anti-malware solution(s) configurations examined for this testing procedure.",
                    "evidenceReference": "others-malwareSolutionConfig"
                  }
                ]
              },
              {
                "id": "5.3.1b",
                "description": "Examine system components and logs to verify that the anti-malware solution(s) and definitions are current and have been promptly deployed.",
                "reportingInstructions": [
                  {
                    "id": "5.3.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system components examined for this testing procedure.",
                    "evidenceReference": "others-systemComponents"
                  },
                  {
                    "id": "5.3.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all logs examined for this testing procedure.",
                    "evidenceReference": "others-systemComponents"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "5.3.2",
            "desc": "The anti-malware solution(s): Performs periodic scans and active or real-time scans, OR Performs continuous behavioral analysis of systems or processes.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "5.3.2a",
                "description": "Examine anti-malware solution(s) configurations, including any master installation of the software, to verify the solution(s) is configured to perform at least one of the elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "5.3.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all anti-malware solution(s) configurations examined for this testing procedure.",
                    "evidenceReference": "others-antiMalwareSolutionConfigs"
                  }
                ]
              },
              {
                "id": "5.3.2b",
                "description": "Examine system components, including all operating system types identified as at risk for malware, to verify the solution(s) is enabled in accordance with at least one of the elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "5.3.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system components examined for this testing procedure.",
                    "evidenceReference": "others-systemComponents"
                  }
                ]
              },
              {
                "id": "5.3.2c",
                "description": "Examine logs and scan results to verify that the solution(s) is enabled in accordance with at least one of the elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "5.3.2c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all logs examined for this testing procedure.",
                    "evidenceReference": "others-scanResults"
                  },
                  {
                    "id": "5.3.2c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all scan results examined for this testing procedure.",
                    "evidenceReference": "others-scanResults"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "5.3.2.1",
            "desc": "If periodic malware scans are performed to meet Requirement 5.3.2, the frequency of scans is defined in the entity's targeted risk analysis, which is performed according to all elements specified in Requirement 12.3.1. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "5.3.2.1a",
                "description": "Examine the entity's targeted risk analysis for the frequency of periodic malware scans to verify the risk analysis was performed in accordance with all elements specified in Requirement 12.3.1.",
                "reportingInstructions": [
                  {
                    "id": "5.3.2.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the targeted risk analysis examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "5.3.2.1b",
                "description": "Examine documented results of periodic malware scans and interview personnel to verify scans are performed at the frequency defined in the entity's targeted risk analysis performed for this requirement.",
                "reportingInstructions": [
                  {
                    "id": "5.3.2.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented results of periodic malware scans examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "5.3.2.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "5.3.3",
            "desc": "For removable electronic media, the anti-malware solution(s): Performs automatic scans of when the media is inserted, connected, or logically mounted, OR Performs continuous behavioral analysis of systems or processes when the media is inserted, connected, or logically mounted. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "5.3.3a",
                "description": "Examine anti-malware solution(s) configurations to verify that, for removable electronic media, the solution is configured to perform at least one of the elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "5.3.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all anti-malware solution(s) configurations examined for this testing procedure.",
                    "evidenceReference": "others-antiMalwareSolutionConfigs"
                  }
                ]
              },
              {
                "id": "5.3.3b",
                "description": "Examine system components with removable electronic media connected to verify that the solution(s) is enabled in accordance with at least one of the elements as specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "5.3.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system components examined for this testing procedure.",
                    "evidenceReference": "others-systemComponents"
                  }
                ]
              },
              {
                "id": "5.3.3c",
                "description": "Examine logs and scan results to verify that the solution(s) is enabled in accordance with at least one of the elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "5.3.3c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all logs examined for this testing procedure.",
                    "evidenceReference": "others-scanResults"
                  },
                  {
                    "id": "5.3.3c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all scan results examined for this testing procedure.",
                    "evidenceReference": "others-scanResults"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "5.3.4",
            "desc": "Audit logs for the anti-malware solution(s) are enabled and retained in accordance with Requirement 10.5.1.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "5.3.4",
                "description": "Examine anti-malware solution(s) configurations to verify logs are enabled and retained in accordance with Requirement 10.5.1.",
                "reportingInstructions": [
                  {
                    "id": "5.3.4",
                    "description": "Identify the evidence reference number(s) from Section 6 for all anti-malware solution(s) configurations examined for this testing procedure.",
                    "evidenceReference": "others-malwareSolutionConfig"
                  }
                ]
              }
            ]
          },
          {
            "id": 6,
            "title": "5.3.5",
            "desc": "Anti-malware mechanisms cannot be disabled or altered by users, unless specifically documented, and authorized by management on a case-by-case basis for a limited time period.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "5.3.5a",
                "description": "Examine anti-malware configurations to verify that the anti-malware mechanisms cannot be disabled or altered by users.",
                "reportingInstructions": [
                  {
                    "id": "5.3.5a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all anti-malware solution configurations examined for this testing procedure.",
                    "evidenceReference": "others-malwareSolutionConfig"
                  }
                ]
              },
              {
                "id": "5.3.5b",
                "description": "Interview responsible personnel and observe processes to verify that any requests to disable or alter anti-malware mechanisms are specifically documented and authorized by management on a case-by-case basis for a limited time period.",
                "reportingInstructions": [
                  {
                    "id": "5.3.5b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "5.3.5b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of processes for this testing procedure.",
                    "evidenceReference": "others-observationOfProcesses"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 5.4,
        "title": "Sub-req 5.4",
        "desc": "Anti-phishing mechanisms protect users against phishing attacks.",
        "controls": [
          {
            "id": 1,
            "title": "5.4.1",
            "desc": "Processes and automated mechanisms are in place to detect and protect personnel against phishing attacks. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "5.4.1",
                "description": "Observe implemented processes and examine mechanisms to verify controls are in place to detect and protect personnel against phishing attacks.",
                "reportingInstructions": [
                  {
                    "id": "5.4.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of implemented processes for this testing procedure.",
                    "evidenceReference": "others-mechanisms"
                  },
                  {
                    "id": "5.4.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all mechanisms examined for this testing procedure.",
                    "evidenceReference": "others-mechanisms"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 6,
    "reqName": "Req 6",
    "reqDesc": "Develop and Maintain Secure Systems and Software",
    "subReq": [
      {
        "id": 6.1,
        "title": "Sub-req 6.1",
        "desc": "Processes and mechanisms for developing and maintaining secure systems and software are defined and understood.",
        "controls": [
          {
            "id": 1,
            "title": "6.1.1",
            "desc": "All security policies and operational procedures that are identified in Requirement 6 are: Documented, Kept up to date, In use, Known to all affected parties.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "6.1.1",
                "description": "Examine documentation and interview personnel to verify that security policies and operational procedures identified in Requirement 6 are managed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "6.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "6.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "6.1.2",
            "desc": "Roles and responsibilities for performing activities in Requirement 6 are documented, assigned, and understood.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "6.1.2a",
                "description": "Examine documentation to verify that descriptions of roles and responsibilities for performing activities in Requirement 6 are documented and assigned.",
                "reportingInstructions": [
                  {
                    "id": "6.1.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "6.1.2b",
                "description": "Interview personnel responsible for performing activities in Requirement 6 to verify that roles and responsibilities are assigned as documented and are understood.",
                "reportingInstructions": [
                  {
                    "id": "6.1.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 6.2,
        "title": "Sub-req 6.2",
        "desc": "Bespoke and custom software are developed securely.",
        "controls": [
          {
            "id": 1,
            "title": "6.2.1",
            "desc": "Bespoke and custom software are developed securely, as follows: Based on industry standards and/or best practices for secure development, In accordance with PCI DSS (for example, secure authentication and logging), Incorporating consideration of information security issues during each stage of the software development lifecycle.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "6.2.1",
                "description": "Examine documented software development procedures to verify that processes are defined that include all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "6.2.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for the documented software development procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "6.2.2",
            "desc": "Software development personnel working on bespoke and custom software are trained at least once every 12 months as follows: On software security relevant to their job function and development languages, Including secure software design and secure coding techniques, Including, if security testing tools are used, how to use the tools for detecting vulnerabilities in software.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "6.2.2a",
                "description": "Examine software development procedures to verify that processes are defined for training of software development personnel developing bespoke and custom software that includes all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "6.2.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all software development procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "6.2.2b",
                "description": "Examine training records and interview personnel to verify that software development personnel working on bespoke and custom software received software security training that is relevant to their job function and development languages in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "6.2.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all training records examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "6.2.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "6.2.3",
            "desc": "Bespoke and custom software is reviewed prior to being released into production or to customers, to identify and correct potential coding vulnerabilities, as follows: Code reviews ensure code is developed according to secure coding guidelines, Code reviews look for both existing and emerging software vulnerabilities, Appropriate corrections are implemented prior to release.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "6.2.3a",
                "description": "Examine documented software development procedures and interview responsible personnel to verify that processes are defined that require all bespoke and custom software to be reviewed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "6.2.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the documented software development procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "6.2.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "6.2.3b",
                "description": "Examine evidence of changes to bespoke and custom software to verify that the code changes were reviewed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "6.2.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all evidence of changes examined for this testing procedure.",
                    "evidenceReference": "others-evidenceOfChanges"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "6.2.3.1",
            "desc": "If manual code reviews are performed for bespoke and custom software prior to release to production, code changes are: Reviewed by individuals other than the originating code author, and who are knowledgeable about code-review techniques and secure coding practices, Reviewed and approved by management prior to release.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "6.2.3.1a",
                "description": "If manual code reviews are performed for bespoke and custom software prior to release to production, examine documented software development procedures and interview responsible personnel to verify that processes are defined for manual code reviews to be conducted in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "6.2.3.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the documented software development procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "6.2.3.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "6.2.3.1b",
                "description": "Examine evidence of changes to bespoke and custom software and interview personnel to verify that manual code reviews were conducted in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "6.2.3.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all evidence of changes examined for this testing procedure.",
                    "evidenceReference": "others-evidenceOfChanges"
                  },
                  {
                    "id": "6.2.3.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "6.2.4",
            "desc": "Software engineering techniques or other methods are defined and in use by software development personnel to prevent or mitigate common software attacks and related vulnerabilities in bespoke and custom software, including but not limited to the following: Injection attacks, including SQL, LDAP, XPath, or other command, parameter, object, fault, or injection-type flaws, Attacks on data and data structures, including attempts to manipulate buffers, pointers, input data, or shared data, Attacks on cryptography usage, including attempts to exploit weak, insecure, or inappropriate cryptographic implementations, algorithms, cipher suites, or modes of operation, Attacks on business logic, including attempts to abuse or bypass application features and functionalities through the manipulation of APIs, communication protocols and channels, client-side functionality, or other system/application functions and resources. This includes cross-site scripting (XSS) and cross-site request forgery (CSRF), Attacks on access control mechanisms, including attempts to bypass or abuse identification, authentication, or authorization mechanisms, or attempts to exploit weaknesses in the implementation of such mechanisms, Attacks via any 'high-risk' vulnerabilities identified in the vulnerability identification process, as defined in Requirement 6.3.1.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "6.2.4",
                "description": "Examine documented procedures and interview responsible software development personnel to verify that software engineering techniques or other methods are defined and in use by developers of bespoke and custom software to prevent or mitigate all common software attacks as specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "6.2.4",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "6.2.4",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 6.3,
        "title": "Sub-req 6.3",
        "desc": "Security vulnerabilities are identified and addressed.",
        "controls": [
          {
            "id": 1,
            "title": "6.3.1",
            "desc": "Security vulnerabilities are identified and managed as follows: New security vulnerabilities are identified using industry-recognized sources for security vulnerability information, including alerts from international and national computer emergency response teams (CERTs), Vulnerabilities are assigned a risk ranking based on industry best practices and consideration of potential impact, Risk rankings identify, at a minimum, all vulnerabilities considered to be a high-risk or critical to the environment, Vulnerabilities for bespoke and custom, and third-party software (for example operating systems and databases) are covered.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "6.3.1a",
                "description": "Examine policies and procedures for identifying and managing security vulnerabilities to verify that processes are defined in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "6.3.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "6.3.1b",
                "description": "Interview responsible personnel, examine documentation, and observe processes to verify that security vulnerabilities are identified and managed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "6.3.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "6.3.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "6.3.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of processes for this testing procedure.",
                    "evidenceReference": "others-observationOfProcesses"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "6.3.2",
            "desc": "An inventory of bespoke and custom software, and third-party software components incorporated into bespoke and custom software is maintained to facilitate vulnerability and patch management. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "6.3.2a",
                "description": "Examine documentation and interview personnel to verify that an inventory of bespoke and custom software and third-party software components incorporated into bespoke and custom software is maintained, and that the inventory is used to identify and address vulnerabilities.",
                "reportingInstructions": [
                  {
                    "id": "6.3.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "6.3.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "6.3.2b",
                "description": "Examine software documentation, including for bespoke and custom software that integrates third-party software components, and compare it to the inventory to verify that the inventory includes the bespoke and custom software and third-party software components.",
                "reportingInstructions": [
                  {
                    "id": "6.3.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all software documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "6.3.3",
            "desc": "All system components are protected from known vulnerabilities by installing applicable security patches/updates as follows: Patches/updates for critical vulnerabilities (identified according to the risk ranking process at Requirement 6.3.1) are installed within one month of release, All other applicable security patches/updates are installed within an appropriate time frame as determined by the entity's assessment of the criticality of the risk to the environment as identified according to the risk ranking process at Requirement 6.3.1.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "6.3.3a",
                "description": "Examine policies and procedures to verify processes are defined for addressing vulnerabilities by installing applicable security patches/updates in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "6.3.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "6.3.3b",
                "description": "Examine system components and related software and compare the list of installed security patches/updates to the most recent security patch/update information to verify vulnerabilities are addressed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "6.3.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system components and related software examined for this testing procedure.",
                    "evidenceReference": "others-systemComponent&relatedSoftware"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 6.4,
        "title": "Sub-req 6.4",
        "desc": "Public-facing web applications are protected against attacks.",
        "controls": [
          {
            "id": 1,
            "title": "6.4.1",
            "desc": "For public-facing web applications, new threats and vulnerabilities are addressed on an ongoing basis and these applications are protected against known attacks as follows: Reviewing public-facing web applications via manual or automated application vulnerability security assessment tools or methods as follows: At least once every 12 months and after significant changes, By an entity that specializes in application security, Including, at a minimum, all common software attacks in Requirement 6.2.4, All vulnerabilities are ranked in accordance with requirement 6.3.1, All vulnerabilities are corrected, The application is re-evaluated after the corrections OR Installing an automated technical solution(s) that continually detects and prevents web-based attacks as follows: Installed in front of public-facing web applications to detect and prevent web-based attacks, Actively running and up to date as applicable, Generating audit logs, Configured to either block web-based attacks or generate an alert that is immediately investigated. (Note: This requirement will be superseded by Requirement 6.4.2 after 31 March 2025 when Requirement 6.4.2 becomes effective.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "6.4.1",
                "description": "For public-facing web applications, ensure that either one of the required methods is in place as follows: \n \u2022  If manual or automated vulnerability security assessment tools or methods are in use, examine documented processes, interview personnel, and examine records of application security assessments to verify that public-facing web applications are reviewed in accordance with all elements of this requirement specific to the tool/method. \nOR  \n \u2022 If an automated technical solution(s) is installed that continually detects and prevents web-based attacks, examine the system configuration settings and audit logs, and interview responsible personnel to verify that the automated technical solution(s) is installed in accordance with all elements of this requirement specific to the solution(s).",
                "reportingInstructions": [
                  {
                    "id": "6.4.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented processes examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "6.4.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "6.4.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all records of application security assessments examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigSettings"
                  },
                  {
                    "id": "6.4.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigSettings"
                  },
                  {
                    "id": "6.4.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all audit logs examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigSettings"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "6.4.2",
            "desc": "For public-facing web applications, an automated technical solution is deployed that continually detects and prevents web-based attacks, with at least the following: Is installed in front of public-facing web applications and is configured to detect and prevent web-based attacks, Actively running and up to date as applicable, Generating audit logs, Configured to either block web-based attacks or generate an alert that is immediately investigated. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment. This new requirement will replace Requirement 6.4.1 once its effective date is reached.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "6.4.2",
                "description": "For public-facing web applications, examine the system configuration settings and audit logs, and interview responsible personnel to verify that an automated technical solution that detects and prevents web-based attacks is in place in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "6.4.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigSettings"
                  },
                  {
                    "id": "6.4.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all audit logs examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigSettings"
                  },
                  {
                    "id": "6.4.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "6.4.3",
            "desc": "All payment page scripts that are loaded and executed in the consumer's browser are managed as follows: A method is implemented to confirm that each script is authorized, A method is implemented to assure the integrity of each script, An inventory of all scripts is maintained with written business or technical justification as to why each is necessary. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "6.4.3a",
                "description": "Examine policies and procedures to verify that processes are defined for managing all payment page scripts that are loaded and executed in the consumer's browser, in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "6.4.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "6.4.3b",
                "description": "Interview responsible personnel and examine inventory records and system configurations to verify that all payment page scripts that are loaded and executed in the consumer's browser are managed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "6.4.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "6.4.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all inventory records examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "6.4.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 6.5,
        "title": "Sub-req 6.5",
        "desc": "Changes to all system components are managed securely.",
        "controls": [
          {
            "id": 1,
            "title": "6.5.1",
            "desc": "Changes to all system components in the production environment are made according to established procedures that include: Reason for, and description of, the change, Documentation of security impact, Documented change approval by authorized parties, Testing to verify that the change does not adversely impact system security, For bespoke and custom software changes, all updates are tested for compliance with Requirement 6.2.4 before being deployed into production, Procedures to address failures and return to a secure state.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "6.5.1a",
                "description": "Examine documented change control procedures to verify procedures are defined for changes to all system components in the production environment to include all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "6.5.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented change control procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "6.5.1b",
                "description": "Examine recent changes to system components and trace those changes back to related change control documentation. For each change examined, verify the change is implemented in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "6.5.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all recent changes to system components examined for this testing procedure.",
                    "evidenceReference": "others-recentChangesToSystem"
                  },
                  {
                    "id": "6.5.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all change control documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "6.5.2",
            "desc": "Upon completion of a significant change, all applicable PCI DSS requirements are confirmed to be in place on all new or changed systems and networks, and documentation is updated as applicable.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "6.5.2",
                "description": "Examine documentation for significant changes, interview personnel, and observe the affected systems/networks to verify that the entity confirmed applicable PCI DSS requirements were in place on all new or changed systems and networks and that documentation was updated as applicable.",
                "reportingInstructions": [
                  {
                    "id": "6.5.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "6.5.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "6.5.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of the affected systems/networks for this testing procedure.",
                    "evidenceReference": "others-affectedSystemNetworks"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "6.5.3",
            "desc": "Pre-production environments are separated from production environments and the separation is enforced with access controls.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "6.5.3a",
                "description": "Examine policies and procedures to verify that processes are defined for separating the pre-production environment from the production environment via access controls that enforce the separation.",
                "reportingInstructions": [
                  {
                    "id": "6.5.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "6.5.3b",
                "description": "Examine network documentation and configurations of network security controls to verify that the pre-production environment is separate from the production environment(s).",
                "reportingInstructions": [
                  {
                    "id": "6.5.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all network documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "6.5.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configurations examined for this testing procedure.",
                    "evidenceReference": "others-networkDoc"
                  }
                ]
              },
              {
                "id": "6.5.3c",
                "description": "Examine access control settings to verify that access controls are in place to enforce separation between the pre-production and production environment(s).",
                "reportingInstructions": [
                  {
                    "id": "6.5.3c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all access control settings examined for this testing procedure.",
                    "evidenceReference": "others-accessControlSettings"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "6.5.4",
            "desc": "Roles and functions are separated between production and pre-production environments to provide accountability such that only reviewed and approved changes are deployed.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "6.5.4a",
                "description": "Examine policies and procedures to verify that processes are defined for separating roles and functions to provide accountability such that only reviewed and approved changes are deployed.",
                "reportingInstructions": [
                  {
                    "id": "6.5.4a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "6.5.4b",
                "description": "Observe processes and interview personnel to verify implemented controls separate roles and functions and provide accountability such that only reviewed and approved changes are deployed.",
                "reportingInstructions": [
                  {
                    "id": "6.5.4b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of processes for this testing procedure.",
                    "evidenceReference": "others-processes"
                  },
                  {
                    "id": "6.5.4b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "6.5.5",
            "desc": "Live PANs are not used in pre-production environments, except where those environments are included in the CDE and protected in accordance with all applicable PCI DSS requirements.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "6.5.5a",
                "description": "Examine policies and procedures to verify that processes are defined for not using live PANs in pre-production environments, except where those environments are in a CDE and protected in accordance with all applicable PCI DSS requirements.",
                "reportingInstructions": [
                  {
                    "id": "6.5.5a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "6.5.5b",
                "description": "Observe testing processes and interview personnel to verify procedures are in place to ensure live PANs are not used in pre-production environments, except where those environments are in a CDE and protected in accordance with all applicable PCI DSS requirements.",
                "reportingInstructions": [
                  {
                    "id": "6.5.5b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of the testing processes for this testing procedure.",
                    "evidenceReference": "others-testingProcedures"
                  },
                  {
                    "id": "6.5.5b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "6.5.5c",
                "description": "Examine pre-production test data to verify live PANs are not used in pre-production environments, except where those environments are in a CDE and protected in accordance with all applicable PCI DSS requirements.",
                "reportingInstructions": [
                  {
                    "id": "6.5.5c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all pre-production test data examined for this testing procedure.",
                    "evidenceReference": "others-preproductionTestData"
                  }
                ]
              }
            ]
          },
          {
            "id": 6,
            "title": "6.5.6",
            "desc": "Test data and test accounts are removed from system components before the system goes into production.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "6.5.6a",
                "description": "Examine policies and procedures to verify that processes are defined for removal of test data and test accounts from system components before the system goes into production.",
                "reportingInstructions": [
                  {
                    "id": "6.5.6a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "6.5.6b",
                "description": "Observe testing processes for both off-the-shelf software and in-house applications, and interview personnel to verify test data and test accounts are removed before a system goes into production.",
                "reportingInstructions": [
                  {
                    "id": "6.5.6b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of the testing processes for this testing procedure.",
                    "evidenceReference": "others-testingProcedures"
                  },
                  {
                    "id": "6.5.6b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "6.5.6c",
                "description": "Examine data and accounts for recently installed or updated off-the-shelf software and in-house applications to verify there is no test data or test accounts on systems in production.",
                "reportingInstructions": [
                  {
                    "id": "6.5.6c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all data examined for this testing procedure.",
                    "evidenceReference": "others-data"
                  },
                  {
                    "id": "6.5.6c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all accounts examined for this testing procedure.",
                    "evidenceReference": "others-data"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 7,
    "reqName": "Req 7",
    "reqDesc": "Restrict Access to System Components and Cardholder Data by Business Need to Know",
    "subReq": [
      {
        "id": 7.1,
        "title": "Sub-req 7.1",
        "desc": "Processes and mechanisms for restricting access to system components and cardholder data by business need to know are defined and understood.",
        "controls": [
          {
            "id": 1,
            "title": "7.1.1",
            "desc": "All security policies and operational procedures that are identified in Requirement 7 are: Documented, Kept up to date, In use, Known to all affected parties.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "7.1.1",
                "description": "Examine documentation and interview personnel to verify that security policies and operational procedures identified in Requirement 7 are managed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "7.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "7.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "7.1.2",
            "desc": "Roles and responsibilities for performing activities in Requirement 7 are documented, assigned, and understood.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "7.1.2a",
                "description": "Examine documentation to verify that descriptions of roles and responsibilities for performing activities in Requirement 7 are documented and assigned.",
                "reportingInstructions": [
                  {
                    "id": "7.1.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "7.1.2b",
                "description": "Interview personnel with responsibility for performing activities in Requirement 7 to verify that roles and responsibilities are assigned as documented and are understood.",
                "reportingInstructions": [
                  {
                    "id": "7.1.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 7.2,
        "title": "Sub-req 7.2",
        "desc": "Access to system components and data is appropriately defined and assigned.",
        "controls": [
          {
            "id": 1,
            "title": "7.2.1",
            "desc": "An access control model is defined and includes granting access as follows: Appropriate access depending on the entity's business and access needs, Access to system components and data resources that is based on users' job classification and functions, The least privileges required (for example, user, administrator) to perform a job function.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "7.2.1a",
                "description": "Examine documented policies and procedures and interview personnel to verify the access control model is defined in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "7.2.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "7.2.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "7.2.1b",
                "description": "Examine access control model settings and verify that access needs are appropriately defined in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "7.2.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all access control model settings examined for this testing procedure.",
                    "evidenceReference": "others-accessControlModelSettings"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "7.2.2",
            "desc": "Access is assigned to users, including privileged users, based on: Job classification and function, Least privileges necessary to perform job responsibilities.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "7.2.2a",
                "description": "Examine policies and procedures to verify they cover assigning access to users in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "7.2.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "7.2.2b",
                "description": "Examine user access settings, including for privileged users, and interview responsible management personnel to verify that privileges assigned are in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "7.2.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all user access settings examined for this testing procedure.",
                    "evidenceReference": "others-accessSettings"
                  },
                  {
                    "id": "7.2.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "7.2.2c",
                "description": "Interview personnel responsible for assigning access to verify that privileged user access is assigned in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "7.2.2c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "7.2.3",
            "desc": "Required privileges are approved by authorized personnel.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "7.2.3a",
                "description": "Examine policies and procedures to verify they define processes for approval of all privileges by authorized personnel.",
                "reportingInstructions": [
                  {
                    "id": "7.2.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "7.2.3b",
                "description": "Examine user IDs and assigned privileges, and compare with documented approvals to verify that:  \n \u2022 Documented approval exists for the assigned privileges \n \u2022  The approval was by authorized personnel \n \u2022 Specified privileges match the roles assigned to the individual.",
                "reportingInstructions": [
                  {
                    "id": "7.2.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all user IDs and assigned privileges examined for this testing procedure.",
                    "evidenceReference": "others-userIDs&AssignedPrivileges"
                  },
                  {
                    "id": "7.2.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented approvals examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "7.2.4",
            "desc": "All user accounts and related access privileges, including third-party/vendor accounts, are reviewed as follows: At least once every six months, To ensure user accounts and access remain appropriate based on job function, Any inappropriate access is addressed, Management acknowledges that access remains appropriate. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "7.2.4a",
                "description": "Examine policies and procedures to verify they define processes to review all user accounts and related access privileges, including third-party/vendor accounts, in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "7.2.4a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "7.2.4b",
                "description": "Interview responsible personnel and examine documented results of periodic reviews of user accounts to verify that all the results are in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "7.2.4b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "7.2.4b",
                    "description": "Identify the evidence reference number(s) from Section 6 for the documented results of periodic reviews of user accounts examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "7.2.5",
            "desc": "All application and system accounts and related access privileges are assigned and managed as follows: Based on the least privileges necessary for the operability of the system or application, Access is limited to the systems, applications, or processes that specifically require their use. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "7.2.5a",
                "description": "Examine policies and procedures to verify they define processes to manage and assign application and system accounts and related access privileges in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "7.2.5a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "7.2.5b",
                "description": "Examine privileges associated with system and application accounts and interview responsible personnel to verify that application and system accounts and related access privileges are assigned and managed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "7.2.5b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all privileges associated with system and application accounts examined for this testing procedure.",
                    "evidenceReference": "others-privilegesWithSystem&ApplicationAccounts"
                  },
                  {
                    "id": "7.2.5b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 6,
            "title": "7.2.5.1",
            "desc": "All access by application and system accounts and related access privileges are reviewed as follows: Periodically (at the frequency defined in the entity's targeted risk analysis, which is performed according to all elements specified in Requirement 12.3.1), The application/system access remains appropriate for the function being performed, Any inappropriate access is addressed, Management acknowledges that access remains appropriate. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "7.2.5.1a",
                "description": "Examine policies and procedures to verify they define processes to review all application and system accounts and related access privileges in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "7.2.5.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "7.2.5.1b",
                "description": "Examine the entity's targeted risk analysis for the frequency of periodic reviews of application and system accounts and related access privileges to verify the risk analysis was performed in accordance with all elements specified in Requirement 12.3.1.",
                "reportingInstructions": [
                  {
                    "id": "7.2.5.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for the entity's targeted risk analysis examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "7.2.5.1c",
                "description": "Interview responsible personnel and examine documented results of periodic reviews of system and application accounts and related privileges to verify that the reviews occur in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "7.2.5.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "7.2.5.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented results of periodic reviews examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 7,
            "title": "7.2.6",
            "desc": "All user access to query repositories of stored cardholder data is restricted as follows: Via applications or other programmatic methods, with access and allowed actions based on user roles and least privileges, Only the responsible administrator(s) can directly access or query repositories of stored CHD.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "7.2.6a",
                "description": "Examine policies and procedures and interview personnel to verify processes are defined for granting user access to query repositories of stored cardholder data, in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "7.2.6a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "7.2.6a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "7.2.6b",
                "description": "Examine configuration settings for querying repositories of stored cardholder data to verify they are in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "7.2.6b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-configSetting"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 7.3,
        "title": "Sub-req 7.3",
        "desc": "Access to system components and data is managed via an access control system(s).",
        "controls": [
          {
            "id": 1,
            "title": "7.3.1",
            "desc": "An access control system(s) is in place that restricts access based on a user's need to know and covers all system components.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "7.3.1",
                "description": "Examine vendor documentation and system settings to verify that access is managed for each system component via an access control system(s) that restricts access based on a user's need to know and covers all system components.",
                "reportingInstructions": [
                  {
                    "id": "7.3.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all vendor documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "7.3.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system settings examined for this testing procedure.",
                    "evidenceReference": "others-systemSettings"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "7.3.2",
            "desc": "The access control system(s) is configured to enforce permissions assigned to individuals, applications, and systems based on job classification and function.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "7.3.2",
                "description": "Examine vendor documentation and system settings to verify that the access control system(s) is configured to enforce permissions assigned to individuals, applications, and systems based on job classification and function.",
                "reportingInstructions": [
                  {
                    "id": "7.3.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all vendor documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "7.3.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system settings examined for this testing procedure.",
                    "evidenceReference": "others-systemSettings"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "7.3.3",
            "desc": "The access control system(s) is set to 'deny all' by default.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "7.3.3",
                "description": "Examine vendor documentation and system settings to verify that the access control system(s) is set to 'deny all' by default.",
                "reportingInstructions": [
                  {
                    "id": "7.3.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all vendor documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "7.3.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system settings examined for this testing procedure.",
                    "evidenceReference": "others-systemSettings"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 8,
    "reqName": "Req 8",
    "reqDesc": "Identify Users and Authenticate Access to System Components",
    "subReq": [
      {
        "id": 8.1,
        "title": "Sub-req 8.1",
        "desc": "Processes and mechanisms for identifying users and authenticating access to system components are defined and understood.",
        "controls": [
          {
            "id": 1,
            "title": "8.1.1",
            "desc": "All security policies and operational procedures that are identified in Requirement 8 are: Documented, Kept up to date, In use, Known to all affected parties.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.1.1",
                "description": "Examine documentation and interview personnel to verify that security policies and operational procedures identified in Requirement 8 are managed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "8.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "8.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "8.1.2",
            "desc": "Roles and responsibilities for performing activities in Requirement 8 are documented, assigned, and understood.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.1.2a",
                "description": "Examine documentation to verify that descriptions of roles and responsibilities for performing activities in Requirement 8 are documented and assigned.",
                "reportingInstructions": [
                  {
                    "id": "8.1.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "8.1.2b",
                "description": "Interview personnel with responsibility for performing activities in Requirement 8 to verify that roles and responsibilities are assigned as documented and are understood.",
                "reportingInstructions": [
                  {
                    "id": "8.1.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 8.2,
        "title": "Sub-req 8.2",
        "desc": "User identification and related accounts for users and administrators are strictly managed throughout an account's lifecycle.",
        "controls": [
          {
            "id": 1,
            "title": "8.2.1",
            "desc": "All users are assigned a unique ID before access to system components or cardholder data is allowed.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.2.1a",
                "description": "Interview responsible personnel to verify that all users are assigned a unique ID for access to system components and cardholder data.",
                "reportingInstructions": [
                  {
                    "id": "8.2.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "8.2.1b",
                "description": "Examine audit logs and other evidence to verify that access to system components and cardholder data can be uniquely identified and associated with individuals.",
                "reportingInstructions": [
                  {
                    "id": "8.2.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all audit logs examined for this testing procedure.",
                    "evidenceReference": "others-otherEvidence"
                  },
                  {
                    "id": "8.2.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for any other evidence examined for this testing procedure.",
                    "evidenceReference": "others-otherEvidence"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "8.2.2",
            "desc": "Group, shared, or generic IDs, or other shared authentication credentials are only used when necessary on an exception basis, and are managed as follows: \n \u2022  ID use is prevented unless needed for an exceptional circumstance \n \u2022  Use is limited to the time needed for the exceptional circumstance \n \u2022  Business justification for use is documented \n \u2022  Use is explicitly approved by management \n \u2022  Individual user identity is confirmed before access to an account is granted \n \u2022  Every action taken is attributable to an individual user.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.2.2a",
                "description": "Examine user account lists on system components and applicable documentation to verify that shared authentication credentials are only used when necessary, on an exception basis, and are managed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "8.2.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all user account lists examined for this testing procedure.",
                    "evidenceReference": "others-userAccountLists"
                  },
                  {
                    "id": "8.2.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "8.2.2b",
                "description": "Examine authentication policies and procedures to verify processes are defined for shared authentication credentials such that they are only used when necessary, on an exception basis, and are managed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "8.2.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all authentication policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "8.2.2c",
                "description": "Interview system administrators to verify that shared authentication credentials are only used when necessary, on an exception basis, and are managed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "8.2.2c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "8.2.3",
            "desc": "Additional requirement for service providers only: Service providers with remote access to customer premises use unique authentication factors for each customer premises.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.2.3",
                "description": "Additional testing procedure for service provider assessments only: Examine authentication policies and procedures and interview personnel to verify that service providers with remote access to customer premises use unique authentication factors for remote access to each customer premises.",
                "reportingInstructions": [
                  {
                    "id": "8.2.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all authentication policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "8.2.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "8.2.4",
            "desc": "Addition, deletion, and modification of user IDs, authentication factors, and other identifier objects are managed as follows: Authorized with the appropriate approval, Implemented with only the privileges specified on the documented approval.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.2.4",
                "description": "Examine documented authorizations across various phases of the account lifecycle (additions, modifications, and deletions) and examine system settings to verify the activity has been managed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "8.2.4",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented authorizations examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "8.2.4",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system settings examined for this testing procedure.",
                    "evidenceReference": "others-systemSettings"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "8.2.5",
            "desc": "Access for terminated users is immediately revoked.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.2.5a",
                "description": "Examine information sources for terminated users and review current user access lists\u2014for both local and remote access\u2014to verify that terminated user IDs have been deactivated or removed from the access lists.",
                "reportingInstructions": [
                  {
                    "id": "8.2.5a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all information sources examined for this testing procedure.",
                    "evidenceReference": "others-informationSources"
                  },
                  {
                    "id": "8.2.5a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all current user access lists examined for this testing procedure.",
                    "evidenceReference": "others-informationSources"
                  }
                ]
              },
              {
                "id": "8.2.5b",
                "description": "Interview responsible personnel to verify that all physical authentication factors\u2014such as, smart cards, tokens, etc.\u2014have been returned or deactivated for terminated users.",
                "reportingInstructions": [
                  {
                    "id": "8.2.5b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 6,
            "title": "8.2.6",
            "desc": "Inactive user accounts are removed or disabled within 90 days of inactivity.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.2.6",
                "description": "Examine user accounts and last logon information, and interview personnel to verify that any inactive user accounts are removed or disabled within 90 days of inactivity.",
                "reportingInstructions": [
                  {
                    "id": "8.2.6",
                    "description": "Identify the evidence reference number(s) from Section 6 for all user accounts and last login information examined for this testing procedure.",
                    "evidenceReference": "others-userAccounts&LastLoginInfo"
                  },
                  {
                    "id": "8.2.6",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 7,
            "title": "8.2.7",
            "desc": "Accounts used by third parties to access, support, or maintain system components via remote access are managed as follows: Enabled only during the time period needed and disabled when not in use, Use is monitored for unexpected activity.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.2.7",
                "description": "Interview personnel, examine documentation for managing accounts, and examine evidence to verify that accounts used by third parties for remote access are managed according to all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "8.2.7",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "8.2.7",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "8.2.7",
                    "description": "Identify the evidence reference number(s) from Section 6 for any other evidence examined for this testing procedure.",
                    "evidenceReference": "others-otherEvidence"
                  }
                ]
              }
            ]
          },
          {
            "id": 8,
            "title": "8.2.8",
            "desc": "If a user session has been idle for more than 15 minutes, the user is required to re-authenticate to re-activate the terminal or session.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.2.8",
                "description": "Examine system configuration settings to verify that system/session idle timeout features for user sessions have been set to 15 minutes or less.",
                "reportingInstructions": [
                  {
                    "id": "8.2.8",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigSettings"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 8.3,
        "title": "Sub-req 8.3",
        "desc": "Strong authentication for users and administrators is established and managed.",
        "controls": [
          {
            "id": 1,
            "title": "8.3.1",
            "desc": "All user access to system components for users and administrators is authenticated via at least one of the following authentication factors: Something you know, such as a password or passphrase, Something you have, such as a token device or smart card, Something you are, such as a biometric element.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.3.1a",
                "description": "Examine documentation describing the authentication factor(s) used to verify that user access to system components is authenticated via at least one authentication factor specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "8.3.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "8.3.1b",
                "description": "For each type of authentication factor used with each type of system component, observe an authentication to verify that authentication is functioning consistently with documented authentication factor(s).",
                "reportingInstructions": [
                  {
                    "id": "8.3.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of each type of authentication factor used for this testing procedure.",
                    "evidenceReference": "others-typesOfAuthFactorsUsed"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "8.3.2",
            "desc": "Strong cryptography is used to render all authentication factors unreadable during transmission and storage on all system components.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.3.2a",
                "description": "Examine vendor documentation and system configuration settings to verify that authentication factors are rendered unreadable with strong cryptography during transmission and storage.",
                "reportingInstructions": [
                  {
                    "id": "8.3.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all vendor documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "8.3.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigSettings"
                  }
                ]
              },
              {
                "id": "8.3.2b",
                "description": "Examine repositories of authentication factors to verify that they are unreadable during storage.",
                "reportingInstructions": [
                  {
                    "id": "8.3.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all repositories of authentication factors examined for this testing procedure.",
                    "evidenceReference": "others-repositoriesOfAuthFactors"
                  }
                ]
              },
              {
                "id": "8.3.2c",
                "description": "Examine data transmissions to verify that authentication factors are unreadable during transmission.",
                "reportingInstructions": [
                  {
                    "id": "8.3.2c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all data transmissions examined for this testing procedure.",
                    "evidenceReference": "others-dataTransmission"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "8.3.3",
            "desc": "User identity is verified before modifying any authentication factor.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.3.3",
                "description": "Examine procedures for modifying authentication factors and observe security personnel to verify that when a user requests a modification of an authentication factor, the user's identity is verified before the authentication factor is modified.",
                "reportingInstructions": [
                  {
                    "id": "8.3.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "8.3.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of security personnel for this testing procedure.",
                    "evidenceReference": "others-procedures"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "8.3.4",
            "desc": "Invalid authentication attempts are limited by: Locking out the user ID after not more than 10 attempts, Setting the lockout duration to a minimum of 30 minutes or until the user's identity is confirmed.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.3.4a",
                "description": "Examine system configuration settings to verify that authentication parameters are set to require that user accounts be locked out after not more than 10 invalid logon attempts.",
                "reportingInstructions": [
                  {
                    "id": "8.3.4a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigSettings"
                  }
                ]
              },
              {
                "id": "8.3.4b",
                "description": "Examine system configuration settings to verify that password parameters are set to require that once a user account is locked out, it remains locked for a minimum of 30 minutes or until the user's identity is confirmed.",
                "reportingInstructions": [
                  {
                    "id": "8.3.4b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigSettings"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "8.3.5",
            "desc": "If passwords/passphrases are used as authentication factors to meet Requirement 8.3.1, they are set and reset for each user as follows: Set to a unique value for first-time use and upon reset, Forced to be changed immediately after the first use.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.3.5",
                "description": "Examine procedures for setting and resetting passwords/passphrases (if used as authentication factors to meet Requirement 8.3.1) and observe security personnel to verify that passwords/passphrases are set and reset in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "8.3.5",
                    "description": "Identify the evidence reference number(s) from Section 6 for all procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "8.3.5",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of security personnel for this testing procedure.",
                    "evidenceReference": "others-procedures"
                  }
                ]
              }
            ]
          },
          {
            "id": 6,
            "title": "8.3.6",
            "desc": "If passwords/passphrases are used as authentication factors to meet Requirement 8.3.1, they meet the following minimum level of complexity: A minimum length of 12 characters (or IF the system does not support 12 characters, a minimum length of eight characters), Contain both numeric and alphabetic characters. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment. Until 31 March 2025, passwords must be a minimum length of seven characters in accordance with PCI DSS v3.2.1 Requirement 8.2.3.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.3.6",
                "description": "Examine system configuration settings to verify that user password/passphrase complexity parameters are set in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "8.3.6",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigSettings"
                  }
                ]
              }
            ]
          },
          {
            "id": 7,
            "title": "8.3.7",
            "desc": "Individuals are not allowed to submit a new password/passphrase that is the same as any of the last four passwords/passphrases used.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.3.7",
                "description": "Examine system configuration settings to verify that password parameters are set to require that new passwords/passphrases cannot be the same as the four previously used passwords/passphrases.",
                "reportingInstructions": [
                  {
                    "id": "8.3.7",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigSettings"
                  }
                ]
              }
            ]
          },
          {
            "id": 8,
            "title": "8.3.8",
            "desc": "Authentication policies and procedures are documented and communicated to all users including: Guidance on selecting strong authentication factors, Guidance for how users should protect their authentication factors, Instructions not to reuse previously used passwords/passphrases, Instructions to change passwords/passphrases if there is any suspicion or knowledge that the password/passphrases have been compromised and how to report the incident.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.3.8a",
                "description": "Examine procedures and interview personnel to verify that authentication policies and procedures are distributed to all users.",
                "reportingInstructions": [
                  {
                    "id": "8.3.8a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "8.3.8a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "8.3.8b",
                "description": "Review authentication policies and procedures that are distributed to users and verify they include the elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "8.3.8b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all authentication policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "8.3.8c",
                "description": "Interview users to verify that they are familiar with authentication policies and procedures.",
                "reportingInstructions": [
                  {
                    "id": "8.3.8c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 9,
            "title": "8.3.9",
            "desc": "If passwords/passphrases are used as the only authentication factor for user access (i.e., in any single-factor authentication implementation) then either: Passwords/passphrases are changed at least once every 90 days, OR The security posture of accounts is dynamically analyzed, and real-time access to resources is automatically determined accordingly.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.3.9",
                "description": "If passwords/passphrases are used as the only authentication factor for user access, inspect system configuration settings to verify that passwords/passphrases are managed in accordance with ONE of the elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "8.3.9",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigSettings"
                  }
                ]
              }
            ]
          },
          {
            "id": 10,
            "title": "8.3.10",
            "desc": "Additional requirement for service providers only: If passwords/passphrases are used as the only authentication factor for customer user access to cardholder data (i.e., in any single-factor authentication implementation), then guidance is provided to customer users including: Guidance for customers to change their user passwords/passphrases periodically, Guidance as to when, and under what circumstances, passwords/passphrases are to be changed. (Note: This requirement for service providers will be superseded by Requirement 8.3.10.1 once 8.3.10.1 becomes effective.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.3.10",
                "description": "Additional testing procedure for service provider assessments only: If passwords/passphrases are used as the only authentication factor for customer user access to cardholder data, examine guidance provided to customer users to verify that the guidance includes all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "8.3.10",
                    "description": "Identify the evidence reference number(s) from Section 6 for all guidance provided to customer users examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 11,
            "title": "8.3.10.1",
            "desc": "Additional requirement for service providers only: If passwords/passphrases are used as the only authentication factor for customer user access (i.e., in any single-factor authentication implementation) then either: Passwords/passphrases are changed at least once every 90 days, OR The security posture of accounts is dynamically analyzed, and real-time access to resources is automatically determined accordingly. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment. Until this requirement is effective on 31 March 2025, service providers may meet either Requirement 8.3.10 or 8.3.10.1.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.3.10.1",
                "description": "Additional testing procedure for service provider assessments only: If passwords/passphrases are used as the only authentication factor for customer user access, inspect system configuration settings to verify that passwords/passphrases are managed in accordance with ONE of the elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "8.3.10.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigSettings"
                  }
                ]
              }
            ]
          },
          {
            "id": 12,
            "title": "8.3.11",
            "desc": "Where authentication factors such as physical or logical security tokens, smart cards, or certificates are used: Factors are assigned to an individual user and not shared among multiple users, Physical and/or logical controls ensure only the intended user can use that factor to gain access.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.3.11a",
                "description": "Examine authentication policies and procedures to verify that procedures for using authentication factors such as physical security tokens, smart cards, and certificates are defined and include all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "8.3.11a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all authentication policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "8.3.11b",
                "description": "Interview security personnel to verify authentication factors are assigned to an individual user and not shared among multiple users.",
                "reportingInstructions": [
                  {
                    "id": "8.3.11b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "8.3.11c",
                "description": "Examine system configuration settings and/or observe physical controls, as applicable, to verify that controls are implemented to ensure only the intended user can use that factor to gain access.",
                "reportingInstructions": [
                  {
                    "id": "8.3.11c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigSettings"
                  },
                  {
                    "id": "8.3.11c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of physical controls conducted for this testing procedure.",
                    "evidenceReference": "others-systemConfigSettings"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 8.4,
        "title": "Sub-req 8.4",
        "desc": "Multi-factor authentication (MFA) is implemented to secure access into the CDE.",
        "controls": [
          {
            "id": 1,
            "title": "8.4.1",
            "desc": "MFA is implemented for all non-console access into the CDE for personnel with administrative access.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.4.1a",
                "description": "Examine network and/or system configurations to verify MFA is required for all non-console into the CDE for personnel with administrative access.",
                "reportingInstructions": [
                  {
                    "id": "8.4.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all network and/or system configurations examined for this testing procedure.",
                    "evidenceReference": "others-networkSystemConfig"
                  }
                ]
              },
              {
                "id": "8.4.1b",
                "description": "Observe administrator personnel logging into the CDE and verify that MFA is required.",
                "reportingInstructions": [
                  {
                    "id": "8.4.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of administrator personnel logging into the CDE for this testing procedure.",
                    "evidenceReference": "others-adminPersonnelLoggingInCDE "
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "8.4.2",
            "desc": "MFA is implemented for all non-console access into the CDE. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.4.2a",
                "description": "Examine network and/or system configurations to verify MFA is implemented for all non-console access into the CDE.",
                "reportingInstructions": [
                  {
                    "id": "8.4.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all network and/or system configurations examined for this testing procedure.",
                    "evidenceReference": "others-networkSystemConfig"
                  }
                ]
              },
              {
                "id": "8.4.2b",
                "description": "Observe personnel logging in to the CDE and examine evidence to verify that MFA is required.",
                "reportingInstructions": [
                  {
                    "id": "8.4.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of personnel logging into the CDE for this testing procedure.",
                    "evidenceReference": "others-personnelLoggingInCDE"
                  },
                  {
                    "id": "8.4.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for any additional evidence examined for this testing procedure.",
                    "evidenceReference": "others-personnelLoggingInCDE"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "8.4.3",
            "desc": "MFA is implemented for all remote access originating from outside the entity's network that could access or impact the CDE.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.4.3a",
                "description": "Examine network and/or system configurations for remote access servers and systems to verify MFA is required in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "8.4.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all network and/or system configurations examined for this testing procedure.",
                    "evidenceReference": "others-networkSystemConfig"
                  }
                ]
              },
              {
                "id": "8.4.3b",
                "description": "Observe personnel (for example, users and administrators) and third parties connecting remotely to the network and verify that multi-factor authentication is required.",
                "reportingInstructions": [
                  {
                    "id": "8.4.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of personnel connecting remotely to the network for this testing procedure.",
                    "evidenceReference": "others-personnelConnectRemotelyToNetwork"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 8.5,
        "title": "Sub-req 8.5",
        "desc": "Multi-factor authentication (MFA) systems are configured to prevent misuse.",
        "controls": [
          {
            "id": 1,
            "title": "8.5.1",
            "desc": "MFA systems are implemented as follows: The MFA system is not susceptible to replay attacks, MFA systems cannot be bypassed by any users, including administrative users unless specifically documented, and authorized by management on an exception basis, for a limited time period, At least two different types of authentication factors are used, Success of all authentication factors is required before access is granted. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.5.1a",
                "description": "Examine vendor system documentation to verify that the MFA system is not susceptible to replay attacks.",
                "reportingInstructions": [
                  {
                    "id": "8.5.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all vendor system documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "8.5.1b",
                "description": "Examine system configurations for the MFA implementation to verify it is configured in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "8.5.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  }
                ]
              },
              {
                "id": "8.5.1c",
                "description": "Interview responsible personnel and observe processes to verify that any requests to bypass MFA are specifically documented and authorized by management on an exception basis, for a limited time period.",
                "reportingInstructions": [
                  {
                    "id": "8.5.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "8.5.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of processes for this testing procedure.",
                    "evidenceReference": "others-observationOfProcesses"
                  }
                ]
              },
              {
                "id": "8.5.1d",
                "description": "Observe personnel logging into system components in the CDE to verify that access is granted only after all authentication factors are successful.",
                "reportingInstructions": [
                  {
                    "id": "8.5.1d",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of personnel logging into system components in the CDE for this testing procedure.",
                    "evidenceReference": "others-personnelLoggingInSystemCompInCDE"
                  }
                ]
              },
              {
                "id": "8.5.1e",
                "description": "Observe personnel connecting remotely from outside the entity's network to verify that access is granted only after all authentication factors are successful.",
                "reportingInstructions": [
                  {
                    "id": "8.5.1e",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of personnel connecting remotely from outside the entity's network for this testing procedure.",
                    "evidenceReference": "others-personnelConnectingRemotelyFromOutside"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 8.6,
        "title": "Sub-req 8.6",
        "desc": "Use of application and system accounts and associated authentication factors is strictly managed.",
        "controls": [
          {
            "id": 1,
            "title": "8.6.1",
            "desc": "If accounts used by systems or applications can be used for interactive login, they are managed as follows: Interactive use is prevented unless needed for an exceptional circumstance, Interactive use is limited to the time needed for the exceptional circumstance, Business justification for interactive use is documented, Interactive use is explicitly approved by management, Individual user identity is confirmed before access to account is granted, Every action taken is attributable to an individual user. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.6.1",
                "description": "Examine application and system accounts that can be used interactively and interview administrative personnel to verify that application and system accounts are managed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "8.6.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all application and system accounts examined for this testing procedure.",
                    "evidenceReference": "others-application&SystemAccounts"
                  },
                  {
                    "id": "8.6.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "8.6.2",
            "desc": "Passwords/passphrases for any application and system accounts that can be used for interactive login are not hard coded in scripts, configuration/property files, or bespoke and custom source code. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.6.2a",
                "description": "Interview personnel and examine system development procedures to verify that processes are defined for application and system accounts that can be used for interactive login, specifying that passwords/passphrases are not hard coded in scripts, configuration/property files, or bespoke and custom source code.",
                "reportingInstructions": [
                  {
                    "id": "8.6.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "8.6.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system development procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "8.6.2b",
                "description": "Examine scripts, configuration/property files, and bespoke and custom source code for application and system accounts that can be used for interactive login, to verify passwords/passphrases for those accounts are not present.",
                "reportingInstructions": [
                  {
                    "id": "8.6.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all scripts, configuration/property files, and bespoke and custom source code examined for this testing procedure.",
                    "evidenceReference": "others-scriptsConfigBespokeCustomSourceCode"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "8.6.3",
            "desc": "Passwords/passphrases for any application and system accounts are protected against misuse as follows: Passwords/passphrases are changed periodically (at the frequency defined in the entity's targeted risk analysis, which is performed according to all elements specified in Requirement 12.3.1) and upon suspicion or confirmation of compromise, Passwords/passphrases are constructed with sufficient complexity appropriate for how frequently the entity changes the passwords/passphrases. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "8.6.3a",
                "description": "Examine policies and procedures to verify that procedures are defined to protect passwords/passphrases for application or system accounts against misuse in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "8.6.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "8.6.3b",
                "description": "Examine the entity's targeted risk analysis for the change frequency and complexity for passwords/passphrases for application and system accounts to verify the risk analysis was performed in accordance with all elements specified in Requirement 12.3.1 and addresses:  \n \u2022 The frequency defined for periodic changes to application and system passwords/passphrases \n \u2022 The complexity defined for passwords/passphrases and appropriateness of the complexity relative to the frequency of changes.",
                "reportingInstructions": [
                  {
                    "id": "8.6.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for the entity's targeted risk analysis examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "8.6.3c",
                "description": "Interview responsible personnel and examine system configuration settings to verify that passwords/passphrases for any application and system accounts are protected against misuse in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "8.6.3c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "8.6.3c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigSettings"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 9,
    "reqName": "Req 9",
    "reqDesc": "Restrict Physical Access to Cardholder Data",
    "subReq": [
      {
        "id": 9.1,
        "title": "Sub-req 9.1",
        "desc": "Processes and mechanisms for restricting physical access to cardholder data are defined and understood.",
        "controls": [
          {
            "id": 1,
            "title": "9.1.1",
            "desc": "All security policies and operational procedures that are identified in Requirement 9 are: Documented, Kept up to date, In use, Known to all affected parties.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.1.1",
                "description": "Examine documentation and interview personnel to verify that security policies and operational procedures identified in Requirement 9 are managed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "9.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "9.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "9.1.2",
            "desc": "Roles and responsibilities for performing activities in Requirement 9 are documented, assigned, and understood.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.1.2a",
                "description": "Examine documentation to verify that descriptions of roles and responsibilities for performing activities in Requirement 9 are documented and assigned.",
                "reportingInstructions": [
                  {
                    "id": "9.1.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "9.1.2b",
                "description": "Interview personnel with responsibility for performing activities in Requirement 9 to verify that roles and responsibilities are assigned as documented and are understood.",
                "reportingInstructions": [
                  {
                    "id": "9.1.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 9.2,
        "title": "Sub-req 9.2",
        "desc": "Physical access controls manage entry into facilities and systems containing cardholder data.",
        "controls": [
          {
            "id": 1,
            "title": "9.2.1",
            "desc": "Appropriate facility entry controls are in place to restrict physical access to systems in the CDE.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.2.1",
                "description": "Observe entry controls and interview responsible personnel to verify that physical security controls are in place to restrict access to systems in the CDE.",
                "reportingInstructions": [
                  {
                    "id": "9.2.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of the entry controls for this testing procedure.",
                    "evidenceReference": "others-entryControls"
                  },
                  {
                    "id": "9.2.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "9.2.1.1",
            "desc": "Individual physical access to sensitive areas within the CDE is monitored with either video cameras or physical access control mechanisms (or both) as follows: Entry and exit points to/from sensitive areas within the CDE are monitored, Monitoring devices or mechanisms are protected from tampering or disabling, Collected data is reviewed and correlated with other entries, Collected data is stored for at least three months, unless otherwise restricted by law.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.2.1.1a",
                "description": "Observe locations where individual physical access to sensitive areas within the CDE occurs to verify that either video cameras or physical access control mechanisms (or both) are in place to monitor the entry and exit points.",
                "reportingInstructions": [
                  {
                    "id": "9.2.1.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of locations where individual physical access to sensitive areas within the CDE occurs for this testing procedure.",
                    "evidenceReference": "others-physicalAccesstoSensitiveAreasInCDE"
                  }
                ]
              },
              {
                "id": "9.2.1.1b",
                "description": "Observe locations where individual physical access to sensitive areas within the CDE occurs to verify that either video cameras or physical access control mechanisms (or both) are protected from tampering or disabling.",
                "reportingInstructions": [
                  {
                    "id": "9.2.1.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of locations where individual physical access to the CDE occurs for this testing procedure.",
                    "evidenceReference": "others-physicalAccesstoCDE"
                  }
                ]
              },
              {
                "id": "9.2.1.1c",
                "description": "Observe the physical access control mechanisms and/or examine video cameras and interview responsible personnel to verify that: \n \u2022 Collected data from video cameras and/or physical access control mechanisms is reviewed and correlated with other entries \n \u2022 Collected data is stored for at least three months.",
                "reportingInstructions": [
                  {
                    "id": "9.2.1.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of the physical access control mechanisms for this testing procedure.",
                    "evidenceReference": "others-videoCamera"
                  },
                  {
                    "id": "9.2.1.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all video cameras examined for this testing procedure.",
                    "evidenceReference": "others-videoCamera"
                  },
                  {
                    "id": "9.2.1.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "9.2.2",
            "desc": "Physical and/or logical controls are implemented to restrict use of publicly accessible network jacks within the facility.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.2.2",
                "description": "Interview responsible personnel and observe locations of publicly accessible network jacks to verify that physical and/or logical controls are in place to restrict access to publicly accessible network jacks within the facility.",
                "reportingInstructions": [
                  {
                    "id": "9.2.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "9.2.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of the locations of publicly accessible network jacks for this testing procedure.",
                    "evidenceReference": "others-publicAccessibleNetworkJackLocations"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "9.2.3",
            "desc": "Physical access to wireless access points, gateways, networking/communications hardware, and telecommunication lines within the facility is restricted.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.2.3",
                "description": "Interview responsible personnel and observe locations of hardware and lines to verify that physical access to wireless access points, gateways, networking/communications hardware, and telecommunication lines within the facility is restricted.",
                "reportingInstructions": [
                  {
                    "id": "9.2.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "9.2.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of the locations of hardware and lines for this testing procedure.",
                    "evidenceReference": "others-locationOfHardwareLines"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "9.2.4",
            "desc": "Access to consoles in sensitive areas is restricted via locking when not in use.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.2.4",
                "description": "Observe a system administrator's attempt to log into consoles in sensitive areas and verify that they are 'locked' to prevent unauthorized use.",
                "reportingInstructions": [
                  {
                    "id": "9.2.4",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of a system administrator's attempt to log into consoles in sensitive areas for this testing procedure.",
                    "evidenceReference": "others-systemAdminLoginSensitiveAreas"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 9.3,
        "title": "Sub-req 9.3",
        "desc": "Physical access for personnel and visitors is authorized and managed.",
        "controls": [
          {
            "id": 1,
            "title": "9.3.1",
            "desc": "Procedures are implemented for authorizing and managing physical access of personnel to the CDE, including: Identifying personnel, Managing changes to an individual's physical access requirements, Revoking or terminating personnel identification, Limiting access to the identification process or system to authorized personnel.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.3.1a",
                "description": "Examine documented procedures to verify that procedures to authorize and manage physical access of personnel to the CDE are defined in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "9.3.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "9.3.1b",
                "description": "Observe identification methods, such as ID badges, and processes to verify that personnel in the CDE are clearly identified.",
                "reportingInstructions": [
                  {
                    "id": "9.3.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of all identification methods and processes for this testing procedure.",
                    "evidenceReference": "others-IdentifyMethods&Processes"
                  }
                ]
              },
              {
                "id": "9.3.1c",
                "description": "Observe processes to verify that access to the identification process, such as a badge system, is limited to authorized personnel.",
                "reportingInstructions": [
                  {
                    "id": "9.3.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of processes for this testing procedure.",
                    "evidenceReference": "others-observationOfProcesses"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "9.3.1.1",
            "desc": "Physical access to sensitive areas within the CDE for personnel is controlled as follows: Access is authorized and based on individual job function, Access is revoked immediately upon termination, All physical access mechanisms, such as keys, access cards, etc., are returned or disabled upon termination.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.3.1.1a",
                "description": "Observe personnel in sensitive areas within the CDE, interview responsible personnel, and examine physical access control lists to verify that:  \n \u2022 Access to the sensitive area is authorized. \n \u2022 Access is required for the individual's job function.",
                "reportingInstructions": [
                  {
                    "id": "9.3.1.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of personnel in sensitive areas for this testing procedure.",
                    "evidenceReference": "others-physicalAccessControlLists"
                  },
                  {
                    "id": "9.3.1.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "9.3.1.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all physical access control lists examined for this testing procedure.",
                    "evidenceReference": "others-physicalAccessControlLists"
                  }
                ]
              },
              {
                "id": "9.3.1.1b",
                "description": "Observe processes and interview personnel to verify that access of all personnel is revoked immediately upon termination.",
                "reportingInstructions": [
                  {
                    "id": "9.3.1.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of processes for this testing procedure.",
                    "evidenceReference": "others-observationOfProcesses"
                  },
                  {
                    "id": "9.3.1.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "9.3.1.1c",
                "description": "For terminated personnel, examine physical access controls lists and interview responsible personnel to verify that all physical access mechanisms (such as keys, access cards, etc.) were returned or disabled.",
                "reportingInstructions": [
                  {
                    "id": "9.3.1.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all physical access control lists examined for this testing procedure.",
                    "evidenceReference": "others-physicalAccessControlLists"
                  },
                  {
                    "id": "9.3.1.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "9.3.2",
            "desc": "Procedures are implemented for authorizing and managing visitor access to the CDE, including: Visitors are authorized before entering, Visitors are escorted at all times, Visitors are clearly identified and given a badge or other identification that expires, Visitor badges or other identification visibly distinguishes visitors from personnel.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.3.2a",
                "description": "Examine documented procedures and interview personnel to verify procedures are defined for authorizing and managing visitor access to the CDE in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "9.3.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "9.3.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "9.3.2b",
                "description": "Observe processes when visitors are present in the CDE and interview personnel to verify that visitors are: \n \u2022 Authorized before entering the CDE \n \u2022  Escorted at all times within the CDE.",
                "reportingInstructions": [
                  {
                    "id": "9.3.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of processes when visitors are present in the CDE for this testing procedure.",
                    "evidenceReference": "others-visitorPresentInCDEObservations"
                  },
                  {
                    "id": "9.3.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "9.3.2c",
                "description": "Observe the use of visitor badges or other identification to verify that the badge or other identification does not permit unescorted access to the CDE.",
                "reportingInstructions": [
                  {
                    "id": "9.3.2c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of the use of visitor badges or other identification for this testing procedure.",
                    "evidenceReference": "others-useOfVisitorBadge"
                  }
                ]
              },
              {
                "id": "9.3.2d",
                "description": "Observe visitors in the CDE to verify that: \n \u2022 Visitor badges or other identification are being used for all visitors \n \u2022  Visitor badges or identification easily distinguish visitors from personnel.",
                "reportingInstructions": [
                  {
                    "id": "9.3.2d",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations conducted for this testing procedure.",
                    "evidenceReference": "others-allObservations"
                  }
                ]
              },
              {
                "id": "9.3.2e",
                "description": "Examine visitor badges or other identification and observe evidence in the badging system to verify visitor badges or other identification expires.",
                "reportingInstructions": [
                  {
                    "id": "9.3.2e",
                    "description": "Identify the evidence reference number(s) from Section 6 for all visitor badges or other identification examined for this testing procedure.",
                    "evidenceReference": "others-visitorBadges"
                  },
                  {
                    "id": "9.3.2e",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of evidence in the badging system for this testing procedure.",
                    "evidenceReference": "others-visitorBadges"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "9.3.3",
            "desc": "Visitor badges or identification are surrendered or deactivated before visitors leave the facility or at the date of expiration.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.3.3",
                "description": "Observe visitors leaving the facility and interview personnel to verify visitor badges or other identification are surrendered or deactivated before visitors leave the facility or at the date of expiration, upon departure or expiration.",
                "reportingInstructions": [
                  {
                    "id": "9.3.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of visitors leaving the facility for this testing procedure.",
                    "evidenceReference": "others-observationOfVisitorsLeaving"
                  },
                  {
                    "id": "9.3.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "9.3.4",
            "desc": "Visitor logs are used to maintain a physical record of visitor activity both within the facility and within sensitive areas, including: The visitor's name and the organization represented, The date and time of the visit, The name of the personnel authorizing physical access, Retaining the log for at least three months, unless otherwise restricted by law.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.3.4a",
                "description": "Examine the visitor logs and interview responsible personnel to verify that visitor logs are used to record physical access to both the facility and sensitive areas.",
                "reportingInstructions": [
                  {
                    "id": "9.3.4a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all visitor logs examined for this testing procedure.",
                    "evidenceReference": "others-visitorLogs"
                  },
                  {
                    "id": "9.3.4a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "9.3.4b",
                "description": "Examine the visitor logs and verify that the logs contain: \n \u2022 The visitor's name and the organization represented \n \u2022 The personnel authorizing physical access \n \u2022 Date and time of visit.",
                "reportingInstructions": [
                  {
                    "id": "9.3.4b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all visitor logs examined for this testing procedure.",
                    "evidenceReference": "others-visitorLogs"
                  }
                ]
              },
              {
                "id": "9.3.4c",
                "description": "Examine visitor log storage locations and interview responsible personnel to verify that the log is retained for at least three months, unless otherwise restricted by law.",
                "reportingInstructions": [
                  {
                    "id": "9.3.4c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all visitor log storage locations examined for this testing procedure.",
                    "evidenceReference": "others-visitorLogStorageLocation"
                  },
                  {
                    "id": "9.3.4c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 9.4,
        "title": "Sub-req 9.4",
        "desc": "Media with cardholder data is securely stored, accessed, distributed, and destroyed.",
        "controls": [
          {
            "id": 1,
            "title": "9.4.1",
            "desc": "All media with cardholder data is physically secured.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.4.1",
                "description": "Examine documentation to verify that procedures defined for protecting cardholder data include controls for physically securing all media.",
                "reportingInstructions": [
                  {
                    "id": "9.4.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "9.4.1.1",
            "desc": "Offline media backups with cardholder data are stored in a secure location.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.4.1.1a",
                "description": "Examine documentation to verify that procedures are defined for physically securing offline media backups with cardholder data in a secure location.",
                "reportingInstructions": [
                  {
                    "id": "9.4.1.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "9.4.1.1b",
                "description": "Examine logs or other documentation and interview responsible personnel at the storage location to verify that offline media backups are stored in a secure location.",
                "reportingInstructions": [
                  {
                    "id": "9.4.1.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all logs or other documentation examined for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "9.4.1.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "9.4.1.2",
            "desc": "The security of the offline media backup location(s) with cardholder data is reviewed at least once every 12 months.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.4.1.2a",
                "description": "Examine documentation to verify that procedures are defined for reviewing the security of the offline media backup location(s) with cardholder data at least once every 12 months.",
                "reportingInstructions": [
                  {
                    "id": "9.4.1.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "9.4.1.2b",
                "description": "Examine documented procedures, logs, or other documentation, and interview responsible personnel at the storage location(s) to verify that the storage location's security is reviewed at least once every 12 months.",
                "reportingInstructions": [
                  {
                    "id": "9.4.1.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented procedures, logs, or other documentation examined for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "9.4.1.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "9.4.2",
            "desc": "All media with cardholder data is classified in accordance with the sensitivity of the data.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.4.2a",
                "description": "Examine documentation to verify that procedures are defined for classifying media with cardholder data in accordance with the sensitivity of the data.",
                "reportingInstructions": [
                  {
                    "id": "9.4.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "9.4.2b",
                "description": "Examine media logs or other documentation to verify that all media is classified in accordance with the sensitivity of the data.",
                "reportingInstructions": [
                  {
                    "id": "9.4.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all media logs or other documentation examined for this testing procedure.",
                    "evidenceReference": "others-mediaLogs"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "9.4.3",
            "desc": "Media with cardholder data sent outside the facility is secured as follows: Media sent outside the facility is logged, Media is sent by secured courier or other delivery method that can be accurately tracked, Offsite tracking logs include details about media location.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.4.3a",
                "description": "Examine documentation to verify that procedures are defined for securing media sent outside the facility in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "9.4.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "9.4.3b",
                "description": "Interview personnel and examine records to verify that all media sent outside the facility is logged and sent via secured courier or other delivery method that can be tracked.",
                "reportingInstructions": [
                  {
                    "id": "9.4.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "9.4.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all records examined for this testing procedure.",
                    "evidenceReference": "others-allRecordsExamined"
                  }
                ]
              },
              {
                "id": "9.4.3c",
                "description": "Examine offsite tracking logs for all media to verify tracking details are documented.",
                "reportingInstructions": [
                  {
                    "id": "9.4.3c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all offsite tracking logs examined for this testing procedure.",
                    "evidenceReference": "others-offsiteTrackingLogs"
                  }
                ]
              }
            ]
          },
          {
            "id": 6,
            "title": "9.4.4",
            "desc": "Management approves all media with cardholder data that is moved outside the facility (including when media is distributed to individuals).",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.4.4a",
                "description": "Examine documentation to verify that procedures are defined to ensure that media moved outside the facility is approved by management.",
                "reportingInstructions": [
                  {
                    "id": "9.4.4a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "9.4.4b",
                "description": "Examine offsite media tracking logs and interview responsible personnel to verify that proper management authorization is obtained for all media moved outside the facility (including media distributed to individuals).",
                "reportingInstructions": [
                  {
                    "id": "9.4.4b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all offsite media tracking logs examined for this testing procedure.",
                    "evidenceReference": "others-offsiteMediaTrackingLogs"
                  },
                  {
                    "id": "9.4.4b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 7,
            "title": "9.4.5",
            "desc": "Inventory logs of all electronic media with cardholder data are maintained.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.4.5a",
                "description": "Examine documentation to verify that procedures are defined to maintain electronic media inventory logs.",
                "reportingInstructions": [
                  {
                    "id": "9.4.5a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "9.4.5b",
                "description": "Examine electronic media inventory logs and interview responsible personnel to verify that logs are maintained.",
                "reportingInstructions": [
                  {
                    "id": "9.4.5b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all electronic media inventory logs examined for this testing procedure.",
                    "evidenceReference": "others-electronicMediaInventoryLogs"
                  },
                  {
                    "id": "9.4.5b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 8,
            "title": "9.4.5.1",
            "desc": "Inventories of electronic media with cardholder data are conducted at least once every 12 months.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.4.5.1a",
                "description": "Examine documentation to verify that procedures are defined to conduct inventories of electronic media with cardholder data at least once every 12 months.",
                "reportingInstructions": [
                  {
                    "id": "9.4.5.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "9.4.5.1b",
                "description": "Examine electronic media inventory logs and interview personnel to verify that electronic media inventories are performed at least once every 12 months.",
                "reportingInstructions": [
                  {
                    "id": "9.4.5.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all electronic media inventory logs examined for this testing procedure.",
                    "evidenceReference": "others-electronicMediaInventoryLogs"
                  },
                  {
                    "id": "9.4.5.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 9,
            "title": "9.4.6",
            "desc": "Hard-copy materials with cardholder data are destroyed when no longer needed for business or legal reasons, as follows: Materials are cross-cut shredded, incinerated, or pulped so that cardholder data cannot be reconstructed, Materials are stored in secure storage containers prior to destruction.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.4.6a",
                "description": "Examine the media destruction policy to verify that procedures are defined to destroy hard-copy media with cardholder data when no longer needed for business or legal reasons in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "9.4.6a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the periodic media destruction policy examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "9.4.6b",
                "description": "Observe processes and interview personnel to verify that hard-copy materials are cross-cut shredded, incinerated, or pulped such that cardholder data cannot be reconstructed.",
                "reportingInstructions": [
                  {
                    "id": "9.4.6b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of processes for this testing procedure.",
                    "evidenceReference": "others-ObservationOfProcesses"
                  },
                  {
                    "id": "9.4.6b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "9.4.6c",
                "description": "Observe storage containers used for materials that contain information to be destroyed to verify that the containers are secure.",
                "reportingInstructions": [
                  {
                    "id": "9.4.6c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of the storage containers used for materials that contain information to be destroyed for this testing procedure.",
                    "evidenceReference": "others-destructionOfContainerObservations "
                  }
                ]
              }
            ]
          },
          {
            "id": 10,
            "title": "9.4.7",
            "desc": "Electronic media with cardholder data is destroyed when no longer needed for business or legal reasons via one of the following: The electronic media is destroyed, The cardholder data is rendered unrecoverable so that it cannot be reconstructed.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.4.7a",
                "description": "Examine the media destruction policy to verify that procedures are defined to destroy electronic media when no longer needed for business or legal reasons in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "9.4.7a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the periodic media destruction policy examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "9.4.7b",
                "description": "Observe the media destruction process and interview responsible personnel to verify that electronic media with cardholder data is destroyed via one of the methods specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "9.4.7b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of the media destruction process for this testing procedure.",
                    "evidenceReference": "others-mediaDestructionProcessObservation"
                  },
                  {
                    "id": "9.4.7b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 9.5,
        "title": "Sub-req 9.5",
        "desc": "Point-of-interaction (POI) devices are protected from tampering and unauthorized substitution.",
        "controls": [
          {
            "id": 1,
            "title": "9.5.1",
            "desc": "POI devices that capture payment card data via direct physical interaction with the payment card form factor are protected from tampering and unauthorized substitution, including the following: Maintaining a list of POI devices, Periodically inspecting POI devices to look for tampering or unauthorized substitution, Training personnel to be aware of suspicious behavior and to report tampering or unauthorized substitution of devices.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.5.1",
                "description": "Examine documented policies and procedures to verify that processes are defined that include all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "9.5.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "9.5.1.1",
            "desc": "An up-to-date list of POI devices is maintained, including: Make and model of the device, Location of device, Device serial number or other methods of unique identification.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.5.1.1a",
                "description": "Examine the list of POI devices to verify it includes all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "9.5.1.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all lists of POI devices examined for this testing procedure.",
                    "evidenceReference": "others-POIdevicesExamined"
                  }
                ]
              },
              {
                "id": "9.5.1.1b",
                "description": "Observe POI devices and device locations and compare to devices in the list to verify that the list is accurate and up to date.",
                "reportingInstructions": [
                  {
                    "id": "9.5.1.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of the POI devices and device locations for this testing procedure.",
                    "evidenceReference": "others-POIdevicesObservations"
                  }
                ]
              },
              {
                "id": "9.5.1.1c",
                "description": "Interview personnel to verify the list of POI devices is updated when devices are added, relocated, decommissioned, etc.",
                "reportingInstructions": [
                  {
                    "id": "9.5.1.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "9.5.1.2",
            "desc": "POI device surfaces are periodically inspected to detect tampering and unauthorized substitution.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.5.1.2a",
                "description": "Examine documented procedures to verify processes are defined for periodic inspections of POI device surfaces to detect tampering and unauthorized substitution.",
                "reportingInstructions": [
                  {
                    "id": "9.5.1.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "9.5.1.2b",
                "description": "Interview responsible personnel and observe inspection processes to verify: \n \u2022  Personnel are aware of procedures for inspecting devices \n \u2022  All devices are periodically inspected for evidence of tampering and unauthorized substitution.",
                "reportingInstructions": [
                  {
                    "id": "9.5.1.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "9.5.1.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of the inspection processes for this testing procedure.",
                    "evidenceReference": "others-inspectionOfProcesses"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "9.5.1.2.1",
            "desc": "The frequency of periodic POI device inspections and the type of inspections performed is defined in the entity's targeted risk analysis, which is performed according to all elements specified in Requirement 12.3.1. Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.5.1.2.1a",
                "description": "Examine the entity's targeted risk analysis for the frequency of periodic POI device inspections and type of inspections performed to verify the risk analysis was performed in accordance with all elements specified in Requirement 12.3.1.",
                "reportingInstructions": [
                  {
                    "id": "9.5.1.2.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the entity's targeted risk analysis examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "9.5.1.2.1b",
                "description": "Examine documented results of periodic device inspections and interview personnel to verify that the frequency and type of POI device inspections performed match what is defined in the entity's targeted risk analysis conducted for this requirement.",
                "reportingInstructions": [
                  {
                    "id": "9.5.1.2.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for the documented results of periodic device inspections examined for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "9.5.1.2.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "9.5.1.3",
            "desc": "Training is provided for personnel in POI environments to be aware of attempted tampering or replacement of POI devices, and includes: Verifying the identity of any third-party persons claiming to be repair or maintenance personnel, before granting them access to modify or troubleshoot devices, Procedures to ensure devices are not installed, replaced, or returned without verification, Being aware of suspicious behavior around devices, Reporting suspicious behavior and indications of device tampering or substitution to appropriate personnel.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "9.5.1.3a",
                "description": "Review training materials for personnel in POI environments to verify they include all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "9.5.1.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all training materials examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "9.5.1.3b",
                "description": "Interview personnel in POI environments to verify they have received training and know the procedures for all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "9.5.1.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 10,
    "reqName": "Req 10",
    "reqDesc": "Log and Monitor All Access to System Components and Cardholder Data",
    "subReq": [
      {
        "id": 10.1,
        "title": "Sub-req 10.1",
        "desc": "Processes and mechanisms for logging and monitoring all access to system components and cardholder data are defined and understood.",
        "controls": [
          {
            "id": 1,
            "title": "10.1.1",
            "desc": "All security policies and operational procedures that are identified in Requirement 10 are: Documented, Kept up to date, In use, Known to all affected parties.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.1.1",
                "description": "Examine documentation and interview personnel to verify that security policies and operational procedures identified in Requirement 10 are managed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "10.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "10.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "10.1.2",
            "desc": "Roles and responsibilities for performing activities in Requirement 10 are documented, assigned, and understood.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.1.2a",
                "description": "Examine documentation to verify that descriptions of roles and responsibilities for performing activities in Requirement 10 are documented and assigned.",
                "reportingInstructions": [
                  {
                    "id": "10.1.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "10.1.2b",
                "description": "Interview personnel with responsibility for performing activities in Requirement 10 to verify that roles and responsibilities are assigned as defined and are understood.",
                "reportingInstructions": [
                  {
                    "id": "10.1.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10.2,
        "title": "Sub-req 10.2",
        "desc": "Audit logs are implemented to support the detection of anomalies and suspicious activity, and the forensic analysis of events.",
        "controls": [
          {
            "id": 1,
            "title": "10.2.1",
            "desc": "Audit logs are enabled and active for all system components and cardholder data.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.2.1",
                "description": "Interview the system administrator and examine system configurations to verify that audit logs are enabled and active for all system components.",
                "reportingInstructions": [
                  {
                    "id": "10.2.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "10.2.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "10.2.1.1",
            "desc": "Audit logs capture all individual user access to cardholder data.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.2.1.1",
                "description": "Examine audit log configurations and log data to verify that all individual user access to cardholder data is logged.",
                "reportingInstructions": [
                  {
                    "id": "10.2.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all audit log configurations examined for this testing procedure.",
                    "evidenceReference": "others-logData"
                  },
                  {
                    "id": "10.2.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all log data examined for this testing procedure.",
                    "evidenceReference": "others-logData"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "10.2.1.2",
            "desc": "Audit logs capture all actions taken by any individual with administrative access, including any interactive use of application or system accounts.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.2.1.2",
                "description": "Examine audit log configurations and log data to verify that all actions taken by any individual with administrative access, including any interactive use of application or system accounts, are logged.",
                "reportingInstructions": [
                  {
                    "id": "10.2.1.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all audit log configurations examined for this testing procedure.",
                    "evidenceReference": "others-logData"
                  },
                  {
                    "id": "10.2.1.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all log data examined for this testing procedure.",
                    "evidenceReference": "others-logData"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "10.2.1.3",
            "desc": "Audit logs capture all access to audit logs.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.2.1.3",
                "description": "Examine audit log configurations and log data to verify that access to all audit logs is captured.",
                "reportingInstructions": [
                  {
                    "id": "10.2.1.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all audit log configurations examined for this testing procedure.",
                    "evidenceReference": "others-logData"
                  },
                  {
                    "id": "10.2.1.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all log data examined for this testing procedure.",
                    "evidenceReference": "others-logData"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "10.2.1.4",
            "desc": "Audit logs capture all invalid logical access attempts.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.2.1.4",
                "description": "Examine audit log configurations and log data to verify that invalid logical access attempts are captured.",
                "reportingInstructions": [
                  {
                    "id": "10.2.1.4",
                    "description": "Identify the evidence reference number(s) from Section 6 for all audit log configurations examined for this testing procedure.",
                    "evidenceReference": "others-logData"
                  },
                  {
                    "id": "10.2.1.4",
                    "description": "Identify the evidence reference number(s) from Section 6 for all log data examined for this testing procedure.",
                    "evidenceReference": "others-logData"
                  }
                ]
              }
            ]
          },
          {
            "id": 6,
            "title": "10.2.1.5",
            "desc": "Audit logs capture all changes to identification and authentication credentials including, but not limited to: Creation of new accounts, Elevation of privileges, All changes, additions, or deletions to accounts with administrative access.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.2.1.5",
                "description": "Examine audit log configurations and log data to verify that changes to identification and authentication credentials are captured in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "10.2.1.5",
                    "description": "Identify the evidence reference number(s) from Section 6 for all audit log configurations examined for this testing procedure.",
                    "evidenceReference": "others-logData"
                  },
                  {
                    "id": "10.2.1.5",
                    "description": "Identify the evidence reference number(s) from Section 6 for all log data examined for this testing procedure.",
                    "evidenceReference": "others-logData"
                  }
                ]
              }
            ]
          },
          {
            "id": 7,
            "title": "10.2.1.6",
            "desc": "Audit logs capture all initialization of new audit logs, and all starting, stopping, or pausing of the existing audit logs.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.2.1.6",
                "description": "Examine audit log configurations and log data to verify that all elements specified in this requirement are captured.",
                "reportingInstructions": [
                  {
                    "id": "10.2.1.6",
                    "description": "Identify the evidence reference number(s) from Section 6 for all audit log configurations examined for this testing procedure.",
                    "evidenceReference": "others-logData"
                  },
                  {
                    "id": "10.2.1.6",
                    "description": "Identify the evidence reference number(s) from Section 6 for all log data examined for this testing procedure.",
                    "evidenceReference": "others-logData"
                  }
                ]
              }
            ]
          },
          {
            "id": 8,
            "title": "10.2.1.7",
            "desc": "Audit logs capture all creation and deletion of system-level objects.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.2.1.7",
                "description": "Examine audit log configurations and log data to verify that creation and deletion of system-level objects is captured.",
                "reportingInstructions": [
                  {
                    "id": "10.2.1.7",
                    "description": "Identify the evidence reference number(s) from Section 6 for all audit log configurations examined for this testing procedure.",
                    "evidenceReference": "others-logData"
                  },
                  {
                    "id": "10.2.1.7",
                    "description": "Identify the evidence reference number(s) from Section 6 for all log data examined for this testing procedure.",
                    "evidenceReference": "others-logData"
                  }
                ]
              }
            ]
          },
          {
            "id": 9,
            "title": "10.2.2",
            "desc": "Audit logs record the following details for each auditable event: User identification, Type of event, Date and time, Success and failure indication, Origination of event, Identity or name of affected data, system component, resource, or service (for example, name and protocol).",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.2.2",
                "description": "Interview personnel and examine audit log configurations and log data to verify that all elements specified in this requirement are included in log entries for each auditable event (from 10.2.1.1 through 10.2.1.7).",
                "reportingInstructions": [
                  {
                    "id": "10.2.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "10.2.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all audit log configurations examined for this testing procedure.",
                    "evidenceReference": "others-logData"
                  },
                  {
                    "id": "10.2.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all log data examined for this testing procedure.",
                    "evidenceReference": "others-logData"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10.3,
        "title": "Sub-req 10.3",
        "desc": "Audit logs are protected from destruction and unauthorized modifications.",
        "controls": [
          {
            "id": 1,
            "title": "10.3.1",
            "desc": "Read access to audit log files is limited to those with a job-related need.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.3.1",
                "description": "Interview system administrators and examine system configurations and privileges to verify that only individuals with a job-related need have read access to audit log files.",
                "reportingInstructions": [
                  {
                    "id": "10.3.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "10.3.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations and privileges examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigs&Privileges"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "10.3.2",
            "desc": "Audit log files are protected to prevent modifications by individuals.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.3.2",
                "description": "Examine system configurations and privileges and interview system administrators to verify that current audit log files are protected from modifications by individuals via access control mechanisms, physical segregation, and/or network segregation.",
                "reportingInstructions": [
                  {
                    "id": "10.3.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations and privileges examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigs&Privileges"
                  },
                  {
                    "id": "10.3.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "10.3.3",
            "desc": "Audit log files, including those for external-facing technologies, are promptly backed up to a secure, central, internal log server(s) or other media that is difficult to modify.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.3.3",
                "description": "Examine backup configurations or log files to verify that current audit log files, including those for external-facing technologies, are promptly backed up to a secure, central, internal log server(s) or other media that is difficult to modify.",
                "reportingInstructions": [
                  {
                    "id": "10.3.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all backup configurations or log files examined for this testing procedure.",
                    "evidenceReference": "others-backupConfigsLogFiles"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "10.3.4",
            "desc": "File integrity monitoring or change-detection mechanisms is used on audit logs to ensure that existing log data cannot be changed without generating alerts.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.3.4",
                "description": "Examine system settings, monitored files, and results from monitoring activities to verify the use of file integrity monitoring or change-detection software on audit logs.",
                "reportingInstructions": [
                  {
                    "id": "10.3.4",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system settings examined for this testing procedure.",
                    "evidenceReference": "others-systemSettings"
                  },
                  {
                    "id": "10.3.4",
                    "description": "Identify the evidence reference number(s) from Section 6 for all monitored files examined for this testing procedure.",
                    "evidenceReference": "others-systemSettings"
                  },
                  {
                    "id": "10.3.4",
                    "description": "Identify the evidence reference number(s) from Section 6 for all results from monitoring activities examined for this testing procedure.",
                    "evidenceReference": "others-systemSettings"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10.4,
        "title": "Sub-req 10.4",
        "desc": "Audit logs are reviewed to identify anomalies or suspicious activity.",
        "controls": [
          {
            "id": 1,
            "title": "10.4.1",
            "desc": "The following audit logs are reviewed at least once daily: All security events, Logs of all system components that store, process, or transmit CHD and/or SAD, Logs of all critical system components, Logs of all servers and system components that perform security functions (for example, network security controls, intrusion-detection systems/intrusion-prevention systems (IDS/IPS), authentication servers).",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.4.1a",
                "description": "Examine security policies and procedures to verify that processes are defined for reviewing all elements specified in this requirement at least once daily.",
                "reportingInstructions": [
                  {
                    "id": "10.4.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all security policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "10.4.1b",
                "description": "Observe processes and interview personnel to verify that all elements specified in this requirement are reviewed at least once daily.",
                "reportingInstructions": [
                  {
                    "id": "10.4.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of processes for this testing procedure.",
                    "evidenceReference": "others-observationOfProcesses"
                  },
                  {
                    "id": "10.4.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "10.4.1.1",
            "desc": "Automated mechanisms are used to perform audit log reviews. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.4.1.1",
                "description": "Examine log review mechanisms and interview personnel to verify that automated mechanisms are used to perform log reviews.",
                "reportingInstructions": [
                  {
                    "id": "10.4.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all log review mechanisms examined for this testing procedure.",
                    "evidenceReference": "others-logReviewMechanism"
                  },
                  {
                    "id": "10.4.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "10.4.2",
            "desc": "Logs of all other system components (those not specified in Requirement 10.4.1) are reviewed periodically.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.4.2a",
                "description": "Examine security policies and procedures to verify that processes are defined for reviewing logs of all other system components periodically.",
                "reportingInstructions": [
                  {
                    "id": "10.4.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all security policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "10.4.2b",
                "description": "Examine documented results of log reviews and interview personnel to verify that log reviews are performed periodically.",
                "reportingInstructions": [
                  {
                    "id": "10.4.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented results of log reviews examined for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "10.4.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "10.4.2.1",
            "desc": "The frequency of periodic log reviews for all other system components (not defined in Requirement 10.4.1) is defined in the entity's targeted risk analysis, which is performed according to all elements specified in Requirement 12.3.1. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.4.2.1a",
                "description": "Examine the entity's targeted risk analysis for the frequency of periodic log reviews for all other system components (not defined in Requirement 10.4.1) to verify the risk analysis was performed in accordance with all elements specified in Requirement 12.3.1.",
                "reportingInstructions": [
                  {
                    "id": "10.4.2.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the entity's targeted risk analysis examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "10.4.2.1b",
                "description": "Examine documented results of periodic log reviews of all other system components (not defined in Requirement 10.4.1) and interview personnel to verify log reviews are performed at the frequency specified in the entity's targeted risk analysis performed for this requirement.",
                "reportingInstructions": [
                  {
                    "id": "10.4.2.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for the documented results of all other system components (not defined in Requirement 10.4.1) examined for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "10.4.2.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "10.4.3",
            "desc": "Exceptions and anomalies identified during the review process are addressed.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.4.3a",
                "description": "Examine security policies and procedures to verify that processes are defined for addressing exceptions and anomalies identified during the review process.",
                "reportingInstructions": [
                  {
                    "id": "10.4.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all security policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "10.4.3b",
                "description": "Observe processes and interview personnel to verify that, when exceptions and anomalies are identified, they are addressed.",
                "reportingInstructions": [
                  {
                    "id": "10.4.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of processes for this testing procedure.",
                    "evidenceReference": "others-observationOfProcesses"
                  },
                  {
                    "id": "10.4.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10.5,
        "title": "Sub-req 10.5",
        "desc": "Audit log history is retained and available for analysis.",
        "controls": [
          {
            "id": 1,
            "title": "10.5.1",
            "desc": "Retain audit log history for at least 12 months, with at least the most recent three months immediately available for analysis.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.5.1a",
                "description": "Examine documentation to verify that the following is defined: Audit log retention policies, Procedures for retaining audit log history for at least 12 months, with at least the most recent three months immediately available online.",
                "reportingInstructions": [
                  {
                    "id": "10.5.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "10.5.1b",
                "description": "Examine configurations of audit log history, interview personnel and examine audit logs to verify that audit logs history is retained for at least 12 months.",
                "reportingInstructions": [
                  {
                    "id": "10.5.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configurations examined for this testing procedure.",
                    "evidenceReference": "others-config"
                  },
                  {
                    "id": "10.5.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "10.5.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all audit logs examined for this testing procedure.",
                    "evidenceReference": "others-config"
                  }
                ]
              },
              {
                "id": "10.5.1c",
                "description": "Interview personnel and observe processes to verify that at least the most recent three months' audit log history is immediately available for analysis.",
                "reportingInstructions": [
                  {
                    "id": "10.5.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "10.5.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for the observations of processes for this testing procedure.",
                    "evidenceReference": "others-observationOfProcesses"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10.6,
        "title": "Sub-req 10.6",
        "desc": "Time-synchronization mechanisms support consistent time settings across all systems.",
        "controls": [
          {
            "id": 1,
            "title": "10.6.1",
            "desc": "System clocks and time are synchronized using time-synchronization technology.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.6.1",
                "description": "Examine system configuration settings to verify that time-synchronization technology is implemented and kept current.",
                "reportingInstructions": [
                  {
                    "id": "10.6.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigSettings"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "10.6.2",
            "desc": "Systems are configured to the correct and consistent time as follows: One or more designated time servers are in use, Only the designated central time server(s) receives time from external sources, Time received from external sources is based on International Atomic Time or Coordinated Universal Time (UTC), The designated time server(s) accept time updates only from specific industry-accepted external sources, Where there is more than one designated time server, the time servers peer with one another to keep accurate time, Internal systems receive time information only from designated central time server(s).",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.6.2",
                "description": "Examine system configuration settings for acquiring, distributing, and storing the correct time to verify the settings are configured in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "10.6.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigSettings"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "10.6.3",
            "desc": "Time synchronization settings and data are protected as follows: Access to time data is restricted to only personnel with a business need, Any changes to time settings on critical systems are logged, monitored, and reviewed.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.6.3a",
                "description": "Examine system configurations and time-synchronization settings to verify that access to time data is restricted to only personnel with a business need.",
                "reportingInstructions": [
                  {
                    "id": "10.6.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations and time-synchronization settings examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig&TimeSyncSetting"
                  }
                ]
              },
              {
                "id": "10.6.3b",
                "description": "Examine system configurations and time synchronization settings and logs and observe processes to verify that any changes to time settings on critical systems are logged, monitored, and reviewed.",
                "reportingInstructions": [
                  {
                    "id": "10.6.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations and time synchronization settings examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigSyncSetting"
                  },
                  {
                    "id": "10.6.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all logs examined for this testing procedure.",
                    "evidenceReference": "others-systemConfigSyncSetting"
                  },
                  {
                    "id": "10.6.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for the observations of processes for this testing procedure.",
                    "evidenceReference": "others-systemConfigSyncSetting"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 10.7,
        "title": "Sub-req 10.7",
        "desc": "Failures of critical security control systems are detected, reported, and responded to promptly.",
        "controls": [
          {
            "id": 1,
            "title": "10.7.1",
            "desc": "Additional requirement for service providers only: Failures of critical security control systems are detected, alerted, and addressed promptly, including but not limited to failure of the following critical security control systems: Network security controls, IDS/IPS, FIM, Anti-malware solutions, Physical access controls, Logical access controls, Audit logging mechanisms, Segmentation controls (if used). (Note: This requirement will be superseded by Requirement 10.7.2 as of 31 March 2025.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.7.1a",
                "description": "Additional testing procedure for service provider assessments only: Examine documentation to verify that processes are defined for the prompt detection and addressing of failures of critical security control systems, including but not limited to failure of all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "10.7.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "10.7.1b",
                "description": "Additional testing procedure for service provider assessments only: Observe detection and alerting processes and interview personnel to verify that failures of critical security control systems are detected and reported, and that failure of a critical security control results in the generation of an alert.",
                "reportingInstructions": [
                  {
                    "id": "10.7.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of detection and alerting processes conducted for this testing procedure.",
                    "evidenceReference": "others-detection&alertingProcessObservation"
                  },
                  {
                    "id": "10.7.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "10.7.2",
            "desc": "Failures of critical security control systems are detected, alerted, and addressed promptly, including but not limited to failure of the following critical security control systems: Network security controls, IDS/IPS, Change-detection mechanisms, Anti-malware solutions, Physical access controls, Logical access controls, Audit logging mechanisms, Segmentation controls (if used), Audit log review mechanisms, Automated security testing tools (if used). (Note: This requirement applies to all entities, including service providers, and will supersede Requirements 10.7.1 as of 31 March 2025. It includes two additional critical security control systems not in Requirement 10.7.1. This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment and will supersede Requirement 10.7.1.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.7.2a",
                "description": "Examine documentation to verify that processes are defined for the prompt detection and addressing of failures of critical security control systems, including but not limited to failure of all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "10.7.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "10.7.2b",
                "description": "Observe detection and alerting processes and interview personnel to verify that failures of critical security control systems are detected and reported, and that failure of a critical security control results in the generation of an alert.",
                "reportingInstructions": [
                  {
                    "id": "10.7.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of detection and alerting processes conducted for this testing procedure.",
                    "evidenceReference": "others-detection&alertingProcessObservation"
                  },
                  {
                    "id": "10.7.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "10.7.3",
            "desc": "Failures of any critical security control systems are responded to promptly, including but not limited to: Restoring security functions, Identifying and documenting the duration (date and time from start to end) of the security failure, Identifying and documenting the cause(s) of failure and documenting required remediation, Identifying and addressing any security issues that arose during the failure, Determining whether further actions are required as a result of the security failure, Implementing controls to prevent the cause of failure from reoccurring, Resuming monitoring of security controls. (Note: This is a current v3.2.1 requirement that applies to service providers only. However, this requirement is a best practice for all other entities until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "10.7.3a",
                "description": "Examine documentation and interview personnel to verify that processes are defined and implemented to respond to a failure of any critical security control system and include at least all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "10.7.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "10.7.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "10.7.3b",
                "description": "Examine records to verify that failures of critical security control systems are documented to include: Identification of cause(s) of the failure, Duration (date and time start and end) of the security failure, Details of the remediation required to address the root cause.",
                "reportingInstructions": [
                  {
                    "id": "10.7.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all records examined for this testing procedure.",
                    "evidenceReference": "others-allRecordsExamined"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 11,
    "reqName": "Req 11",
    "reqDesc": "Test Security of Systems and Networks Regularly",
    "subReq": [
      {
        "id": 11.1,
        "title": "Sub-req 11.1",
        "desc": "Processes and mechanisms for regularly testing security of systems and networks are defined and understood.",
        "controls": [
          {
            "id": 1,
            "title": "11.1.1",
            "desc": "All security policies and operational procedures that are identified in Requirement 11 are: Documented, Kept up to date, In use, Known to all affected parties.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "11.1.1",
                "description": "Examine documentation and interview personnel to verify that security policies and operational procedures are managed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "11.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "11.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "11.1.2",
            "desc": "Roles and responsibilities for performing activities in Requirement 11 are documented, assigned, and understood.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "11.1.2a",
                "description": "Examine documentation to verify that descriptions of roles and responsibilities for performing activities in Requirement 11 are documented and assigned.",
                "reportingInstructions": [
                  {
                    "id": "11.1.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "11.1.2b",
                "description": "Interview personnel with responsibility for performing activities in Requirement 11 to verify that roles and responsibilities are assigned as documented and are understood.",
                "reportingInstructions": [
                  {
                    "id": "11.1.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 11.2,
        "title": "Sub-req 11.2",
        "desc": "Wireless access points are identified and monitored, and unauthorized wireless access points are addressed.",
        "controls": [
          {
            "id": 1,
            "title": "11.2.1",
            "desc": "Authorized and unauthorized wireless access points are managed as follows: The presence of wireless (Wi-Fi) access points is tested for, All authorized and unauthorized wireless access points are detected and identified, Testing, detection, and identification occurs at least once every three months, If automated monitoring is used, personnel are notified via generated alerts.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "11.2.1a",
                "description": "Examine policies and procedures to verify processes are defined for managing both authorized and unauthorized wireless access points with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "11.2.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "11.2.1b",
                "description": "Examine the methodology(ies) in use and the resulting documentation, and interview personnel to verify processes are defined to detect and identify both authorized and unauthorized wireless access points in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "11.2.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for the methodology(ies) in use and resulting documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "11.2.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "11.2.1c",
                "description": "Examine wireless assessment results and interview personnel to verify that wireless assessments were conducted in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "11.2.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all wireless assessment results examined for this testing procedure.",
                    "evidenceReference": "others-wirelessAssessmentResults"
                  },
                  {
                    "id": "11.2.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "11.2.1d",
                "description": "If automated monitoring is used, examine configuration settings to verify the configuration will generate alerts to notify personnel.",
                "reportingInstructions": [
                  {
                    "id": "11.2.1d",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-configSetting"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "11.2.2",
            "desc": "An inventory of authorized wireless access points is maintained, including a documented business justification.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "11.2.2",
                "description": "Examine documentation to verify that an inventory of authorized wireless access points is maintained, and a business justification is documented for all authorized wireless access points.",
                "reportingInstructions": [
                  {
                    "id": "11.2.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 11.3,
        "title": "Sub-req 11.3",
        "desc": "External and internal vulnerabilities are regularly identified, prioritized, and addressed.",
        "controls": [
          {
            "id": 1,
            "title": "11.3.1",
            "desc": "Internal vulnerability scans are performed as follows: At least once every three months, Vulnerabilities that are either high-risk or critical (according to the entity's vulnerability risk rankings defined at Requirement 6.3.1) are resolved, Rescans are performed that confirm all high-risk and critical vulnerabilities (as noted above) have been resolved, Scan tool is kept up to date with latest vulnerability information, Scans are performed by qualified personnel and organizational independence of the tester exists.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "11.3.1a",
                "description": "Examine internal scan report results from the last 12 months to verify that internal scans occurred at least once every three months in the most recent 12-month period.",
                "reportingInstructions": [
                  {
                    "id": "11.3.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all internal scan report results examined for this testing procedure.",
                    "evidenceReference": "others-internalScanReportResults"
                  }
                ]
              },
              {
                "id": "11.3.1b",
                "description": "Examine internal scan report results from each scan and rescan run in the last 12 months to verify that all high-risk vulnerabilities and all critical vulnerabilities (defined in PCI DSS Requirement 6.3.1) are resolved.",
                "reportingInstructions": [
                  {
                    "id": "11.3.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all internal scan report results examined for this testing procedure.",
                    "evidenceReference": "others-internalScanReportResults"
                  }
                ]
              },
              {
                "id": "11.3.1c",
                "description": "Examine scan tool configurations and interview personnel to verify that the scan tool is kept up to date with the latest vulnerability information.",
                "reportingInstructions": [
                  {
                    "id": "11.3.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all scan tool configurations examined for this testing procedure.",
                    "evidenceReference": "others-scanToolConfig"
                  },
                  {
                    "id": "11.3.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "11.3.1d",
                "description": "Interview responsible personnel to verify that the scan was performed by a qualified internal resource(s) or qualified external third party and that organizational independence of the tester exists.",
                "reportingInstructions": [
                  {
                    "id": "11.3.1d",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "11.3.1.1",
            "desc": "All other applicable vulnerabilities (those not ranked as high-risk vulnerabilities or critical vulnerabilities according to the entity's vulnerability risk rankings defined at Requirement 6.3.1) are managed as follows: Addressed based on the risk defined in the entity's targeted risk analysis, which is performed according to all elements specified in Requirement 12.3.1, Rescans are conducted as needed. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "11.3.1.1a",
                "description": "Examine the entity's targeted risk analysis that defines the risk for addressing all other applicable vulnerabilities (those not ranked as high-risk vulnerabilities or critical vulnerabilities according to the entity's vulnerability risk rankings at Requirement 6.3.1) to verify the risk analysis was performed in accordance with all elements specified at Requirement 12.3.1.",
                "reportingInstructions": [
                  {
                    "id": "11.3.1.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the entity's targeted risk analysis examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "11.3.1.1b",
                "description": "Interview responsible personnel and examine internal scan report results or other documentation to verify that all other applicable vulnerabilities (those not ranked as high-risk vulnerabilities or critical vulnerabilities according to the entity's vulnerability risk rankings at Requirement 6.3.1) are addressed based on the risk defined in the entity's targeted risk analysis, and that the scan process includes rescans as needed to confirm the vulnerabilities have been addressed.",
                "reportingInstructions": [
                  {
                    "id": "11.3.1.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "11.3.1.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all internal scan report results or other documentation examined for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "11.3.1.2",
            "desc": "Internal vulnerability scans are performed via authenticated scanning as follows: Systems that are unable to accept credentials for authenticated scanning are documented, Sufficient privileges are used for those systems that accept credentials for scanning, If accounts used for authenticated scanning can be used for interactive login, they are managed in accordance with Requirement 8.2.2. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "11.3.1.2a",
                "description": "Examine scan tool configurations to verify that authenticated scanning is used for internal scans, with sufficient privileges, for those systems that accept credentials for scanning.",
                "reportingInstructions": [
                  {
                    "id": "11.3.1.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all scan tool configurations examined for this testing procedure.",
                    "evidenceReference": "others-scanConfig"
                  }
                ]
              },
              {
                "id": "11.3.1.2b",
                "description": "Examine scan report results and interview personnel to verify that authenticated scans are performed.",
                "reportingInstructions": [
                  {
                    "id": "11.3.1.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all scan report results examined for this testing procedure.",
                    "evidenceReference": "others-examineScanReportResults"
                  },
                  {
                    "id": "11.3.1.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "11.3.1.2c",
                "description": "If accounts used for authenticated scanning can be used for interactive login, examine the accounts and interview personnel to verify the accounts are managed following all elements specified in Requirement 8.2.2.",
                "reportingInstructions": [
                  {
                    "id": "11.3.1.2c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all accounts examined for this testing procedure.",
                    "evidenceReference": "others-account"
                  },
                  {
                    "id": "11.3.1.2c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "11.3.1.2d",
                "description": "Examine documentation to verify that systems that are unable to accept credentials for authenticated scanning are defined.",
                "reportingInstructions": [
                  {
                    "id": "11.3.1.2d",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "11.3.1.3",
            "desc": "Internal vulnerability scans are performed after any significant change as follows: Vulnerabilities that are either high-risk or critical (according to the entity's vulnerability risk rankings defined at Requirement 6.3.1) are resolved, Rescans are conducted as needed, Scans are performed by qualified personnel and organizational independence of the tester exists (not required to be a QSA or ASV).",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "11.3.1.3a",
                "description": "Examine change control documentation and internal scan reports to verify that system components were scanned after any significant changes.",
                "reportingInstructions": [
                  {
                    "id": "11.3.1.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all change control documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "11.3.1.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all internal scan reports examined for this testing procedure.",
                    "evidenceReference": "others-internalScanReports"
                  }
                ]
              },
              {
                "id": "11.3.1.3b",
                "description": "Interview personnel and examine internal scan and rescan reports to verify that internal scans were performed after significant changes and that all high-risk vulnerabilities and all critical vulnerabilities (defined in Requirement 6.3.1) were resolved.",
                "reportingInstructions": [
                  {
                    "id": "11.3.1.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "11.3.1.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all internal scan and rescan reports examined for this testing procedure.",
                    "evidenceReference": "others-internalScan&RescanReports"
                  }
                ]
              },
              {
                "id": "11.3.1.3c",
                "description": "Interview personnel to verify that internal scans are performed by a qualified internal resource(s) or qualified external third party and that organizational independence of the tester exists.",
                "reportingInstructions": [
                  {
                    "id": "11.3.1.3c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "11.3.2",
            "desc": "External vulnerability scans are performed as follows: At least once every three months, By PCI SSC Approved Scanning Vendor (ASV), Vulnerabilities are resolved and ASV Program Guide requirements for a passing scan are met, Rescans are performed as needed to confirm that vulnerabilities are resolved per the ASV Program Guide requirements for a passing scan.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach Appendix C to support this method.",
            "testingProcedures": [
              {
                "id": "11.3.2a",
                "description": "Examine ASV scan reports from the last 12 months to verify that external vulnerability scans occurred at least once every three months in the most recent 12-month period.",
                "reportingInstructions": [
                  {
                    "id": "11.3.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all ASV scan reports examined for this testing procedure.",
                    "evidenceReference": "others-asvScanReports"
                  }
                ]
              },
              {
                "id": "11.3.2b",
                "description": "Examine the ASV scan report from each scan and rescan run in the last 12 months to verify that vulnerabilities are resolved and the ASV Program Guide requirements for a passing scan are met.",
                "reportingInstructions": [
                  {
                    "id": "11.3.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all ASV scan report results examined for this testing procedure.",
                    "evidenceReference": "others-asvScanReportResults"
                  }
                ]
              },
              {
                "id": "11.3.2c",
                "description": "Examine the ASV scan reports to verify that the scans were completed by a PCI SSC Approved Scanning Vendor (ASV).",
                "reportingInstructions": [
                  {
                    "id": "11.3.2c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all ASV scan reports examined for this testing procedure.",
                    "evidenceReference": "others-asvScanReports"
                  }
                ]
              }
            ]
          },
          {
            "id": 6,
            "title": "11.3.2.1",
            "desc": "External vulnerability scans are performed after any significant change as follows: Vulnerabilities that are scored 4.0 or higher by the CVSS are resolved, Rescans are conducted as needed, Scans are performed by qualified personnel and organizational independence of the tester exists (not required to be a QSA or ASV).",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "11.3.2.1a",
                "description": "Examine change control documentation and external scan reports to verify that system components were scanned after any significant changes.",
                "reportingInstructions": [
                  {
                    "id": "11.3.2.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all change control documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "11.3.2.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all external scan reports examined for this testing procedure.",
                    "evidenceReference": "others-externalScanReports"
                  }
                ]
              },
              {
                "id": "11.3.2.1b",
                "description": "Interview personnel and examine external scan and rescan reports to verify that external scans were performed after significant changes and that vulnerabilities scored 4.0 or higher by the CVSS were resolved.",
                "reportingInstructions": [
                  {
                    "id": "11.3.2.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "11.3.2.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all external scan and rescan reports examined for this testing procedure.",
                    "evidenceReference": "others-externalScan&RescanReports"
                  }
                ]
              },
              {
                "id": "11.3.2.1c",
                "description": "Interview personnel to verify that external scans are performed by a qualified internal resource(s) or qualified external third party and that organizational independence of the tester exists.",
                "reportingInstructions": [
                  {
                    "id": "11.3.2.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 11.4,
        "title": "Sub-req 11.4",
        "desc": "External and internal penetration testing is regularly performed, and exploitable vulnerabilities and security weaknesses are corrected.",
        "controls": [
          {
            "id": 1,
            "title": "11.4.1",
            "desc": "A penetration testing methodology is defined, documented, and implemented by the entity and includes: Industry-accepted penetration testing approaches, Coverage for the entire CDE perimeter and critical systems, Testing from both inside and outside the network, Testing to validate any segmentation and scope-reduction controls, Application-layer penetration testing to identify, at a minimum, the vulnerabilities listed in Requirement 6.2.4, Network-layer penetration tests that encompass all components that support network functions as well as operating systems, Review and consideration of threats and vulnerabilities experienced in the last 12 months, Documented approach to assessing and addressing the risk posed by exploitable vulnerabilities and security weaknesses found during penetration testing, Retention of penetration testing results and remediation activities results for at least 12 months.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "11.4.1",
                "description": "Examine documentation and interview personnel to verify that the penetration-testing methodology defined, documented, and implemented by the entity includes all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "11.4.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "11.4.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "11.4.2",
            "desc": "Internal penetration testing is performed: Per the entity's defined methodology, At least once every 12 months, After any significant infrastructure or application upgrade or change, By a qualified internal resource or qualified external third-party, Organizational independence of the tester exists (not required to be a QSA or ASV).",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "11.4.2a",
                "description": "Examine the scope of work and results from the most recent internal penetration test to verify that penetration testing is performed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "11.4.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the scope of work examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "11.4.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the results from the most recent internal penetration test examined for this testing procedure.",
                    "evidenceReference": "others-scopeOfWork"
                  }
                ]
              },
              {
                "id": "11.4.2b",
                "description": "Interview personnel to verify that the internal penetration test was performed by a qualified internal resource or qualified external third-party and that organizational independence of the tester exists (not required to be a QSA or ASV).",
                "reportingInstructions": [
                  {
                    "id": "11.4.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "11.4.3",
            "desc": "External penetration testing is performed: Per the entity's defined methodology, At least once every 12 months, After any significant infrastructure or application upgrade or change, By a qualified internal resource or qualified external third party, Organizational independence of the tester exists (not required to be a QSA or ASV).",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "11.4.3a",
                "description": "Examine the scope of work and results from the most recent external penetration test to verify that penetration testing is performed according to all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "11.4.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the scope of work examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "11.4.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the results from the most recent external penetration test examined for this testing procedure.",
                    "evidenceReference": "others-scopeOfWork"
                  }
                ]
              },
              {
                "id": "11.4.3b",
                "description": "Interview personnel to verify that the external penetration test was performed by a qualified internal resource or qualified external third-party and that organizational independence of the tester exists (not required to be a QSA or ASV).",
                "reportingInstructions": [
                  {
                    "id": "11.4.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "11.4.4",
            "desc": "Exploitable vulnerabilities and security weaknesses found during penetration testing are corrected as follows: In accordance with the entity's assessment of the risk posed by the security issue as defined in Requirement 6.3.1, Penetration testing is repeated to verify the corrections.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "11.4.4",
                "description": "Examine penetration testing results to verify that noted exploitable vulnerabilities and security weaknesses were corrected in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "11.4.4",
                    "description": "Identify the evidence reference number(s) from Section 6 for all penetration testing results examined for this testing procedure.",
                    "evidenceReference": "others-allPenetrationTestingResults"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "11.4.5",
            "desc": "If segmentation is used to isolate the CDE from other networks, penetration tests are performed on segmentation controls as follows: At least once every 12 months and after any changes to segmentation controls/methods, Covering all segmentation controls/methods in use, According to the entity's defined penetration testing methodology, Confirming that the segmentation controls/methods are operational and effective, and isolate the CDE from all out-of-scope systems, Confirming effectiveness of any use of isolation to separate systems with differing security levels (see Requirement 2.2.3), Performed by a qualified internal resource or qualified external third party, Organizational independence of the tester exists (not required to be a QSA or ASV).",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "11.4.5a",
                "description": "Examine segmentation controls and review penetration-testing methodology to verify that penetration-testing procedures are defined to test all segmentation methods in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "11.4.5a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all segmentation controls examined for this testing procedure.",
                    "evidenceReference": "others-segmentControls"
                  },
                  {
                    "id": "11.4.5a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the penetration testing methodology examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "11.4.5b",
                "description": "Examine the results from the most recent penetration test to verify the penetration test covers and addresses all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "11.4.5b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all results from the most recent penetration test examined for this testing procedure.",
                    "evidenceReference": "others-recentPenetrationTestResults"
                  }
                ]
              },
              {
                "id": "11.4.5c",
                "description": "Interview personnel to verify that the test was performed by a qualified internal resource or qualified external third party and that organizational independence of the tester exists (not required to be a QSA or ASV).",
                "reportingInstructions": [
                  {
                    "id": "11.4.5c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 6,
            "title": "11.4.6",
            "desc": "Additional requirement for service providers only: If segmentation is used to isolate the CDE from other networks, penetration tests are performed on segmentation controls as follows: At least once every six months and after any changes to segmentation controls/methods, Covering all segmentation controls/methods in use, According to the entity's defined penetration testing methodology, Confirming that the segmentation controls/methods are operational and effective, and isolate the CDE from all out-of-scope systems, Confirming effectiveness of any use of isolation to separate systems with differing security levels (see Requirement 2.2.3), Performed by a qualified internal resource or qualified external third party, Organizational independence of the tester exists (not required to be a QSA or ASV).",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "11.4.6a",
                "description": "Additional testing procedure for service provider assessments only: Examine the results from the most recent penetration test to verify that the penetration covers and addresses all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "11.4.6a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the results from the most recent penetration test examined for this testing procedure.",
                    "evidenceReference": "others-recentPenetrationTestResults"
                  }
                ]
              },
              {
                "id": "11.4.6b",
                "description": "Additional testing procedure for service provider assessments only: Interview personnel to verify that the test was performed by a qualified internal resource or qualified external third party and that organizational independence of the tester exists (not required to be a QSA or ASV).",
                "reportingInstructions": [
                  {
                    "id": "11.4.6b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 7,
            "title": "11.4.7",
            "desc": "Additional requirement for multi-tenant service providers only: Multi-tenant service providers support their customers for external penetration testing per Requirement 11.4.3 and 11.4.4. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "11.4.7",
                "description": "Additional testing procedure for multi-tenant providers only: Examine evidence to verify that multi-tenant service providers support their customers for external penetration testing per Requirement 11.4.3 and 11.4.4.",
                "reportingInstructions": [
                  {
                    "id": "11.4.7",
                    "description": "Identify the evidence reference number(s) from Section 6 for all evidence examined for this testing procedure.",
                    "evidenceReference": "others-allEvidence"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 11.5,
        "title": "Sub-req 11.5",
        "desc": "Network intrusions and unexpected file changes are detected and responded to.",
        "controls": [
          {
            "id": 1,
            "title": "11.5.1",
            "desc": "Intrusion-detection and/or intrusion-prevention techniques are used to detect and/or prevent intrusions into the network as follows: All traffic is monitored at the perimeter of the CDE, All traffic is monitored at critical points in the CDE, Personnel are alerted to suspected compromises, All intrusion-detection and prevention engines, baselines, and signatures are kept up to date.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "11.5.1a",
                "description": "Examine system configurations and network diagrams to verify that intrusion-detection and/or intrusion-prevention techniques are in place to monitor all traffic: At the perimeter of the CDE, At critical points in the CDE.",
                "reportingInstructions": [
                  {
                    "id": "11.5.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  },
                  {
                    "id": "11.5.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all network diagrams examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "11.5.1b",
                "description": "Examine system configurations and interview responsible personnel to verify intrusion-detection and/or intrusion-prevention techniques alert personnel of suspected compromises.",
                "reportingInstructions": [
                  {
                    "id": "11.5.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                    "evidenceReference": "others-systemConfig"
                  },
                  {
                    "id": "11.5.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "11.5.1c",
                "description": "Examine system configurations and vendor documentation to verify intrusion-detection and/or intrusion-prevention techniques are configured to keep all engines, baselines, and signatures up to date.",
                "reportingInstructions": [
                  {
                    "id": "11.5.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                    "evidenceReference": "others-vendorDocument"
                  },
                  {
                    "id": "11.5.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all vendor documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "11.5.1.1",
            "desc": "Additional requirement for service providers only: Intrusion-detection and/or intrusion-prevention techniques detect, alert on/prevent, and address covert malware communication channels. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "11.5.1.1a",
                "description": "Additional testing procedure for service provider assessments only: Examine documentation and configuration settings to verify that methods to detect and alert on/prevent covert malware communication channels are in place and operating.",
                "reportingInstructions": [
                  {
                    "id": "11.5.1.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "11.5.1.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configuration settings examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "11.5.1.1b",
                "description": "Additional testing procedure for service provider assessments only: Examine the entity's incident-response plan (Requirement 12.10.1) to verify it requires and defines a response in the event that covert malware communication channels are detected.",
                "reportingInstructions": [
                  {
                    "id": "11.5.1.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for the entity's incident-response plan examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "11.5.1.1c",
                "description": "Additional testing procedure for service provider assessments only: Interview responsible personnel and observe processes to verify that personnel maintain knowledge of covert malware communication and control techniques and are knowledgeable about how to respond when malware is suspected.",
                "reportingInstructions": [
                  {
                    "id": "11.5.1.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "11.5.1.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of processes conducted for this testing procedure.",
                    "evidenceReference": "others-observationOfProcesses"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "11.5.2",
            "desc": "A change-detection mechanism (for example, file integrity monitoring tools) is deployed as follows: To alert personnel to unauthorized modification (including changes, additions, and deletions) of critical files, To perform critical file comparisons at least once weekly.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "11.5.2a",
                "description": "Examine system settings, monitored files, and results from monitoring activities to verify the use of a change-detection mechanism.",
                "reportingInstructions": [
                  {
                    "id": "11.5.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system settings examined for this testing procedure.",
                    "evidenceReference": "others-systemSettings"
                  },
                  {
                    "id": "11.5.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all monitored files examined for this testing procedure.",
                    "evidenceReference": "others-systemSettings"
                  },
                  {
                    "id": "11.5.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all results from monitoring activities examined for this testing procedure.",
                    "evidenceReference": "others-systemSettings"
                  }
                ]
              },
              {
                "id": "11.5.2b",
                "description": "Examine settings for the change-detection mechanism to verify it is configured in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "11.5.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all settings for the change-detection mechanism examined for this testing procedure.",
                    "evidenceReference": "others-changeDetectionSettings"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 11.6,
        "title": "Sub-req 11.6",
        "desc": "Unauthorized changes on payment pages are detected and responded to.",
        "controls": [
          {
            "id": 1,
            "title": "11.6.1",
            "desc": "A change- and tamper-detection mechanism is deployed as follows: To alert personnel to unauthorized modification (including indicators of compromise, changes, additions, and deletions) to the security-impacting HTTP headers and the script contents of payment pages as received by the consumer browser, The mechanism is configured to evaluate the received HTTP headers and payment pages, The mechanism functions are performed as follows: At least once weekly OR Periodically (at the frequency defined in the entity's targeted risk analysis, which is performed according to all elements specified in Requirement 12.3.1). (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "11.6.1a",
                "description": "Examine system settings, monitored payment pages, and results from monitoring activities to verify the use of a change- and tamper-detection mechanism.",
                "reportingInstructions": [
                  {
                    "id": "11.6.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all system settings examined for this testing procedure.",
                    "evidenceReference": "others-systemSettings"
                  },
                  {
                    "id": "11.6.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all monitoring activities examined for this testing procedure.",
                    "evidenceReference": "others-systemSettings"
                  },
                  {
                    "id": "11.6.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all results from monitoring activities examined for this testing procedure.",
                    "evidenceReference": "others-systemSettings"
                  }
                ]
              },
              {
                "id": "11.6.1b",
                "description": "Examine configuration settings to verify the mechanism is configured in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "11.6.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-configSetting"
                  }
                ]
              },
              {
                "id": "11.6.1c",
                "description": "If the mechanism functions are performed at an entity-defined frequency, examine the entity's targeted risk analysis for determining the frequency to verify the risk analysis was performed in accordance with all elements specified at Requirement 12.3.1.",
                "reportingInstructions": [
                  {
                    "id": "11.6.1c",
                    "description": "Identify the evidence reference number(s) from Section 6 for the entity's targeted risk analysis examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "11.6.1d",
                "description": "Examine configuration settings and interview personnel to verify the mechanism functions are performed either: At least once weekly OR At the frequency defined in the entity's targeted risk analysis performed for this requirement.",
                "reportingInstructions": [
                  {
                    "id": "11.6.1d",
                    "description": "Identify the evidence reference number(s) from Section 6 for all configuration settings examined for this testing procedure.",
                    "evidenceReference": "others-configSetting"
                  },
                  {
                    "id": "11.6.1d",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 12,
    "reqName": "Req 12",
    "reqDesc": "Support Information Security with Organizational Policies and Programs",
    "subReq": [
      {
        "id": 12.01,
        "title": "Sub-req 12.1",
        "desc": "A comprehensive information security policy that governs and provides direction for protection of the entity's information assets is known and current.",
        "controls": [
          {
            "id": 1,
            "title": "12.1.1",
            "desc": "An overall information security policy is: Established, Published, Maintained, Disseminated to all relevant personnel, as well as to relevant vendors and business partners.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.1.1",
                "description": "Examine the information security policy and interview personnel to verify that the overall information security policy is managed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "12.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for the information security policy examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "12.1.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "12.1.2",
            "desc": "The information security policy is: Reviewed at least once every 12 months, Updated as needed to reflect changes to business objectives or risks to the environment.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.1.2",
                "description": "Examine the information security policy and interview responsible personnel to verify the policy is managed in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "12.1.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all information security policies examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "12.1.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "12.1.3",
            "desc": "The security policy clearly defines information security roles and responsibilities for all personnel, and all personnel are aware of and acknowledge their information security responsibilities.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.1.3a",
                "description": "Examine the information security policy to verify that they clearly define information security roles and responsibilities for all personnel.",
                "reportingInstructions": [
                  {
                    "id": "12.1.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the information security policy examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "12.1.3b",
                "description": "Interview personnel in various roles to verify they understand their information security responsibilities.",
                "reportingInstructions": [
                  {
                    "id": "12.1.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "12.1.3c",
                "description": "Examine documented evidence to verify personnel acknowledge their information security responsibilities.",
                "reportingInstructions": [
                  {
                    "id": "12.1.3c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented evidence examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "12.1.4",
            "desc": "Responsibility for information security is formally assigned to a Chief Information Security Officer or other information security knowledgeable member of executive management.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.1.4",
                "description": "Examine the information security policy to verify that information security is formally assigned to a Chief Information Security Officer or other information security-knowledgeable member of executive management.",
                "reportingInstructions": [
                  {
                    "id": "12.1.4",
                    "description": "Identify the evidence reference number(s) from Section 6 for the information security policy examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 12.2,
        "title": "Sub-req 12.2",
        "desc": "Acceptable use policies for end-user technologies are defined and implemented.",
        "controls": [
          {
            "id": 1,
            "title": "12.2.1",
            "desc": "Acceptable use policies for end-user technologies are documented and implemented, including: Explicit approval by authorized parties, Acceptable uses of the technology, List of products approved by the company for employee use, including hardware and software.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.2.1",
                "description": "Examine the acceptable use policies for end-user technologies and interview responsible personnel to verify processes are documented and implemented in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "12.2.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all acceptable use policies examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "12.2.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 12.3,
        "title": "Sub-req 12.3",
        "desc": "Risks to the cardholder data environment are formally identified, evaluated, and managed.",
        "controls": [
          {
            "id": 1,
            "title": "12.3.1",
            "desc": "For each PCI DSS requirement that specifies completion of a targeted risk analysis, the analysis is documented and includes: Identification of the assets being protected, Identification of the threat(s) that the requirement is protecting against, Identification of factors that contribute to the likelihood and/or impact of a threat being realized, Resulting analysis that determines, and includes justification for, how the frequency or processes defined by the entity to meet the requirement minimize the likelihood and/or impact of the threat being realized, Review of each targeted risk analysis at least once every 12 months to determine whether the results are still valid or if an updated risk analysis is needed, Performance of updated risk analyses when needed, as determined by the annual review. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.3.1",
                "description": "Examine documented policies and procedures to verify a process is defined for performing targeted risk analyses for each PCI DSS requirement that specifies completion of a targeted risk analysis, and that the process includes all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "12.3.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "12.3.2",
            "desc": "A targeted risk analysis is performed for each PCI DSS requirement that the entity meets with the customized approach, to include: Documented evidence detailing each element specified in Appendix D: Customized Approach (including, at a minimum, a controls matrix and risk analysis), Approval of documented evidence by senior management, Performance of the targeted analysis of risk at least once every 12 months.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach Appendix C to support this method.",
            "testingProcedures": [
              {
                "id": "12.3.2",
                "description": "Examine the documented targeted risk-analysis for each PCI DSS requirement that the entity meets with the customized approach to verify that documentation for each requirement exists and is in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "12.3.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "12.3.3",
            "desc": "Cryptographic cipher suites and protocols in use are documented and reviewed at least once every 12 months, including at least the following: An up-to-date inventory of all cryptographic cipher suites and protocols in use, including purpose and where used, Active monitoring of industry trends regarding continued viability of all cryptographic cipher suites and protocols in use, Documentation of a plan to respond to anticipated changes in cryptographic vulnerabilities. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.3.3",
                "description": "Examine documentation for cryptographic suites and protocols in use and interview personnel to verify the documentation and review is in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "12.3.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "12.3.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "12.3.4",
            "desc": "Hardware and software technologies in use are reviewed at least once every 12 months, including at least the following: Analysis that the technologies continue to receive security fixes from vendors promptly, Analysis that the technologies continue to support (and do not preclude) the entity's PCI DSS compliance, Documentation of any industry announcements or trends related to a technology, such as when a vendor has announced 'end of life' plans for a technology, Documentation of a plan, approved by senior management, to remediate outdated technologies, including those for which vendors have announced 'end of life' plans. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.3.4",
                "description": "Examine documentation for the review of hardware and software technologies in use and interview personnel to verify that the review is in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "12.3.4",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "12.3.4",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 12.4,
        "title": "Sub-req 12.4",
        "desc": "PCI DSS compliance is managed.",
        "controls": [
          {
            "id": 1,
            "title": "12.4.1",
            "desc": "Additional requirement for service providers only: Responsibility is established by executive management for the protection of cardholder data and a PCI DSS compliance program to include: Overall accountability for maintaining PCI DSS compliance, Defining a charter for a PCI DSS compliance program and communication to executive management.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.4.1",
                "description": "Additional testing procedure for service provider assessments only: Examine documentation to verify that executive management has established responsibility for the protection of cardholder data and a PCI DSS compliance program in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "12.4.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "12.4.2",
            "desc": "Additional requirement for service providers only: Reviews are performed at least once every three months to confirm that personnel are performing their tasks in accordance with all security policies and operational procedures. Reviews are performed by personnel other than those responsible for performing the given task and include, but are not limited to, the following tasks: Daily log reviews, Configuration reviews for network security controls, Applying configuration standards to new systems, Responding to security alerts, Change-management processes.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.4.2a",
                "description": "Additional testing procedure for service provider assessments only: Examine policies and procedures to verify that processes are defined for conducting reviews to confirm that personnel are performing their tasks in accordance with all security policies and all operational procedures, including but not limited to the tasks specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "12.4.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "12.4.2b",
                "description": "Additional testing procedure for service provider assessments only: Interview responsible personnel and examine records of reviews to verify that reviews are performed: At least once every three months, By personnel other than those responsible for performing the given task.",
                "reportingInstructions": [
                  {
                    "id": "12.4.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "12.4.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all records of reviews examined for this testing procedure.",
                    "evidenceReference": "others-recordsOfReviews"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "12.4.2.1",
            "desc": "Additional requirement for service providers only: Reviews conducted in accordance with Requirement 12.4.2 are documented to include: Results of the reviews, Documented remediation actions taken for any tasks that were found to not be performed at Requirement 12.4.2, Review and sign-off of results by personnel assigned responsibility for the PCI DSS compliance program.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.4.2.1",
                "description": "Additional testing procedure for service provider assessments only: Examine documentation from the reviews conducted in accordance with PCI DSS Requirement 12.4.2 to verify the documentation includes all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "12.4.2.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 12.5,
        "title": "Sub-req 12.5",
        "desc": "PCI DSS scope is documented and validated.",
        "controls": [
          {
            "id": 1,
            "title": "12.5.1",
            "desc": "An inventory of system components that are in scope for PCI DSS, including a description of function/use, is maintained and kept current.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.5.1a",
                "description": "Examine the inventory to verify it includes all in-scope system components and a description of function/use for each.",
                "reportingInstructions": [
                  {
                    "id": "12.5.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the inventory examined for this testing procedure.",
                    "evidenceReference": "others-inventory"
                  }
                ]
              },
              {
                "id": "12.5.1b",
                "description": "Interview personnel to verify the inventory is kept current.",
                "reportingInstructions": [
                  {
                    "id": "12.5.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "12.5.2",
            "desc": "PCI DSS scope is documented and confirmed by the entity at least once every 12 months and upon significant change to the in-scope environment. At a minimum, the scoping validation includes: Identifying all data flows for the various payment stages (for example, authorization, capture settlement, chargebacks, and refunds) and acceptance channels (for example, card-present, card-not-present, and e-commerce), Updating all data-flow diagrams per Requirement 1.2.4, Identifying all locations where account data is stored, processed, and transmitted, including but not limited to: 1) any locations outside of the currently defined CDE, 2) applications that process CHD, 3) transmissions between systems and networks, and 4) file backups, Identifying all system components in the CDE, connected to the CDE, or that could impact security of the CDE, Identifying all segmentation controls in use and the environment(s) from which the CDE is segmented, including justification for environments being out of scope, Identifying all connections from third-party entities with access to the CDE, Confirming that all identified data flows, account data, system components, segmentation controls, and connections from third parties with access to the CDE are included in scope.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.5.2a",
                "description": "Examine documented results of scope reviews and interview personnel to verify that the reviews are performed: At least once every 12 months.",
                "reportingInstructions": [
                  {
                    "id": "12.5.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "12.5.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "12.5.2b",
                "description": "Examine documented results of scope reviews performed by the entity to verify that PCI DSS scoping confirmation activity includes all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "12.5.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented results of scope reviews examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "12.5.2.1",
            "desc": "Additional requirement for service providers only: PCI DSS scope is documented and confirmed by the entity at least once every six months and upon significant change to the in-scope environment. At a minimum, the scoping validation includes all the elements specified in Requirement 12.5.2. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.5.2.1a",
                "description": "Additional testing procedure for service provider assessments only: Examine documented results of scope reviews and interview personnel to verify that reviews per Requirement 12.5.2 are performed: At least once every six months, and After significant changes.",
                "reportingInstructions": [
                  {
                    "id": "12.5.2.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented results of scope reviews examined for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "12.5.2.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "12.5.2.1b",
                "description": "Additional testing procedure for service provider assessments only: Examine documented results of scope reviews to verify that scoping validation includes all elements specified in Requirement 12.5.2.",
                "reportingInstructions": [
                  {
                    "id": "12.5.2.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented results of scope reviews examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "12.5.3",
            "desc": "Additional requirement for service providers only: Significant changes to organizational structure result in a documented (internal) review of the impact to PCI DSS scope and applicability of controls, with results communicated to executive management. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.5.3a",
                "description": "Additional testing procedure for service provider assessments only: Examine policies and procedures to verify that processes are defined such that a significant change to organizational structure results in documented review of the impact to PCI DSS scope and applicability of controls.",
                "reportingInstructions": [
                  {
                    "id": "12.5.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "12.5.3b",
                "description": "Additional testing procedure for service provider assessments only: Examine documentation (for example, meeting minutes) and interview responsible personnel to verify that significant changes to organizational structure resulted in documented reviews that included all elements specified in this requirement, with results communicated to executive management.",
                "reportingInstructions": [
                  {
                    "id": "12.5.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "12.5.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 12.6,
        "title": "Sub-req 12.6",
        "desc": "Security awareness education is an ongoing activity.",
        "controls": [
          {
            "id": 1,
            "title": "12.6.1",
            "desc": "A formal security awareness program is implemented to make all personnel aware of the entity's information security policy and procedures, and their role in protecting the cardholder data.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.6.1",
                "description": "Examine the security awareness program to verify it provides awareness to all personnel about the entity's information security policy and procedures, and personnel's role in protecting the cardholder data.",
                "reportingInstructions": [
                  {
                    "id": "12.6.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for the security awareness program examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "12.6.2",
            "desc": "The security awareness program is: Reviewed at least once every 12 months, and Updated as needed to address any new threats and vulnerabilities that may impact the security of the entity's cardholder data and/or sensitive authentication data, or the information provided to personnel about their role in protecting cardholder data. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.6.2",
                "description": "Examine security awareness program content, evidence of reviews, and interview personnel to verify that the security awareness program is in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "12.6.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all security awareness program content examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "12.6.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all evidence of reviews examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "12.6.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "12.6.3",
            "desc": "Personnel receive security awareness training as follows: Upon hire and at least once every 12 months, Multiple methods of communication are used, Personnel acknowledge at least once every 12 months that they have read and understood the information security policy and procedures.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.6.3a",
                "description": "Examine security awareness program records to verify that personnel attend security awareness training upon hire and at least once every 12 months.",
                "reportingInstructions": [
                  {
                    "id": "12.6.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all security awareness program records examined for this testing procedure.",
                    "evidenceReference": "others-securityAwarenessProgramRecords"
                  }
                ]
              },
              {
                "id": "12.6.3b",
                "description": "Examine security awareness program materials to verify the program includes multiple methods of communicating awareness and educating personnel.",
                "reportingInstructions": [
                  {
                    "id": "12.6.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all security awareness program materials examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "12.6.3c",
                "description": "Interview personnel to verify they have completed awareness training and are aware of their role in protecting cardholder data.",
                "reportingInstructions": [
                  {
                    "id": "12.6.3c",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              },
              {
                "id": "12.6.3d",
                "description": "Examine security awareness program materials and personnel acknowledgments to verify that personnel acknowledge at least once every 12 months that they have read and understand the information security policy and procedures.",
                "reportingInstructions": [
                  {
                    "id": "12.6.3d",
                    "description": "Identify the evidence reference number(s) from Section 6 for all security awareness program materials examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "12.6.3d",
                    "description": "Identify the evidence reference number(s) from Section 6 for all personnel acknowledgments examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "12.6.3.1",
            "desc": "Security awareness training includes awareness of threats and vulnerabilities that could impact the security of cardholder data and/or sensitive authentication data, including but not limited to: Phishing and related attacks, Social engineering. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.6.3.1",
                "description": "Examine security awareness training content to verify it includes all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "12.6.3.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all security awareness training content examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "12.6.3.2",
            "desc": "Security awareness training includes awareness about the acceptable use of end-user technologies in accordance with Requirement 12.2.1. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.6.3.2",
                "description": "Examine security awareness training content to verify it includes awareness about acceptable use of end-user technologies in accordance with Requirement 12.2.1.",
                "reportingInstructions": [
                  {
                    "id": "12.6.3.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all security awareness training content examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 12.7,
        "title": "Sub-req 12.7",
        "desc": "Personnel are screened to reduce risks from insider threats.",
        "controls": [
          {
            "id": 1,
            "title": "12.7.1",
            "desc": "Potential personnel who will have access to the CDE are screened, within the constraints of local laws, prior to hire to minimize the risk of attacks from internal sources.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.7.1",
                "description": "Interview responsible Human Resource department management to verify that screening is conducted, within the constraints of local laws, prior to hiring potential personnel who will have access to the CDE.",
                "reportingInstructions": [
                  {
                    "id": "12.7.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 12.8,
        "title": "Sub-req 12.8",
        "desc": "Risk to information assets associated with third-party service provider (TPSP) relationships is managed.",
        "controls": [
          {
            "id": 1,
            "title": "12.8.1",
            "desc": "A list of all third-party service providers (TPSPs) with which account data is shared or that could affect the security of account data is maintained, including a description for each of the services provided.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.8.1a",
                "description": "Examine policies and procedures to verify that processes are defined to maintain a list of TPSPs, including a description for each of the services provided, for all TPSPs with whom account data is shared or that could affect the security of account data.",
                "reportingInstructions": [
                  {
                    "id": "12.8.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "12.8.1b",
                "description": "Examine documentation to verify that a list of all TPSPs is maintained that includes a description of the services provided.",
                "reportingInstructions": [
                  {
                    "id": "12.8.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "12.8.2",
            "desc": "Written agreements with TPSPs are maintained as follows: Written agreements are maintained with all TPSPs with which account data is shared or that could affect the security of the CDE, Written agreements include acknowledgments from TPSPs that TPSPs are responsible for the security of account data the TPSPs possess or otherwise store, process, or transmit on behalf of the entity, or to the extent that the TPSP could impact the security of the entity's cardholder data and/or sensitive authentication data.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.8.2a",
                "description": "Examine policies and procedures to verify that processes are defined to maintain written agreements with all TPSPs in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "12.8.2a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "12.8.2b",
                "description": "Examine written agreements with TPSPs to verify they are maintained in accordance with all elements as specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "12.8.2b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all written agreements examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "12.8.3",
            "desc": "An established process is implemented for engaging TPSPs, including proper due diligence prior to engagement.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.8.3a",
                "description": "Examine policies and procedures to verify that processes are defined for engaging TPSPs, including proper due diligence prior to engagement.",
                "reportingInstructions": [
                  {
                    "id": "12.8.3a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "12.8.3b",
                "description": "Examine evidence and interview responsible personnel to verify the process for engaging TPSPs includes proper due diligence prior to engagement.",
                "reportingInstructions": [
                  {
                    "id": "12.8.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all evidence examined for this testing procedure.",
                    "evidenceReference": "others-allEvidence"
                  },
                  {
                    "id": "12.8.3b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "12.8.4",
            "desc": "A program is implemented to monitor TPSPs' PCI DSS compliance status at least once every 12 months.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.8.4a",
                "description": "Examine policies and procedures to verify that processes are defined to monitor TPSPs' PCI DSS compliance status at least once every 12 months.",
                "reportingInstructions": [
                  {
                    "id": "12.8.4a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "12.8.4b",
                "description": "Examine documentation and interview responsible personnel to verify that the PCI DSS compliance status of each TPSP is monitored at least once every 12 months.",
                "reportingInstructions": [
                  {
                    "id": "12.8.4b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "12.8.4b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "12.8.5",
            "desc": "Information is maintained about which PCI DSS requirements are managed by each TPSP, which are managed by the entity, and any that are shared between the TPSP and the entity.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.8.5a",
                "description": "Examine policies and procedures to verify that processes are defined to maintain information about which PCI DSS requirements are managed by each TPSP, which are managed by the entity, and any that are shared between both the TPSP and the entity.",
                "reportingInstructions": [
                  {
                    "id": "12.8.5a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "12.8.5b",
                "description": "Examine documentation and interview personnel to verify the entity maintains information about which PCI DSS requirements are managed by each TPSP, which are managed by the entity, and any that are shared between both entities.",
                "reportingInstructions": [
                  {
                    "id": "12.8.5b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "12.8.5b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 12.9,
        "title": "Sub-req 12.9",
        "desc": "Third-party service providers (TPSPs) support their customers' PCI DSS compliance.",
        "controls": [
          {
            "id": 1,
            "title": "12.9.1",
            "desc": "Additional requirement for service providers only: TPSPs provide written agreements to customers that include acknowledgements that TPSPs are responsible for the security of account data the TPSP possesses or otherwise stores, processes, or transmits on behalf of the customer, or to the extent that the TPSP could impact the security of the customer's cardholder data and/or sensitive authentication data.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.9.1",
                "description": "Additional testing procedure for service provider assessments only: Examine TPSP policies, procedures, and templates used for written agreements to verify processes are defined for the TPSP to provide written acknowledgments to customers in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "12.9.1",
                    "description": "Identify the evidence reference number(s) from Section 6 for all TPSP policies, procedures, and templates used for written agreements examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "12.9.2",
            "desc": "Additional requirement for service providers only: TPSPs support their customers' requests for information to meet Requirements 12.8.4 and 12.8.5 by providing the following upon customer request: PCI DSS compliance status information (Requirement 12.8.4), Information about which PCI DSS requirements are the responsibility of the TPSP and which are the responsibility of the customer, including any shared responsibilities (Requirement 12.8.5), for any service the TPSP provides that meets a PCI DSS requirement(s) on behalf of customers or that can impact security of customers' cardholder data and/or sensitive authentication data.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.9.2",
                "description": "Additional testing procedure for service provider assessments only: Examine policies and procedures to verify processes are defined for the TPSPs to support customers' request for information to meet Requirements 12.8.4 and 12.8.5 in accordance with all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "12.9.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 12.10,
        "title": "Sub-req 12.10",
        "desc": "Suspected and confirmed security incidents that could impact the CDE are responded to immediately.",
        "controls": [
          {
            "id": 1,
            "title": "12.10.1",
            "desc": "An incident response plan exists and is ready to be activated in the event of a suspected or confirmed security incident. The plan includes, but is not limited to: Roles, responsibilities, and communication and contact strategies in the event of a suspected or confirmed security incident, including notification of payment brands and acquirers, at a minimum, Incident response procedures with specific containment and mitigation activities for different types of incidents, Business recovery and continuity procedures, Data backup processes, Analysis of legal requirements for reporting compromises, Coverage and responses of all critical system components, Reference or inclusion of incident response procedures from the payment brands.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.10.1a",
                "description": "Examine the incident response plan to verify that the plan exists and includes at least the elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "12.10.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all incident response plans examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "12.10.1b",
                "description": "Interview personnel and examine documentation from previously reported incidents or alerts to verify that the documented incident response plan and procedures were followed.",
                "reportingInstructions": [
                  {
                    "id": "12.10.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "12.10.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 2,
            "title": "12.10.2",
            "desc": "At least once every 12 months, the security incident response plan is: Reviewed and the content is updated as needed, Tested, including all elements listed in Requirement 12.10.1.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.10.2",
                "description": "Interview personnel and review documentation to verify that, at least once every 12 months, the security incident response plan is: Reviewed and updated as needed, Tested, including all elements listed in Requirement 12.10.1.",
                "reportingInstructions": [
                  {
                    "id": "12.10.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "12.10.2",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              }
            ]
          },
          {
            "id": 3,
            "title": "12.10.3",
            "desc": "Specific personnel are designated to be available on a 24/7 basis to respond to suspected or confirmed security incidents.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.10.3",
                "description": "Examine documentation and interview responsible personnel occupying designated roles to verify that specific personnel are designated to be available on a 24/7 basis to respond to security incidents.",
                "reportingInstructions": [
                  {
                    "id": "12.10.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "12.10.3",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 4,
            "title": "12.10.4",
            "desc": "Personnel responsible for responding to suspected and confirmed security incidents are appropriately and periodically trained on their incident response responsibilities.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.10.4",
                "description": "Examine training documentation and interview incident response personnel to verify that personnel are appropriately and periodically trained on their incident response responsibilities.",
                "reportingInstructions": [
                  {
                    "id": "12.10.4",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "12.10.4",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 5,
            "title": "12.10.4.1",
            "desc": "The frequency of periodic training for incident response personnel is defined in the entity's targeted risk analysis, which is performed according to all elements specified in Requirement 12.3.1. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.10.4.1a",
                "description": "Examine the entity's targeted risk analysis for the frequency of training for incident response personnel to verify the risk analysis was performed in accordance with all elements specified in Requirement 12.3.1.",
                "reportingInstructions": [
                  {
                    "id": "12.10.4.1a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the entity's targeted risk analysis examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "12.10.4.1b",
                "description": "Examine documented results of periodic training of incident response personnel and interview personnel to verify training is performed at the frequency defined in the entity's targeted risk analysis performed for this requirement.",
                "reportingInstructions": [
                  {
                    "id": "12.10.4.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documented results examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "12.10.4.1b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 6,
            "title": "12.10.5",
            "desc": "The security incident response plan includes monitoring and responding to alerts from security monitoring systems, including but not limited to: Intrusion-detection and intrusion-prevention systems, Network security controls, Change-detection mechanisms for critical files, The change- and tamper-detection mechanism for payment pages. This bullet is a best practice until 31 March 2025, after which it will be required as part of Requirement 12.10.5 and must be fully considered during a PCI DSS assessment, Detection of unauthorized wireless access points.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.10.5",
                "description": "Examine documentation and observe incident response processes to verify that monitoring and responding to alerts from security monitoring systems are covered in the security incident response plan, including but not limited to the systems specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "12.10.5",
                    "description": "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "12.10.5",
                    "description": "Identify the evidence reference number(s) from Section 6 for all observations of incident response processes for this testing procedure.",
                    "evidenceReference": "others-obsevationsOfIncidentResponse"
                  }
                ]
              }
            ]
          },
          {
            "id": 7,
            "title": "12.10.6",
            "desc": "The security incident response plan is modified and evolved according to lessons learned and to incorporate industry developments.",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.10.6a",
                "description": "Examine policies and procedures to verify that processes are defined to modify and evolve the security incident response plan according to lessons learned and to incorporate industry developments.",
                "reportingInstructions": [
                  {
                    "id": "12.10.6a",
                    "description": "Identify the evidence reference number(s) from Section 6 for all policies and procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "12.10.6b",
                "description": "Examine the security incident response plan and interview responsible personnel to verify that the incident response plan is modified and evolved according to lessons learned and to incorporate industry developments.",
                "reportingInstructions": [
                  {
                    "id": "12.10.6b",
                    "description": "Identify the evidence reference number(s) from Section 6 for the security incident response plan examined for this testing procedure.",
                    "evidenceReference": "document"
                  },
                  {
                    "id": "12.10.6b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  }
                ]
              }
            ]
          },
          {
            "id": 8,
            "title": "12.10.7",
            "desc": "Incident response procedures are in place, to be initiated upon the detection of stored PAN anywhere it is not expected, and include: Determining what to do if PAN is discovered outside the CDE, including its retrieval, secure deletion, and/or migration into the currently defined CDE, as applicable, Identifying whether sensitive authentication data is stored with PAN, Determining where the account data came from and how it ended up where it was not expected, Remediating data leaks or process gaps that resulted in the account data being where it was not expected. (Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.)",
            "assessmentDesc": "Describe why the assessment finding was selected. Note: Include all details as noted in the 'Required Reporting' column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
            "testingProcedures": [
              {
                "id": "12.10.7a",
                "description": "Examine documented incident response procedures to verify that procedures for responding to the detection of stored PAN anywhere it is not expected to exist, ready to be initiated, and include all elements specified in this requirement.",
                "reportingInstructions": [
                  {
                    "id": "12.10.7a",
                    "description": "Identify the evidence reference number(s) from Section 6 for the documented incident response procedures examined for this testing procedure.",
                    "evidenceReference": "document"
                  }
                ]
              },
              {
                "id": "12.10.7b",
                "description": "Interview personnel and examine records of response actions to verify that incident response procedures are performed upon detection of stored PAN anywhere it is not expected.",
                "reportingInstructions": [
                  {
                    "id": "12.10.7b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                    "evidenceReference": "interview"
                  },
                  {
                    "id": "12.10.7b",
                    "description": "Identify the evidence reference number(s) from Section 6 for all records of response actions examined for this testing procedure.",
                    "evidenceReference": "others-recordsOfResponse"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
],
  },
  appendix: {
    id: 1,
    title: "Appendix",
    requirements: [
      {
        id: 1,
        reqName: "Appendix-A",
        subReq: [
          {
            id: 1.1,
            title: "Appendix A1 - 1.1 ",
            desc: "Multi-tenant service providers protect and separate all customer environments and data.",
            controls: [
              {
                id: 1,
                title: "A1.1.1",
                desc: "Logical separation is implemented as follows:\n •	The provider cannot access its customers' environments without authorization\n•	Customers cannot access the provider's environment without authorization.\n Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment",
                assessmentDesc:
                  "Describe why the assessment finding was selected. Note: Include all details as noted in the “Required Reporting” column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
                testingProcedures: [
                  {
                    id: "A1.1.1",
                    description:
                      "Examine documentation and system and network configurations and interview personnel to verify that logical separation is implemented in accordance with all elements specified in this requirement.",
                    reportingInstructions: [
                      {
                        id: "A1.1.1a",
                        description:
                          "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                        evidenceReference: "document",
                      },
                      {
                        id: "A1.1.1b",
                        description:
                          "Identify the evidence reference number(s) from Section 6 for all system and network configurations examined for this testing procedure.",
                        evidenceReference: "others",
                      },
                      {
                        id: "A1.1.1c",
                        description:
                          "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                        evidenceReference: "interview",
                      },
                    ],
                  },
                ],
              },
              {
                id: 2,
                title: "A1.1.2",
                desc: "Controls are implemented such that each customer only has permission to access its own cardholder data and CDE.",
                assessmentDesc:
                  "Describe why the assessment finding was selected.Note: Include all details as noted in the “Required Reporting” column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
                testingProcedures: [
                  {
                    id: "A1.1.2.a",
                    description:
                      "Examine documentation to verify controls are defined such that each customer only has permission to access its own cardholder data and CDE.",
                    reportingInstructions: [
                      {
                        id: "A1.1.2.a",
                        description:
                          "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                        evidenceReference: "document",
                      },
                    ],
                  },
                  {
                    id: "A1.1.2.b",
                    description:
                      "Examine system configurations to verify that customers have privileges established to only access their own account data and CDE.",
                    reportingInstructions: [
                      {
                        id: "A1.1.2.b",
                        description:
                          "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                        evidenceReference: "others",
                      },
                    ],
                  },
                ],
              },
              {
                id: 3,
                title: "A1.1.3",
                desc: "Controls are implemented such that each customer can only access resources allocated to them.",
                assessmentDesc:
                  "Describe why the assessment finding was selected. Note: Include all details as noted in the “Required Reporting” column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
                testingProcedures: [
                  {
                    id: "A1.1.3",
                    description:
                      "Examine customer privileges to verify each customer can only access resources allocated to them.",
                    reportingInstructions: [
                      {
                        id: "A1.1.3",
                        description:
                          "Identify the evidence reference number(s) from Section 6 for all customer privileges examined for this testing procedure.",
                        evidenceReference: "others",
                      },
                    ],
                  },
                ],
              },
              {
                id: 4,
                title: "A1.1.4",
                desc: "The effectiveness of logical separation controls used to separate customer environments is confirmed at least once every six months via penetration testing.Note: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.",
                assessmentDesc:
                  "Describe why the assessment finding was selected. Note: Include all details as noted in the “Required Reporting” column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
                testingProcedures: [
                  {
                    id: "A1.1.4",
                    description:
                      "Examine the results from the most recent penetration test to verify that testing confirmed the effectiveness of logical separation controls used to separate customer environments.",
                    reportingInstructions: [
                      {
                        id: "A1.1.4",
                        description:
                          "Identify the evidence reference number(s) from Section 6 for the results from the most recent penetration test examined for this testing procedure.",
                        evidenceReference: "others",
                      },
                    ],
                  },
                ],
              },
              {
                id: 5,
                title: "A1.2.1",
                desc: "Audit log capability is enabled for each customer's environment that is consistent with PCI DSS Requirement 10, including:\n•	Logs are enabled for common third-party applications.\n•	Logs are active by default.\n•	Logs are available for review only by the owning customer.\n•	Log locations are clearly communicated to the owning customer.\n•	Log data and availability is consistent with PCI DSS Requirement 10.\n",
                assessmentDesc:
                  "Describe why the assessment finding was selected.Note: Include all details as noted in the “Required Reporting” column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
                testingProcedures: [
                  {
                    id: "A1.2.1",
                    description:
                      "Examine documentation and system configuration settings to verify the provider has enabled audit log capability for each customer environment in accordance with all elements specified in this requirement.",
                    reportingInstructions: [
                      {
                        id: "A1.2.1",
                        description:
                          "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                        evidenceReference: "document",
                      },
                      {
                        id: "A1.2.1",
                        description:
                          "Identify the evidence reference number(s) from Section 6 for all system configuration settings examined for this testing procedure.",
                        evidenceReference: "others",
                      },
                    ],
                  },
                ],
              },
              {
                id: 6,
                title: "A1.2.2",
                desc: "Processes or mechanisms are implemented to support and/or facilitate prompt forensic investigations in the event of a suspected or confirmed security incident for any customer.",
                assessmentDesc:
                  "Describe why the assessment finding was selected. Note: Include all details as noted in the “Required Reporting” column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
                testingProcedures: [
                  {
                    id: "A1.2.2",
                    description:
                      "Examine documented procedures to verify that the provider has processes or mechanisms to support and/or facilitate a prompt forensic investigation of related servers in the event of a suspected or confirmed security incident for any customer.",
                    reportingInstructions: [
                      {
                        id: "A1.2.2",
                        description:
                          "Identify the evidence reference number(s) from Section 6 for the documented procedures examined for this testing procedure.",
                        evidenceReference: "document",
                      },
                    ],
                  },
                ],
              },
              {
                id: 7,
                title: "A1.2.3",
                desc: "Processes or mechanisms are implemented for reporting and addressing suspected or confirmed security incidents and vulnerabilities, including:\n•	Customers can securely report security incidents and vulnerabilities to the provider. \n•	The provider addresses and remediates suspected or confirmed security incidents and vulnerabilities according to Requirement 6.3.1.\nNote: This requirement is a best practice until 31 March 2025, after which it will be required and must be fully considered during a PCI DSS assessment.\n",
                assessmentDesc:
                  "Describe why the assessment finding was selected. Note: Include all details as noted in the “Required Reporting” column of the table in Assessment Findings in the ROC Template Instructions. *As applicable, complete and attach the corresponding documentation (Appendix C, Appendix E, or both) to support the method(s) used.",
                testingProcedures: [
                  {
                    id: "A1.2.3",
                    description:
                      "Examine documented procedures and interview personnel to verify that the provider has a mechanism for reporting and addressing suspected or confirmed security incidents and vulnerabilities, in accordance with all elements specified in this requirement.",
                    reportingInstructions: [
                      {
                        id: "A1.2.3",
                        description:
                          "Identify the evidence reference number(s) from Section 6 for the documented procedures examined for this testing procedure.",
                        evidenceReference: "document",
                      },
                      {
                        id: "A1.2.3",
                        description:
                          "Identify the evidence reference number(s) from Section 6 for all interviews conducted for this testing procedure.",
                        evidenceReference: "interview",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 2.1,
            title: "Appendix A2 - 2.1 ",
            desc: "POI terminals using SSL and/or early TLS are confirmed as not susceptible to known SSL/TLS exploits.",
            controls: [
              {
                id: 1,
                title: "A2.1.1",
                desc: "Where POS POI terminals at the merchant or payment acceptance location use SSL and/or early TLS, the entity confirms the devices are not susceptible to any known exploits for those protocols.",
                assessmentDesc:
                  "Describe why the assessment finding was selected. Note: Include all details as noted in the “Required Reporting” column of the table in Assessment Findings in the ROC Template Instructions. * As applicable, complete and attach Appendix C to support this method.",
                testingProcedures: [
                  {
                    id: "A2.1.1",
                    description:
                      "For POS POI terminals using SSL and/or early TLS, confirm the entity has documentation (for example, vendor documentation, system/network configuration details) that verifies the devices are not susceptible to any known exploits for SSL/early TLS.",
                    reportingInstructions: [
                      {
                        id: "A2.1.1",
                        description:
                          "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                        evidenceReference: "document",
                      },
                    ],
                  },
                ],
              },
              {
                id: 2,
                title: "A2.1.2",
                desc: "A2.1.2 Additional requirement for service providers only: All service providers with existing connection points to POS POI terminals that use SSL and/or early TLS as defined in A2.1 have a formal Risk Mitigation and Migration Plan in place that includes:\n•	Description of usage, including what data is being transmitted, types and number of systems that use and/or support SSL/early TLS, and type of environment.\n•	Risk-assessment results and risk-reduction controls in place.\n•	Description of processes to monitor for new vulnerabilities associated with SSL/early TLS.\n•	Description of change control processes that are implemented to ensure SSL/early TLS is not implemented into new environments.\n•	Overview of migration project plan to replace SSL/early TLS at a future date.",
                assessmentDesc:
                  "Describe why the assessment finding was selected.Note: Include all details as noted in the “Required Reporting” column of the table in Assessment Findings in the ROC Template Instructions.* As applicable, complete and attach Appendix C to support this method.",
                testingProcedures: [
                  {
                    id: "A2.1.2",
                    description:
                      "Additional testing procedure for service provider assessments only: Review the documented Risk Mitigation and Migration Plan to verify it includes all elements specified in this requirement.",
                    reportingInstructions: [
                      {
                        id: "A2.1.2",
                        description:
                          "Identify the evidence reference number(s) from Section 6 for the documented Risk Mitigation and Migration Plan examined for this testing procedure.",
                        evidenceReference: "document",
                      },
                    ],
                  },
                ],
              },
              {
                id: 3,
                title: "A2.1.3",
                desc: "Additional requirement for service providers only: All service providers provide a secure service offering.",
                assessmentDesc:
                  "Describe why the assessment finding was selected. Note: Include all details as noted in the “Required Reporting” column of the table in Assessment Findings in the ROC Template Instructions. * As applicable, complete and attach Appendix C to support this method.",
                testingProcedures: [
                  {
                    id: "A2.1.3",
                    description:
                      "Additional testing procedure for service provider assessments only: Examine system configurations and supporting documentation to verify the service provider offers a secure protocol option for its service.",
                    reportingInstructions: [
                      {
                        id: "A2.1.3",
                        description:
                          "Identify the evidence reference number(s) from Section 6 for all system configurations examined for this testing procedure.",
                        evidenceReference: "others",
                      },
                      {
                        id: "A2.1.3",
                        description:
                          "Identify the evidence reference number(s) from Section 6 for all documentation examined for this testing procedure.",
                        evidenceReference: "document",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 3.1,
            title: "Appendix A3",
          },
        ],
      },
      {
        id: 2,
        reqName: "Appendix-B",
      },
      {
        id: 3,
        reqName: "Appendix-C",
      },
      {
        id: 4,
        reqName: "Appendix-D",
      },
      {
        id: 5,
        reqName: "Appendix-E",
      },
    ],
  },
};

export default reqConfig;
