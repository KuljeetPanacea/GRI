const reqConfig = [
  {
    "id": 1,
    "reqName": "Req-1",
    "subReq": [
      {
        "id": 1,
        "title": "Sub-req-1.1",
        "controls": [
          {
            "title": "Control-1.1.1",
            "testingProcedure": ["1.1.1"],
            "evidenceReference": ["document", "interview"]
          },
          {
            "title": "Control-1.1.2",
            "testingProcedure": ["1.1.2a", "1.1.2b"],
            "evidenceReference": ["document", "interview"]
          }
        ]
      },
      {
        "id": 2,
        "title": "Sub-req-1.2",
        "controls": [
          {
            "title": "Control-1.2.1",
            "testingProcedure": ["1.2.1a", "1.2.1b"],
            "evidenceReference": ["others-congifSt", "others-configSetting"]
          },
          {
            "title": "Control-1.2.2",
            "testingProcedure": ["1.2.2a", "1.2.2b", "1.2.2c"],
            "evidenceReference": [
              "document",
              "interview",
              "others-changeControl",
              "others-networkConfigSt"
            ]
          },
          {
            "title": "Control-1.2.3",
            "testingProcedure": ["1.2.3a", "1.2.3b"],
            "evidenceReference": [
              "others-diagrams",
              "others-networkConfig",
              "document",
              "interview"
            ]
          },
          {
            "title": "Control-1.2.4",
            "testingProcedure": ["1.2.4a", "1.2.4b"],
            "evidenceReference": [
              "interview",
              "others-dataFlowDg",
              "document"
            ]
          },
          {
            "title": "Control-1.2.5",
            "testingProcedure": ["1.2.5a", "1.2.5b"],
            "evidenceReference": ["document", "configSt"]
          },
          {
            "title": "Control-1.2.6",
            "testingProcedure": ["1.2.6a", "1.2.6b"],
            "evidenceReference": ["document", "configSt"]
          },
          {
            "title": "Control-1.2.7",
            "testingProcedure": ["1.2.7a", "1.2.7b", "1.2.7c"],
            "evidenceReference": ["document", "interview", "others"]
          },
          {
            "title": "Control-1.2.8",
            "testingProcedure": ["1.2.8"],
            "evidenceReference": ["others-configFiles"]
          }
        ]
      },
      {
        "id": 3,
        "title": "Sub-req-1.3",
        "controls": [
          {
            "id": 1,
            "title": "Control-1.3.1",
            "testingProcedure": ["1.3.1a", "1.3.1b"],
            "evidenceReference": ["others-configSt", "others-config"]
          },
          {
            "id": 2,
            "title": "Control-1.3.2",
            "testingProcedure": ["1.3.2a", "1.3.2b"],
            "evidenceReference": ["others-configSt", "others-config"]
          },
          {
            "id": 3,
            "title": "Control-1.3.3",
            "testingProcedure": ["1.3.3"],
            "evidenceReference": [
              "others-configSetting",
              "others-networkDiagram"
            ]
          }
        ]
      },
      {
        "id": 4,
        "title": "Sub-req-1.4",
        "controls": [
          {
            "title": "Control-1.4.1",
            "testingProcedure": ["1.4.1a", "1.4.1b"],
            "evidenceReference": [
              "others-configSt",
              "others-networkDiagram",
              "others-networkConfig"
            ]
          },
          {
            "title": "Control-1.4.2",
            "testingProcedure": ["1.4.2"],
            "evidenceReference": ["document", "others-config"]
          },
          {
            "title": "Control-1.4.3",
            "testingProcedure": ["1.4.3", "1.4.3"],
            "evidenceReference": ["document", "others-config"]
          },
          {
            "title": "Control-1.4.4",
            "testingProcedure": ["1.4.4a", "1.4.4b"],
            "evidenceReference": [
              "others-dataFlowDg",
              "others-networkDiagram",
              "others-config"
            ]
          },
          {
            "title": "Control-1.4.5",
            "testingProcedure": ["1.4.5a", "1.4.5b"],
            "evidenceReference": ["others-config", "document", "interview"]
          }
        ]
      },
      {
        "id": 5,
        "title": "Sub-req-1.5",
        "controls": [
          {
            "title": "Control-1.5.1",
            "testingProcedure": ["1.5.1a", "1.5.1b"],
            "evidenceReference": [
              "interview",
              "others-configSt",
              "others-policies",
              "others-configSetting"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 2,
    "reqName": "Req-2",
    "subReq": [
      {
        "id": 1,
        "title": "Sub-req-2.1",
        "controls": [
          {
            "title": "Control-2.1.1",
            "testingProcedure": ["2.1.1"],
            "evidenceReference": ["document", "interview"]
          },
          {
            "title": "Control-2.1.2",
            "testingProcedure": ["2.1.2a", "2.1.2b"],
            "evidenceReference": ["document", "interview"]
          }
        ]
      },
      {
        "id": 2,
        "title": "Sub-req-2.2",
        "controls": [
          {
            "title": "Control-2.2.1",
            "testingProcedure": ["2.2.1a", "2.2.1b", "2.2.1c"],
            "evidenceReference": [
              "others-systemConfigSt",
              "interview",
              "others-policies&Procedures",
              "others-configSetting"
            ]
          },
          {
            "title": "Control-2.2.2",
            "testingProcedure": ["2.2.2a", "2.2.2b", "2.2.2c"],
            "evidenceReference": [
              "others-systemConfigSt",
              "document",
              "others-allObservations",
              "interview",
              "others-configFiles"
            ]
          },
          {
            "title": "Control-2.2.3",
            "testingProcedure": ["2.2.3a", "2.2.3b", "2.2.3c"],
            "evidenceReference": [
              "others-systemConfigSt",
              "others-systemConfig"
            ]
          },
          {
            "title": "Control-2.2.4",
            "testingProcedure": ["2.2.4a", "2.2.4b"],
            "evidenceReference": [
              "others-systemConfigSt",
              "others-SystemConfig"
            ]
          },
          {
            "title": "Control-2.2.5",
            "testingProcedure": ["2.2.5a", "2.2.5b"],
            "evidenceReference": [
              "interview",
              "others-systemConfigSt",
              "others-configSetting"
            ]
          },
          {
            "title": "Control-2.2.6",
            "testingProcedure": ["2.2.6a", "2.2.6b", "2.2.6c"],
            "evidenceReference": [
              "others-systemConfigSt",
              "interview",
              "others-systemConfig"
            ]
          },
          {
            "title": "Control-2.2.7",
            "testingProcedure": ["2.2.7a", "2.2.7b", "2.2.7c", "2.2.7d"],
            "evidenceReference": [
              "others-systemConfigSt",
              "others-observationOfAdminLog",
              "others-systemConfig",
              "others-systemComponentAuthSetting"
            ]
          }
        ]
      },
      {
        "id": 3,
        "title": "Sub-req-2.3",
        "controls": [
          {
            "title": "Control-2.3.1",
            "testingProcedure": ["2.3.1a", "2.3.1b", "2.3.1c"],
            "evidenceReference": [
              "interview",
              "others-policies&Procedures",
              "document",
              "others-observationOfAdminLog",
              "others-wirelessConfigSetting"
            ]
          },
          {
            "title": "Control-2.3.2",
            "testingProcedure": ["2.3.2"],
            "evidenceReference": ["document", "interview"]
          }
        ]
      }
    ]
  },
  {
    "id": 3,
    "reqName": "Req-3",
    "subReq": [
      {
        "id": 1,
        "title": "Sub-req-3.1",
        "controls": [
          {
            "title": "Control-3.1.1",
            "testingProcedure": ["3.1.1"],
            "evidenceReference": ["document", "interview"]
          },
          {
            "title": "Control-3.1.2",
            "testingProcedure": ["3.1.2a", "3.1.2b"],
            "evidenceReference": ["document", "interview"]
          }
        ]
      },
      {
        "id": 2,
        "title": "Sub-req-3.2",
        "controls": [
          {
            "title": "Control-3.2.1",
            "testingProcedure": ["3.2.1a", "3.2.1b", "3.2.1c"],
            "evidenceReference": [
              "interview",
              "others-dataRetention&Disposal",
              "others-files&SystemRecords",
              "others-observationOfMechanismUsed"
            ]
          }
        ]
      },
      {
        "id": 3,
        "title": "Sub-req-3.3",
        "controls": [
          {
            "title": "Control-3.3.1",
            "testingProcedure": ["3.3.1a", "3.3.1b"],
            "evidenceReference": [
              "document",
              "others-systemConfig",
              "others-secureDataDeletionProcess"
            ]
          },
          {
            "title": "Control-3.3.1.1",
            "testingProcedure": ["3.3.1.1"],
            "evidenceReference": ["others-dataSources"]
          },
          {
            "title": "Control-3.3.1.2",
            "testingProcedure": ["3.3.1.2"],
            "evidenceReference": ["others-dataSources"]
          },
          {
            "title": "Control-3.3.1.3",
            "testingProcedure": ["3.3.1.3"],
            "evidenceReference": []
          },
          {
            "title": "Control-3.3.2",
            "testingProcedure": ["3.3.2"],
            "evidenceReference": [
              "document",
              "others-dataStores",
              "others-systemConfig"
            ]
          },
          {
            "title": "Control-3.3.3",
            "testingProcedure": ["3.3.3a", "3.3.3b"],
            "evidenceReference": [
              "document",
              "interview",
              "others-dataStores",
              "others-systemConfig"
            ]
          }
        ]
      },
      {
        "id": 4,
        "title": "Sub-req-3.4",
        "controls": [
          {
            "title": "Control-3.4.1",
            "testingProcedure": ["3.4.1a", "3.4.1b", "3.4.1c"],
            "evidenceReference": [
              "document",
              "others-systemConfig",
              "others-displayOfPan"
            ]
          },
          {
            "title": "Control-3.4.2",
            "testingProcedure": ["3.4.2a", "3.4.2b", "3.4.2c"],
            "evidenceReference": [
              "document",
              "others-policies&Procedures",
              "others-config",
              "interview",
              "others-observations"
            ]
          }
        ]
      },
      {
        "id": 5,
        "title": "Sub-req-3.5",
        "controls": [
          {
            "title": "Control-3.5.1",
            "testingProcedure": ["3.5.1a", "3.5.1b", "3.5.1c"],
            "evidenceReference": [
              "document",
              "others-auditlogs",
              "others-dataRepositories",
              "others-implementedControls"
            ]
          },
          {
            "title": "Control-3.5.1.1",
            "testingProcedure": [
              "3.5.1.1a",
              "3.5.1.1b",
              "3.5.1.1c",
              "3.5.1.1d"
            ],
            "evidenceReference": ["document", "others-dataRepositories"]
          },
          {
            "title": "Control-3.5.1.2",
            "testingProcedure": ["3.5.1.2a", "3.5.1.2b"],
            "evidenceReference": [
              "others-encryptionProcesses",
              "document",
              "others-config",
              "others-observationsOfEncryptionProcess"
            ]
          },
          {
            "title": "Control-3.5.1.3",
            "testingProcedure": ["3.5.1.3a", "3.5.1.3b"],
            "evidenceReference": [
              "others-observationsOfAuthProcess",
              "others-systemConfig",
              "interview",
              "others-filesContainingAuthFactors"
            ]
          }
        ]
      },
      {
        "id": 6,
        "title": "Sub-req-3.6",
        "controls": [
          {
            "title": "Control-3.6.1",
            "testingProcedure": ["3.6.1"],
            "evidenceReference": ["document"]
          },
          {
            "title": "Control-3.6.1.1",
            "testingProcedure": ["3.6.1.1"],
            "evidenceReference": ["document", "interview"]
          },
          {
            "title": "Control-3.6.1.2",
            "testingProcedure": ["3.6.1.2a", "3.6.1.2b", "3.6.1.2c"],
            "evidenceReference": [
              "document",
              "others-keyStorageLocations",
              "others-systemConfig"
            ]
          },
          {
            "title": "Control-3.6.1.3",
            "testingProcedure": ["3.6.1.3"],
            "evidenceReference": ["others-userAccessList"]
          },
          {
            "title": "Control-3.6.1.4",
            "testingProcedure": ["3.6.1.4"],
            "evidenceReference": [
              "others-keyStorageLocations",
              "others-observationOfProcesses"
            ]
          }
        ]
      },
      {
        "id": 7,
        "title": "Sub-req-3.7",
        "controls": [
          {
            "id": 1,
            "title": "Control-3.7.1",
            "testingProcedure": ["3.7.1a", "3.7.1b"],
            "evidenceReference": [
              "others-policies&Procedures",
              "others-keyGeneratingMethodObservations"
            ]
          },
          {
            "title": "Control-3.7.2",
            "testingProcedure": ["3.7.2a", "3.7.2b"],
            "evidenceReference": [
              "others-policies&Procedures",
              "others-keyDistMethodObservations"
            ]
          },
          {
            "title": "Control-3.7.3",
            "testingProcedure": ["3.7.3a", "3.7.3b"],
            "evidenceReference": [
              "policies&Procedures",
              "keyStoringMethodObservations"
            ]
          },
          {
            "title": "Control-3.7.4",
            "testingProcedure": ["3.7.4a", "3.7.4b"],
            "evidenceReference": [
              "others-policies&Procedures",
              "document",
              "interview",
              "others-keyStorageLocations"
            ]
          },
          {
            "title": "Control-3.7.5",
            "testingProcedure": ["3.7.5a", "3.7.5b"],
            "evidenceReference": ["others-policies&Procedures", "interview"]
          },
          {
            "title": "Control-3.7.6",
            "testingProcedure": ["3.7.6a", "3.7.6b"],
            "evidenceReference": [
              "others-policies&Procedures",
              "interview",
              "others-observationOfProcesses"
            ]
          },
          {
            "title": "Control-3.7.7",
            "testingProcedure": ["3.7.7a", "3.7.7b"],
            "evidenceReference": [
              "document",
              "interview",
              "others-observationOfProcesses"
            ]
          },
          {
            "title": "Control-3.7.8",
            "testingProcedure": ["3.7.8a", "3.7.8b"],
            "evidenceReference": ["others-policies&Procedures", "document"]
          },
          {
            "title": "Control-3.7.9",
            "testingProcedure": ["3.7.9"],
            "evidenceReference": ["document"]
          }
        ]
      }
    ]
  },
  {
    "id": 4,
    "reqName": "Req-4",
    "subReq": [
      {
        "id": 1,
        "title": "Sub-req-4.1",
        "controls": [
          {
            "title": "Control-4.1.1",
            "testingProcedure": ["4.1.1"],
            "evidenceReference": ["document", "interview"]
          },
          {
            "title": "Control-4.1.2",
            "testingProcedure": ["4.1.2a", "4.1.2b"],
            "evidenceReference": ["document", "interview"]
          }
        ]
      },
      {
        "id": 2,
        "title": "Sub-req-4.2",
        "controls": [
          {
            "title": "Control-4.2.1",
            "testingProcedure": ["4.2.1a", "4.2.1b", "4.2.1c", "4.2.1d"],
            "evidenceReference": [
              "document",
              "interview",
              "others-systemConfig",
              "others-cardholderDataTransmissions"
            ]
          },
          {
            "title": "Control-4.2.1.1",
            "testingProcedure": ["4.2.1.1a", "4.2.1.1b"],
            "evidenceReference": [
              "document",
              "others-inventoriesOfTrustedKeys"
            ]
          },
          {
            "title": "Control-4.2.1.2",
            "testingProcedure": ["4.2.1.2"],
            "evidenceReference": ["others-systemConfig"]
          },
          {
            "title": "Control-4.2.2",
            "testingProcedure": ["4.2.2a", "4.2.2b"],
            "evidenceReference": ["document", "others-systemConfig"]
          }
        ]
      }
    ]
  },
  {
    "id": 5,
    "reqName": "Req-5",
    "subReq": [
      {
        "id": 1,
        "title": "Sub-req-5.1",
        "controls": [
          {
            "title": "Control-5.1.1",
            "testingProcedure": ["5.1.1"],
            "evidenceReference": ["document", "interview"]
          },
          {
            "title": "Control-5.1.2",
            "testingProcedure": ["5.1.2a", "5.1.2b"],
            "evidenceReference": ["document", "interview"]
          }
        ]
      },
      {
        "id": 2,
        "title": "Sub-req-5.2",
        "controls": [
          {
            "title": "Control-5.2.1",
            "testingProcedure": ["5.2.1a", "5.2.1b"],
            "evidenceReference": [
              "others-systemComponents",
              "others-periodicEvaluations"
            ]
          },
          {
            "title": "Control-5.2.2",
            "testingProcedure": ["5.2.2"],
            "evidenceReference": ["document", "others-config"]
          },
          {
            "title": "Control-5.2.3",
            "testingProcedure": ["5.2.3a", "5.2.3b", "5.2.3c"],
            "evidenceReference": [
              "others-policies&Procedures",
              "interview",
              "others-systemComponentList"
            ]
          },
          {
            "title": "Control-5.2.3.1",
            "testingProcedure": ["5.2.3.1a", "5.2.3.1b"],
            "evidenceReference": [
              "others-targetedRiskAnalysis",
              "document",
              "interview"
            ]
          }
        ]
      },
      {
        "id": 3,
        "title": "Sub-req-5.3",
        "controls": [
          {
            "title": "Control-5.3.1",
            "testingProcedure": ["5.3.1a", "5.3.1b"],
            "evidenceReference": [
              "others-malwareSolutionConfig",
              "others-allLogs",
              "others-systemComponents"
            ]
          },
          {
            "title": "Control-5.3.2",
            "testingProcedure": ["5.3.2a", "5.3.2b", "5.3.2c"],
            "evidenceReference": [
              "others-antiMalwareSolutionConfigs",
              "others-systemComponents",
              "others-allLogs",
              "others-scanResults"
            ]
          },
          {
            "title": "Control-5.3.2.1",
            "testingProcedure": ["5.3.2.1a", "5.3.2.1b"],
            "evidenceReference": [
              "others-targetedRiskAnalysis",
              "document",
              "interview"
            ]
          },
          {
            "title": "Control-5.3.3",
            "testingProcedure": ["5.3.3a", "5.3.3b", "5.3.3c"],
            "evidenceReference": [
              "others-antiMalwareSolutionConfigs",
              "others-systemComponents",
              "others-allLogs",
              "others-scanResults"
            ]
          },
          {
            "title": "Control-5.3.4",
            "testingProcedure": ["5.3.4"],
            "evidenceReference": ["others-malwareSolutionConfig"]
          },
          {
            "title": "Control-5.3.5",
            "testingProcedure": ["5.3.5a", "5.3.5b"],
            "evidenceReference": [
              "others-malwareSolutionConfig",
              "interview",
              "others-observationOfProcesses"
            ]
          }
        ]
      },
      {
        "id": 4,
        "title": "Sub-req-5.4",
        "controls": [
          {
            "title": "Control-5.4.1",
            "testingProcedure": ["5.4.1"],
            "evidenceReference": [
              "others-implementedProcesses",
              "others-mechanisms"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 6,
    "reqName": "Req-6",
    "subReq": [
      {
        "id": 1,
        "title": "Sub-req-6.1",
        "controls": [
          {
            "title": "Control-6.1.1",
            "testingProcedure": ["6.1.1"],
            "evidenceReference": ["document", "interview"]
          },
          {
            "title": "Control-6.1.2",
            "testingProcedure": ["6.1.2a", "6.1.2b"],
            "evidenceReference": ["document", "interview"]
          }
        ]
      },
      {
        "id": 2,
        "title": "Sub-req-6.2",
        "controls": [
          {
            "title": "Control-6.2.1",
            "testingProcedure": ["6.2.1"],
            "evidenceReference": ["others-softwareDevProcedures"]
          },
          {
            "title": "Control-6.2.2",
            "testingProcedure": ["6.2.2a", "6.2.2b"],
            "evidenceReference": [
              "others-softwareDevProcedures",
              "interview",
              "others-trainingRecords"
            ]
          },
          {
            "title": "Control-6.2.3",
            "testingProcedure": ["6.2.3a", "6.2.3b"],
            "evidenceReference": [
              "document",
              "interview",
              "others-evidenceOfChanges"
            ]
          },
          {
            "title": "Control-6.2.3.1",
            "testingProcedure": ["6.2.3.1a", "6.2.3.1b"],
            "evidenceReference": [
              "document",
              "interview",
              "others-evidenceOfChanges"
            ]
          },
          {
            "title": "Control-6.2.4",
            "testingProcedure": ["6.2.4"],
            "evidenceReference": ["document", "interview"]
          }
        ]
      },
      {
        "id": 3,
        "title": "Sub-req-6.3",
        "controls": [
          {
            "title": "Control-6.3.1",
            "testingProcedure": ["6.3.1a", "6.3.1b"],
            "evidenceReference": [
              "others-policies&Procedures",
              "document",
              "interview",
              "others-observationOfProcesses"
            ]
          },
          {
            "title": "Control-6.3.2",
            "testingProcedure": ["6.3.2a", "6.3.2b"],
            "evidenceReference": [
              "document",
              "interview",
              "others-softwareDoc"
            ]
          },
          {
            "title": "Control-6.3.3",
            "testingProcedure": ["6.3.3a", "6.3.3b"],
            "evidenceReference": [
              "others-policies&Procedures",
              "others-systemComponent&relatedSoftware"
            ]
          }
        ]
      },
      {
        "id": 4,
        "title": "Sub-req-6.4",
        "controls": [
          {
            "title": "Control-6.4.1",
            "testingProcedure": ["6.4.1"],
            "evidenceReference": [
              "document",
              "interview",
              "others-auditLogs",
              "others-recordsOfApplicationSecurityAssessments",
              "others-systemConfigSettings"
            ]
          },
          {
            "title": "Control-6.4.2",
            "testingProcedure": ["6.4.2"],
            "evidenceReference": [
              "interview",
              "others-auditLogs",
              "others-systemConfigSettings"
            ]
          },
          {
            "title": "Control-6.4.3",
            "testingProcedure": ["6.4.3a", "6.4.3b"],
            "evidenceReference": [
              "others-policies&Procedures",
              "others-inventory",
              "others-systemConfig"
            ]
          }
        ]
      },
      {
        "id": 5,
        "title": "Sub-req-6.5",
        "controls": [
          {
            "title": "Control-6.5.1",
            "testingProcedure": ["6.5.1a", "6.5.1b"],
            "evidenceReference": [
              "document",
              "others-changeControlDoc",
              "others-recentChangesToSystem"
            ]
          },
          {
            "title": "Control-6.5.2",
            "testingProcedure": ["6.5.2"],
            "evidenceReference": [
              "document",
              "interview",
              "others-affectedSystemNetworks"
            ]
          },
          {
            "title": "Control-6.5.3",
            "testingProcedure": ["6.5.3a", "6.5.3b", "6.5.3c"],
            "evidenceReference": [
              "others-policies&Procedures",
              "others-config",
              "others-networkDoc",
              "others-accessControlSettings"
            ]
          },
          {
            "title": "Control-6.5.4",
            "testingProcedure": ["6.5.4a", "6.5.4b"],
            "evidenceReference": [
              "others-policies&Procedures",
              "interview",
              "others-processes"
            ]
          },
          {
            "title": "Control-6.5.5",
            "testingProcedure": ["6.5.5a", "6.5.5b", "6.5.5c"],
            "evidenceReference": [
              "others-policies&Procedures",
              "interview",
              "others-testingProcedures",
              "others-preproductionTestData"
            ]
          },
          {
            "title": "Control-6.5.6",
            "testingProcedure": ["6.5.6a", "6.5.6b", "6.5.6c"],
            "evidenceReference": [
              "others-policies&Procedures",
              "interview",
              "others-testingProcedures",
              "others-allAccounts",
              "others-data"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 7,
    "reqName": "Req-7",
    "subReq": [
      {
        "id": 1,
        "title": "Sub-req-7.1",
        "controls": [
          {
            "title": "Control-7.1.1",
            "testingProcedure": ["7.1.1"],
            "evidenceReference": ["document", "interview"]
          },
          {
            "title": "Control-7.1.2",
            "testingProcedure": ["7.1.2a", "7.1.2b"],
            "evidenceReference": ["document", "interview"]
          }
        ]
      },
      {
        "id": 2,
        "title": "Sub-req-7.2",
        "controls": [
          {
            "title": "Control-7.2.1",
            "testingProcedure": ["7.2.1a", "7.2.1b"],
            "evidenceReference": [
              "document",
              "interview",
              "others-accessControlModelSettings"
            ]
          },
          {
            "title": "Control-7.2.2",
            "testingProcedure": ["7.2.2a", "7.2.2b", "7.2.2c"],
            "evidenceReference": [
              "others-policies&Procedures",
              "interview",
              "others-accessSettings"
            ]
          },
          {
            "title": "Control-7.2.3",
            "testingProcedure": ["7.2.3"],
            "evidenceReference": [
              "document",
              "others-policies&Procedures",
              "others-userIDs&AssignedPrivileges"
            ]
          },
          {
            "title": "Control-7.2.4",
            "testingProcedure": ["7.2.4a", "7.2.4b"],
            "evidenceReference": [
              "others-policies&Procedures",
              "document",
              "interview"
            ]
          },
          {
            "title": "Control-7.2.5",
            "testingProcedure": ["7.2.5a", "7.2.5b"],
            "evidenceReference": [
              "others-policies&Procedures",
              "interview",
              "others-privilegesWithSystem&ApplicationAccounts"
            ]
          },
          {
            "title": "Control-7.2.5.1",
            "testingProcedure": ["7.2.5.1a", "7.2.5.1b", "7.2.5.1c"],
            "evidenceReference": [
              "others-policies&Procedures",
              "others-targetedRiskAnalysis",
              "document",
              "interview"
            ]
          },
          {
            "title": "Control-7.2.6",
            "testingProcedure": ["7.2.6a", "7.2.6b"],
            "evidenceReference": [
              "interview",
              "others-policies&Procedures",
              "others-configSetting"
            ]
          }
        ]
      },
      {
        "id": 3,
        "title": "Sub-req-7.3",
        "controls": [
          {
            "title": "Control-7.3.1",
            "testingProcedure": ["7.3.1"],
            "evidenceReference": ["document", "others-systemSettings"]
          },
          {
            "title": "Control-7.3.2",
            "testingProcedure": ["7.3.2"],
            "evidenceReference": ["document", "others-systemSettings"]
          },
          {
            "title": "Control-7.3.3",
            "testingProcedure": ["7.3.3"],
            "evidenceReference": ["document", "others-systemSettings"]
          }
        ]
      }
    ]
  },
  {
    "id": 8,
    "reqName": "Req-8",
    "subReq": [
      {
        "id": 1,
        "title": "Sub-req-8.1",
        "controls": [
          {
            "title": "Control-8.1.1",
            "testingProcedure": ["8.1.1"],
            "evidenceReference": ["document", "interview"]
          },
          {
            "title": "Control-8.1.2",
            "testingProcedure": ["8.1.2a", "8.1.2b"],
            "evidenceReference": ["document", "interview"]
          }
        ]
      },
      {
        "id": 2,
        "title": "Sub-req-8.2",
        "controls": [
          {
            "title": "Control-8.2.1",
            "testingProcedure": ["8.2.1a", "8.2.1b"],
            "evidenceReference": [
              "interview",
              "others-auditLogs",
              "others-otherEvidence"
            ]
          },
          {
            "title": "Control-8.2.2",
            "testingProcedure": ["8.2.2a", "8.2.2b", "8.2.2c"],
            "evidenceReference": [
              "document",
              "others-userAccountLists",
              "others-policies&Procedures",
              "interview"
            ]
          },
          {
            "title": "Control-8.2.3",
            "testingProcedure": ["8.2.3"],
            "evidenceReference": ["interview", "others-policies&Procedures"]
          },
          {
            "title": "Control-8.2.4",
            "testingProcedure": ["8.2.4"],
            "evidenceReference": ["document", "others-systemSettings"]
          },
          {
            "title": "Control-8.2.5",
            "testingProcedure": ["8.2.5a", "8.2.5b"],
            "evidenceReference": [
              "others-currentUserAccessLists",
              "others-informationSources",
              "interview"
            ]
          },
          {
            "title": "Control-8.2.6",
            "testingProcedure": ["8.2.6"],
            "evidenceReference": [
              "interview",
              "others-userAccounts&LastLoginInfo"
            ]
          },
          {
            "title": "Control-8.2.7",
            "testingProcedure": ["8.2.7"],
            "evidenceReference": [
              "document",
              "interview",
              "others-otherEvidence"
            ]
          },
          {
            "title": "Control-8.2.8",
            "testingProcedure": ["8.2.8"],
            "evidenceReference": ["others-systemConfigSettings"]
          }
        ]
      },
      {
        "id": 3,
        "title": "Sub-req-8.3",
        "controls": [
          {
            "title": "Control-8.3.1",
            "testingProcedure": ["8.3.1a", "8.3.1b"],
            "evidenceReference": ["document", "others-typesOfAuthFactorsUsed"]
          },
          {
            "title": "Control-8.3.2",
            "testingProcedure": ["8.3.2a", "8.3.2b", "8.3.2c"],
            "evidenceReference": [
              "document",
              "others-systemConfigSettings",
              "others-repositoriesOfAuthFactors",
              "others-dataTransmission"
            ]
          },
          {
            "title": "Control-8.3.3",
            "testingProcedure": ["8.3.3"],
            "evidenceReference": [
              "others-observationOfSecurtiyPersonnel",
              "others-procedures"
            ]
          },
          {
            "title": "Control-8.3.4",
            "testingProcedure": ["8.3.4a", "8.3.4b"],
            "evidenceReference": ["others-systemConfigSettings"]
          },
          {
            "title": "Control-8.3.5",
            "testingProcedure": ["8.3.5"],
            "evidenceReference": [
              "others-observationOfSecurityPersonnel",
              "others-procedures"
            ]
          },
          {
            "title": "Control-8.3.6",
            "testingProcedure": ["8.3.6"],
            "evidenceReference": ["others-systemConfigSettings"]
          },
          {
            "title": "Control-8.3.7",
            "testingProcedure": ["8.3.7"],
            "evidenceReference": ["others-systemConfigSettings"]
          },
          {
            "title": "Control-8.3.8",
            "testingProcedure": ["8.3.8a", "8.3.8b", "8.3.8c"],
            "evidenceReference": [
              "interview",
              "others-procedures",
              "others-authPolicies&Procedures"
            ]
          },
          {
            "title": "Control-8.3.9",
            "testingProcedure": ["8.3.9"],
            "evidenceReference": ["other-systemConfigSettings"]
          },
          {
            "title": "Control-8.3.10",
            "testingProcedure": ["8.3.10"],
            "evidenceReference": ["others-guidenceProvidedToCustomerUsers"]
          },
          {
            "title": "Control-8.3.10.1",
            "testingProcedure": ["8.3.10.1"],
            "evidenceReference": ["others-systemConfigSettings"]
          },
          {
            "title": "Control-8.3.11",
            "testingProcedure": ["8.3.11a", "8.3.11b", "8.3.11c"],
            "evidenceReference": [
              "others-authPolicies&Procedures",
              "interview",
              "others-physicalControls",
              "others-systemConfigSettings"
            ]
          }
        ]
      },
      {
        "id": 4,
        "title": "Sub-req-8.4",
        "controls": [
          {
            "title": "Control-8.4.1",
            "testingProcedure": ["8.4.1a", "8.4.1b"],
            "evidenceReference": [
              "others-networkSystemConfig",
              "others-adminPersonnelLoggingInCDE "
            ]
          },
          {
            "title": "Control-8.4.2",
            "testingProcedure": ["8.4.2a", "8.4.2b"],
            "evidenceReference": [
              "others-networkSystemConfig",
              "others-additionalEvidence",
              "others-personnelLoggingInCDE"
            ]
          },
          {
            "title": "Control-8.4.3",
            "testingProcedure": ["8.4.3a", "8.4.3b"],
            "evidenceReference": [
              "others-networkSystemConfig",
              "others-personnelConnectRemotelyToNetwork"
            ]
          }
        ]
      },
      {
        "id": 5,
        "title": "Sub-req-8.5",
        "controls": [
          {
            "title": "Control-8.5.1",
            "testingProcedure": ["8.5.1a", "8.5.1b", "8.5.1c", "8.5.1d"],
            "evidenceReference": [
              "document",
              "others-systemConfig",
              "interview",
              "others-observationOfProcesses"
            ]
          }
        ]
      },
      {
        "id": 6,
        "title": "Sub-req-8.6",
        "controls": [
          {
            "title": "Control-8.6.1",
            "testingProcedure": ["8.6.1"],
            "evidenceReference": [
              "interview",
              "others-application&SystemAccounts"
            ]
          },
          {
            "title": "Control-8.6.2",
            "testingProcedure": ["8.6.2a", "8.6.2b"],
            "evidenceReference": [
              "interview",
              "others-systemDevProcedures",
              "others-scriptsConfigBespokeCustomSourceCode"
            ]
          },
          {
            "title": "Control-8.6.3",
            "testingProcedure": ["8.6.3a", "8.6.3b", "8.6.3c"],
            "evidenceReference": [
              "others-policies&Procedures",
              "others-targetedRiskAnalysis",
              "interview",
              "others-systemConfigSettings"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 9,
    "reqName": "Req-9",
    "subReq": [
      {
        "id": 1,
        "title": "Sub-req-9.1",
        "controls": [
          {
            "title": "Control-9.1.1",
            "testingProcedure": ["9.1.1"],
            "evidenceReference": ["document", "interview"]
          },
          {
            "title": "Control-9.1.2",
            "testingProcedure": ["9.1.2a", "9.1.2b"],
            "evidenceReference": ["document", "interview"]
          }
        ]
      },
      {
        "id": 2,
        "title": "Sub-req-9.2",
        "controls": [
          {
            "title": "Control-9.2.1",
            "testingProcedure": ["9.2.1"],
            "evidenceReference": ["interview", "others-entryControls"]
          },
          {
            "title": "Control-9.2.1.1",
            "testingProcedure": ["9.2.1.1a", "9.2.1.1b", "9.2.1.1c"],
            "evidenceReference": [
              "others-physicalAccesstoSensitiveAreasInCDE",
              "others-physicalAccesstoCDE",
              "interview",
              "others-physicalAccessControlMechanism",
              "others-videoCamera"
            ]
          },
          {
            "title": "Control-9.2.2",
            "testingProcedure": ["9.2.2"],
            "evidenceReference": [
              "interview",
              "others-publicAccessibleNetworkJackLocations"
            ]
          },
          {
            "title": "Control-9.2.3",
            "testingProcedure": ["9.2.3"],
            "evidenceReference": [
              "interview",
              "others-locationOfHardwareLines"
            ]
          },
          {
            "title": "Control-9.2.4",
            "testingProcedure": ["9.2.4"],
            "evidenceReference": ["others-systemAdminLoginSensitiveAreas"]
          }
        ]
      },
      {
        "id": 3,
        "title": "Sub-req-9.3",
        "controls": [
          {
            "title": "Control-9.3.1",
            "testingProcedure": ["9.3.1a", "9.3.1b", "9.3.1c"],
            "evidenceReference": [
              "document",
              "others-IdentifyMethods&Processes",
              "others-observationOfProcesses"
            ]
          },
          {
            "title": "Control-9.3.1.1",
            "testingProcedure": ["9.3.1.1a", "9.3.1.1b", "9.3.1.1c"],
            "evidenceReference": [
              "interview",
              "others-personnelInSensitiveAreas",
              "others-physicalAccessControlLists",
              "others-observationOfProcesses"
            ]
          },
          {
            "title": "Control-9.3.2",
            "testingProcedure": [
              "9.3.2a",
              "9.3.2b",
              "9.3.2c",
              "9.3.2d",
              "9.3.2e"
            ],
            "evidenceReference": [
              "document",
              "interview",
              "others-visitorPresentInCDEObservations",
              "others-useOfVisitorBadge"
            ]
          },
          {
            "title": "Control-9.3.3",
            "testingProcedure": ["9.3.3"],
            "evidenceReference": [
              "interview",
              "others-observationOfVisitorsLeaving"
            ]
          },
          {
            "title": "Control-9.3.4",
            "testingProcedure": ["9.3.4a", "9.3.4b", "9.3.4c"],
            "evidenceReference": [
              "interview",
              "others-visitorLogs",
              "others-visitorLogStorageLocation"
            ]
          }
        ]
      },
      {
        "id": 4,
        "title": "Sub-req-9.4",
        "controls": [
          {
            "title": "Control-9.4.1",
            "testingProcedure": ["9.4.1"],
            "evidenceReference": ["document"]
          },
          {
            "title": "Control-9.4.1.1",
            "testingProcedure": ["9.4.1.1a", "9.4.1.1b"],
            "evidenceReference": ["document", "interview"]
          },
          {
            "title": "Control-9.4.1.2",
            "testingProcedure": ["9.4.1.2a", "9.4.1.2b"],
            "evidenceReference": ["document", "interview"]
          },
          {
            "title": "Control-9.4.2",
            "testingProcedure": ["9.4.2a", "9.4.2b"],
            "evidenceReference": ["document", "others-mediaLogs"]
          },
          {
            "title": "Control-9.4.3",
            "testingProcedure": ["9.4.3a", "9.4.3b", "9.4.3c"],
            "evidenceReference": [
              "document-document",
              "interview",
              "others-allRecordsExamined",
              "others-offsiteTrackingLogs"
            ]
          },
          {
            "title": "Control-9.4.4",
            "testingProcedure": ["9.4.4a", "9.4.4b"],
            "evidenceReference": [
              "document",
              "interview",
              "others-offsiteMediaTrackingLogs"
            ]
          },
          {
            "title": "Control-9.4.5",
            "testingProcedure": ["9.4.5"],
            "evidenceReference": [
              "document",
              "interview",
              "others-electronicMediaInventoryLogs"
            ]
          },
          {
            "title": "Control-9.4.5.1",
            "testingProcedure": ["9.4.5.1a", "9.4.5.1b"],
            "evidenceReference": [
              "document",
              "interview",
              "others-electronicMediaInventoryLogs"
            ]
          },
          {
            "title": "Control-9.4.6",
            "testingProcedure": ["9.4.6a", "9.4.6b", "9.4.6c"],
            "evidenceReference": [
              "others-periodicMediaDesctructionPolicy",
              "interview",
              "others-ObservationOfProcesses",
              "others-destructionOfContainerObservations "
            ]
          },
          {
            "title": "Control-9.4.7",
            "testingProcedure": ["9.4.7a", "9.4.7b"],
            "evidenceReference": [
              "others-periodicMediaDestructionPolicy",
              "interview",
              "others-mediaDestructionProcessObservation"
            ]
          }
        ]
      },
      {
        "id": 5,
        "title": "Sub-req-9.5",
        "controls": [
          {
            "title": "Control-9.5.1",
            "testingProcedure": ["9.5.1"],
            "evidenceReference": ["others-policies&Procedures"]
          },
          {
            "title": "Control-9.5.1.1",
            "testingProcedure": ["9.5.1.1a", "9.5.1.1b", "9.5.1.1c"],
            "evidenceReference": [
              "others-POIdevicesExamined",
              "others-POIdevicesObservations",
              "interview"
            ]
          },
          {
            "title": "Control-9.5.1.2",
            "testingProcedure": ["9.5.1.2"],
            "evidenceReference": [
              "document",
              "interview",
              "others-inspectionOfProcesses"
            ]
          },
          {
            "title": "Control-9.5.1.2.1",
            "testingProcedure": ["9.5.1.2.1a", "9.5.1.2.1b"],
            "evidenceReference": [
              "others-targetedRiskAnalysis",
              "document",
              "interview"
            ]
          },
          {
            "title": "Control-9.5.1.3",
            "testingProcedure": ["9.5.1.3a", "9.5.1.3b"],
            "evidenceReference": ["others-trainingMaterial", "interview"]
          }
        ]
      }
    ]
  },
  {
    "id": 10,
    "reqName": "Req-10",
    "subReq": [
      {
        "id": 1,
        "title": "Sub-req-10.1",
        "controls": [
          {
            "title": "Control-10.1.1",
            "testingProcedure": ["10.1.1"],
            "evidenceReference": ["document", "interview"]
          },
          {
            "title": "Control-10.1.2",
            "testingProcedure": ["10.1.2a", "10.1.2b"],
            "evidenceReference": ["document", "interview"]
          }
        ]
      },
      {
        "id": 2,
        "title": "Sub-req-10.2",
        "controls": [
          {
            "title": "Control-10.2.1",
            "testingProcedure": ["10.2.1"],
            "evidenceReference": ["interview", "others-systemConfig"]
          },
          {
            "title": "Control-10.2.1.1",
            "testingProcedure": ["10.2.1.1"],
            "evidenceReference": [
              "others-allAuditLogConfigs",
              "others-logData"
            ]
          },
          {
            "title": "Control-10.2.1.2",
            "testingProcedure": ["10.2.1.2"],
            "evidenceReference": [
              "others-allAuditLogConfigs",
              "others-logData"
            ]
          },
          {
            "title": "Control-10.2.1.3",
            "testingProcedure": ["10.2.1.3"],
            "evidenceReference": [
              "others-allAuditLogConfigs",
              "others-logData"
            ]
          },
          {
            "title": "Control-10.2.1.4",
            "testingProcedure": ["10.2.1.4"],
            "evidenceReference": [
              "others-allAuditLogConfigs",
              "others-logData"
            ]
          },
          {
            "title": "Control-10.2.1.5",
            "testingProcedure": ["10.2.1.5"],
            "evidenceReference": [
              "others-allAuditLogConfigs",
              "others-logData"
            ]
          },
          {
            "title": "Control-10.2.1.6",
            "testingProcedure": ["10.2.1.6"],
            "evidenceReference": [
              "others-allAuditLogConfigs",
              "others-logData"
            ]
          },
          {
            "title": "Control-10.2.1.7",
            "testingProcedure": ["10.2.1.7"],
            "evidenceReference": [
              "others-allAuditLogConfigs",
              "others-logData"
            ]
          },
          {
            "title": "Control-10.2.2",
            "testingProcedure": ["10.2.2"],
            "evidenceReference": [
              "interview",
              "others-allAuditLogConfigs",
              "others-logData"
            ]
          }
        ]
      },
      {
        "id": 3,
        "title": "Sub-req-10.3",
        "controls": [
          {
            "title": "Control-10.3.1",
            "testingProcedure": ["10.3.1"],
            "evidenceReference": [
              "interview",
              "others-systemConfigs&Privileges"
            ]
          },
          {
            "title": "Control-10.3.2",
            "testingProcedure": ["10.3.2"],
            "evidenceReference": [
              "interview",
              "others-systemConfigs&Privileges"
            ]
          },
          {
            "title": "Control-10.3.3",
            "testingProcedure": ["10.3.3"],
            "evidenceReference": ["others-backupConfigsLogFiles"]
          },
          {
            "title": "Control-10.3.4",
            "testingProcedure": ["10.3.4"],
            "evidenceReference": [
              "others-allMonitoredFiles",
              "others-monitoringActivitesResults",
              "others-systemSettings"
            ]
          }
        ]
      },
      {
        "id": 4,
        "title": "Sub-req-10.4",
        "controls": [
          {
            "title": "Control-10.4.1",
            "testingProcedure": ["10.4.1a", "10.4.1b"],
            "evidenceReference": [
              "others-policies&Procedures",
              "interview",
              "others-observationOfProcesses"
            ]
          },
          {
            "title": "Control-10.4.1.1",
            "testingProcedure": ["10.4.1.1"],
            "evidenceReference": ["interview", "others-logReviewMechanism"]
          },
          {
            "title": "Control-10.4.2",
            "testingProcedure": ["10.4.2a", "10.4.2b"],
            "evidenceReference": [
              "others-policies&Procedures",
              "document",
              "interview"
            ]
          },
          {
            "title": "Control-10.4.2.1",
            "testingProcedure": ["10.4.2.1a", "10.4.2.1b"],
            "evidenceReference": [
              "others-targetedRiskAnalysis",
              "document",
              "interview"
            ]
          },
          {
            "title": "Control-10.4.3",
            "testingProcedure": ["10.4.3a", "10.4.3b"],
            "evidenceReference": [
              "others-policies&Procedures",
              "interview",
              "others-observationOfProcesses"
            ]
          }
        ]
      },
      {
        "id": 5,
        "title": "Sub-req-10.5",
        "controls": [
          {
            "title": "Control-10.5.1",
            "testingProcedure": ["10.5.1a", "10.5.1b", "10.5.1c"],
            "evidenceReference": [
              "document",
              "interview",
              "others-allAuditLogs",
              "others-config",
              "others-observationOfProcesses"
            ]
          }
        ]
      },
      {
        "id": 6,
        "title": "Sub-req-10.6",
        "controls": [
          {
            "title": "Control-10.6.1",
            "testingProcedure": ["10.6.1"],
            "evidenceReference": ["others-systemConfigSettings"]
          },
          {
            "title": "Control-10.6.2",
            "testingProcedure": ["10.6.2"],
            "evidenceReference": ["others-systemConfigSettings"]
          },
          {
            "title": "Control-10.6.3",
            "testingProcedure": ["10.6.3a", "10.6.3b"],
            "evidenceReference": [
              "others-systemConfig&TimeSyncSetting",
              "others-allLogs",
              "others-observationOfProcesses",
              "others-systemConfigSyncSetting"
            ]
          }
        ]
      },
      {
        "id": 7,
        "title": "Sub-req-10.7",
        "controls": [
          {
            "title": "Control-10.7.1",
            "testingProcedure": ["10.7.1a", "10.7.1b"],
            "evidenceReference": [
              "document",
              "interview",
              "others-detection&alertingProcessObservation"
            ]
          },
          {
            "title": "Control-10.7.2",
            "testingProcedure": ["10.7.2a", "10.7.2b"],
            "evidenceReference": [
              "document",
              "interview",
              "others-detection&alertingProcessObservation"
            ]
          },
          {
            "title": "Control-10.7.3",
            "testingProcedure": ["10.7.3a", "10.7.3b"],
            "evidenceReference": ["document", "interview"]
          }
        ]
      }
    ]
  },
  {
    "id": 11,
    "reqName": "Req-11",
    "subReq": [
      {
        "id": 1,
        "title": "Sub-req-11.1",
        "controls": [
          {
            "title": "Control-11.1.1",
            "testingProcedure": ["11.1.1"],
            "evidenceReference": ["document", "interview"]
          },
          {
            "title": "Control-11.1.2",
            "testingProcedure": ["11.1.2a", "11.1.2b"],
            "evidenceReference": ["document", "interview"]
          }
        ]
      },
      {
        "id": 2,
        "title": "Sub-req-11.2",
        "controls": [
          {
            "title": "Control-11.2.1",
            "testingProcedure": ["11.2.1a", "11.2.1b", "11.2.1c", "11.2.1d"],
            "evidenceReference": [
              "others-policies&Procedures",
              "document",
              "interview",
              "others-wirelessAssessmentResults"
            ]
          },
          {
            "title": "Control-11.2.2",
            "testingProcedure": ["11.2.2"],
            "evidenceReference": ["document"]
          }
        ]
      },
      {
        "id": 3,
        "title": "Sub-req-11.3",
        "controls": [
          {
            "title": "Control-11.3.1",
            "testingProcedure": ["11.3.1a", "11.3.1b", "11.3.1c", "11.3.1d"],
            "evidenceReference": [
              "others-internalScanReportResults",
              "interview",
              "others-scanToolConfig"
            ]
          },
          {
            "title": "Control-11.3.1.1",
            "testingProcedure": ["11.3.1.1a", "11.3.1.1b"],
            "evidenceReference": [
              "others-targetedRiskAnalysis",
              "document",
              "interview"
            ]
          },
          {
            "title": "Control-11.3.1.2",
            "testingProcedure": [
              "11.3.1.2a",
              "11.3.1.2b",
              "11.3.1.2c",
              "11.3.1.2d"
            ],
            "evidenceReference": [
              "others-scanConfig",
              "interview",
              "others-examineScanReportResults",
              "others-account"
            ]
          },
          {
            "title": "Control-11.3.1.3",
            "testingProcedure": ["11.3.1.3a", "11.3.1.3b", "11.3.1.3c"],
            "evidenceReference": [
              "document",
              "others-internalScanReports",
              "interview",
              "others-internalScan&RescanReports"
            ]
          },
          {
            "title": "Control-11.3.2",
            "testingProcedure": ["11.3.2a", "11.3.2b", "11.3.2c"],
            "evidenceReference": [
              "others-asvScanReports",
              "others-asvScanReportResults"
            ]
          },
          {
            "title": "Control-11.3.2.1",
            "testingProcedure": ["11.3.2.1a", "11.3.2.1b", "11.3.2.1c"],
            "evidenceReference": [
              "document",
              "others-externalScanReports",
              "interview",
              "others-externalScan&RescanReports"
            ]
          }
        ]
      },
      {
        "id": 4,
        "title": "Sub-req-11.4",
        "controls": [
          {
            "title": "Control-11.4.1",
            "testingProcedure": ["11.4.1"],
            "evidenceReference": ["document", "interview"]
          },
          {
            "title": "Control-11.4.2",
            "testingProcedure": ["11.4.2a", "11.4.2b"],
            "evidenceReference": [
              "others-recentInternalPenetrationTesting",
              "others-scopeOfWork",
              "interview"
            ]
          },
          {
            "title": "Control-11.4.3",
            "testingProcedure": ["11.4.3a", "11.4.3b"],
            "evidenceReference": [
              "others-recentExternalPenetrationTesting",
              "others-scopeOfWork",
              "interview"
            ]
          },
          {
            "title": "Control-11.4.4",
            "testingProcedure": ["11.4.4"],
            "evidenceReference": ["others-allPenetrationTestingResults"]
          },
          {
            "title": "Control-11.4.5",
            "testingProcedure": ["11.4.5a", "11.4.5b", "11.4.5c"],
            "evidenceReference": [
              "others-penetrationTestingMethodology",
              "others-segmentControls",
              "others-recentPenetrationTestResults",
              "interview"
            ]
          },
          {
            "title": "Control-11.4.6",
            "testingProcedure": ["11.4.6a", "11.4.6b"],
            "evidenceReference": [
              "others-recentPenetrationTestResults",
              "interview"
            ]
          },
          {
            "title": "Control-11.4.7",
            "testingProcedure": ["11.4.7"],
            "evidenceReference": ["others-allEvidence"]
          }
        ]
      },
      {
        "id": 5,
        "title": "Sub-req-11.5",
        "controls": [
          {
            "title": "Control-11.5.1",
            "testingProcedure": ["11.5.1a", "11.5.1b", "11.5.1c"],
            "evidenceReference": [
              "others-networkDiagram",
              "others-systemConfig",
              "interview",
              "others-vendorDocument"
            ]
          },
          {
            "title": "Control-11.5.1.1",
            "testingProcedure": ["11.5.1.1a", "11.5.1.1b", "11.5.1.1c"],
            "evidenceReference": [
              "configSetting",
              "document",
              "others-incidentResponsePlan",
              "interview",
              "others-observationOfProcesses"
            ]
          },
          {
            "title": "Control-11.5.2",
            "testingProcedure": ["11.5.2a", "11.5.2b"],
            "evidenceReference": [
              "others-monitoredFiles",
              "others-monitoringActivitiesResults",
              "others-systemSettings",
              "others-changeDetectionSettings"
            ]
          }
        ]
      },
      {
        "id": 6,
        "title": "Sub-req-11.6",
        "controls": [
          {
            "title": "Control-11.6.1",
            "testingProcedure": ["11.6.1a", "11.6.1b", "11.6.1c", "11.6.1d"],
            "evidenceReference": [
              "others-monitoringActivitiesResults",
              "others-monitoringActivitites",
              "others-systemSettings",
              "others-configSetting",
              "others-targetedRiskAnalysis"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": 12,
    "reqName": "Req-12",
    "subReq": [
      {
        "id": 1,
        "title": "Sub-req-12.1",
        "controls": [
          {
            "title": "Control-12.1.1",
            "testingProcedure": ["12.1.1"],
            "evidenceReference": [
              "interview",
              "others-informationSecurityPolicy"
            ]
          },
          {
            "title": "Control-12.1.2",
            "testingProcedure": ["12.1.2"],
            "evidenceReference": [
              "interview",
              "others-informationSecurityPolicy"
            ]
          },
          {
            "title": "Control-12.1.3",
            "testingProcedure": ["12.1.3"],
            "evidenceReference": [
              "document",
              "interview",
              "others-informationSecurityPolicy"
            ]
          },
          {
            "title": "Control-12.1.4",
            "testingProcedure": ["12.1.4"],
            "evidenceReference": ["others-informationSecurityPolicy"]
          }
        ]
      },
      {
        "id": 2,
        "title": "Sub-req-12.2",
        "controls": [
          {
            "title": "Control-12.2.1",
            "testingProcedure": ["12.2.1"],
            "evidenceReference": ["interview", "others-acceptableUsePolicies"]
          }
        ]
      },
      {
        "id": 3,
        "title": "Sub-req-12.3",
        "controls": [
          {
            "title": "Control-12.3.1",
            "testingProcedure": ["12.3.1"],
            "evidenceReference": ["document"]
          },
          {
            "title": "Control-12.3.2",
            "testingProcedure": ["12.3.2"],
            "evidenceReference": ["document"]
          },
          {
            "title": "Control-12.3.3",
            "testingProcedure": ["12.3.3"],
            "evidenceReference": ["document", "interview"]
          },
          {
            "title": "Control-12.3.4",
            "testingProcedure": ["12.3.4"],
            "evidenceReference": []
          }
        ]
      },
      {
        "id": 4,
        "title": "Sub-req-12.4",
        "controls": [
          {
            "title": "Control-12.4.1",
            "testingProcedure": ["12.4.1"],
            "evidenceReference": []
          },
          {
            "title": "Control-12.4.2",
            "testingProcedure": ["12.4.2a", "12.4.2b"],
            "evidenceReference": [
              "others-policies&Procedures",
              "interview",
              "others-recordsOfReviews"
            ]
          },
          {
            "title": "Control-12.4.2.1",
            "testingProcedure": ["12.4.2.1"],
            "evidenceReference": ["document"]
          }
        ]
      },
      {
        "id": 5,
        "title": "Sub-req-12.5",
        "controls": [
          {
            "title": "Control-12.5.1",
            "testingProcedure": ["12.5.1a", "12.5.1b"],
            "evidenceReference": ["others-inventory", "interview"]
          },
          {
            "title": "Control-12.5.2",
            "testingProcedure": ["12.5.2a", "12.5.2b"],
            "evidenceReference": ["document", "interview"]
          },
          {
            "title": "Control-12.5.2.1",
            "testingProcedure": ["12.5.2.1a", "12.5.2.1b"],
            "evidenceReference": ["document", "interview"]
          },
          {
            "title": "Control-12.5.3",
            "testingProcedure": ["12.5.3a", "12.5.3b"],
            "evidenceReference": [
              "others-policies&Procedures",
              "document",
              "interview"
            ]
          }
        ]
      },
      {
        "id": 6,
        "title": "Sub-req-12.6",
        "controls": [
          {
            "title": "Control-12.6.1",
            "testingProcedure": ["12.6.1"],
            "evidenceReference": ["others-securityAwarenessProgram"]
          },
          {
            "title": "Control-12.6.2",
            "testingProcedure": ["12.6.2"],
            "evidenceReference": [
              "interview",
              "others-evidenceOfReviews",
              "others-securityAwarenessProgramContent"
            ]
          },
          {
            "title": "Control-12.6.3",
            "testingProcedure": ["12.6.3a", "12.6.3b", "12.6.3c", "12.6.3d"],
            "evidenceReference": [
              "others-securityAwarenessProgramRecords",
              "others-securityAwarenessProgramMaterials",
              "interviews"
            ]
          },
          {
            "title": "Control-12.6.3.1",
            "testingProcedure": ["12.6.3.1"],
            "evidenceReference": ["others-securityAwarenessTrainingContent"]
          },
          {
            "title": "Control-12.6.3.2",
            "testingProcedure": ["12.6.3.2"],
            "evidenceReference": ["others-securityAwarenessTrainingContent"]
          }
        ]
      },
      {
        "id": 7,
        "title": "Sub-req-12.7",
        "controls": [
          {
            "title": "Control-12.7.1",
            "testingProcedure": ["12.7.1"],
            "evidenceReference": ["interview"]
          }
        ]
      },
      {
        "id": 8,
        "title": "Sub-req-12.8",
        "controls": [
          {
            "title": "Control-12.8.1",
            "testingProcedure": ["12.8.1a", "12.8.1b"],
            "evidenceReference": ["others-policies&Procedures", "document"]
          },
          {
            "title": "Control-12.8.2",
            "testingProcedure": ["12.8.2a", "12.8.2b"],
            "evidenceReference": [
              "others-policies&Procedures",
              "others-writtenAgreements"
            ]
          },
          {
            "title": "Control-12.8.3",
            "testingProcedure": ["12.8.3a", "12.8.3b"],
            "evidenceReference": [
              "others-policies&Procedures",
              "interview",
              "others-allEvidence"
            ]
          },
          {
            "title": "Control-12.8.4",
            "testingProcedure": ["12.8.4a", "12.8.4b"],
            "evidenceReference": [
              "others-policies&Procedures",
              "document",
              "interview"
            ]
          },
          {
            "title": "Control-12.8.5",
            "testingProcedure": ["12.8.5a", "12.8.5b"],
            "evidenceReference": [
              "others-policies&Procedures",
              "documentation",
              "interview"
            ]
          }
        ]
      },
      {
        "id": 9,
        "title": "Sub-req-12.9",
        "controls": [
          {
            "title": "Control-12.9.1",
            "testingProcedure": ["12.9.1"],
            "evidenceReference": ["others-tpspPolicies"]
          },
          {
            "title": "Control-12.9.2",
            "testingProcedure": ["12.9.2"],
            "evidenceReference": ["others-policies&Procedures"]
          }
        ]
      },
      {
        "id": 10,
        "title": "Sub-req-12.10",
        "controls": [
          {
            "title": "Control-12.10.1",
            "testingProcedure": ["12.10.1a", "12.10.1b"],
            "evidenceReference": [
              "others-incidentResponsePlan",
              "document",
              "interview"
            ]
          },
          {
            "title": "Control-12.10.2",
            "testingProcedure": ["12.10.2"],
            "evidenceReference": ["document", "interview"]
          },
          {
            "title": "Control-12.10.3",
            "testingProcedure": ["12.10.3"],
            "evidenceReference": ["document", "interview"]
          },
          {
            "title": "Control-12.10.4",
            "testingProcedure": ["12.10.4"],
            "evidenceReference": ["document", "interview"]
          },
          {
            "title": "Control-12.10.4.1",
            "testingProcedure": ["12.10.4.1a", "12.10.4.1b"],
            "evidenceReference": [
              "others-entitysTargetRiskAnalysis",
              "document",
              "interview"
            ]
          },
          {
            "title": "Control-12.10.5",
            "testingProcedure": ["12.10.5"],
            "evidenceReference": [
              "document",
              "others-obsevationsOfIncidentResponse"
            ]
          },
          {
            "title": "Control-12.10.6",
            "testingProcedure": ["12.10.6a", "12.10.6b"],
            "evidenceReference": [
              "interview",
              "others-securityIncidentResponsePlan"
            ]
          },
          {
            "title": "Control-12.10.7",
            "testingProcedure": ["12.10.7a", "12.10.7b"],
            "evidenceReference": [
              "document",
              "interview",
              "others-recordsOfResponse"
            ]
          }
        ]
      }
    ]
  }
]

export default reqConfig;