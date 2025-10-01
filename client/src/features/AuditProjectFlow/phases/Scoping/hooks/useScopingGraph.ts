import { useState, useMemo } from "react";

// Custom interface for the question data used in this component
export interface ScopeQuestion {
  _id: string;
  type: string;
  text: string;
  choices: { value: string }[];
  userResponse?: string;
  branchingLogic?: {
    conditions: {
      questionId: string;
      operator: string;
      value: string[];
    }[];
    next: string;
  }[];
  alwaysGoTo?: string;
}

export const useScopingGraph = (questions?: ScopeQuestion[]) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set<string>());
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState("tree");
  const [dragOffset, setDragOffset] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Complex branching data with multiple paths and circular references
  const questionsData: ScopeQuestion[] = questions ?? [
    {
      _id: "start_question",
      type: "multiple_choice",
      text: "What kind of business do you have?",
      choices: [{ value: "Online" }, { value: "Hybrid" }, { value: "Offline" }],
      userResponse: "Hybrid",
      branchingLogic: [
        {
          conditions: [
            {
              questionId: "start_question",
              operator: "EQUALS",
              value: ["Online"],
            },
          ],
          next: "online_branch_1",
        },
        {
          conditions: [
            {
              questionId: "start_question",
              operator: "EQUALS",
              value: ["Hybrid"],
            },
          ],
          next: "hybrid_branch_1",
        },
        {
          conditions: [
            {
              questionId: "start_question",
              operator: "EQUALS",
              value: ["Offline"],
            },
          ],
          next: "offline_branch_1",
        },
      ],
    },
    {
      _id: "online_branch_1",
      type: "single_choice",
      text: "Do you have an e-commerce platform?",
      choices: [{ value: "Yes" }, { value: "No" }],
      userResponse: "",
      branchingLogic: [
        {
          conditions: [
            {
              questionId: "online_branch_1",
              operator: "EQUALS",
              value: ["Yes"],
            },
          ],
          next: "ecommerce_details",
        },
        {
          conditions: [
            {
              questionId: "online_branch_1",
              operator: "EQUALS",
              value: ["No"],
            },
          ],
          next: "website_question",
        },
      ],
    },
    {
      _id: "hybrid_branch_1",
      type: "single_choice",
      text: "Do you have anti-virus certificate?",
      choices: [{ value: "Yes" }, { value: "No" }],
      userResponse: "Yes",
      branchingLogic: [
        {
          conditions: [
            {
              questionId: "hybrid_branch_1",
              operator: "EQUALS",
              value: ["Yes"],
            },
          ],
          next: "certificate_upload",
        },
        {
          conditions: [
            {
              questionId: "hybrid_branch_1",
              operator: "EQUALS",
              value: ["No"],
            },
          ],
          next: "security_question",
        },
      ],
    },
    {
      _id: "offline_branch_1",
      type: "single_choice",
      text: "Do you have a physical store?",
      choices: [{ value: "Yes" }, { value: "No" }],
      userResponse: "",
      branchingLogic: [
        {
          conditions: [
            {
              questionId: "offline_branch_1",
              operator: "EQUALS",
              value: ["Yes"],
            },
          ],
          next: "store_details",
        },
        {
          conditions: [
            {
              questionId: "offline_branch_1",
              operator: "EQUALS",
              value: ["No"],
            },
          ],
          next: "start_question", // Circular reference
        },
      ],
    },
    {
      _id: "ecommerce_details",
      type: "short_text",
      text: "Please provide your e-commerce platform details",
      choices: [],
      userResponse: "",
      alwaysGoTo: "final_step",
      branchingLogic: [],
    },
    {
      _id: "website_question",
      type: "single_choice",
      text: "Do you plan to create a website?",
      choices: [{ value: "Yes" }, { value: "No" }],
      userResponse: "",
      branchingLogic: [
        {
          conditions: [
            {
              questionId: "website_question",
              operator: "EQUALS",
              value: ["Yes"],
            },
          ],
          next: "website_details",
        },
        {
          conditions: [
            {
              questionId: "website_question",
              operator: "EQUALS",
              value: ["No"],
            },
          ],
          next: "final_step",
        },
      ],
    },
    {
      _id: "certificate_upload",
      type: "file_type",
      text: "Upload your anti-virus certificate",
      choices: [],
      userResponse: "certificate.pdf",
      alwaysGoTo: "additional_info",
      branchingLogic: [],
    },
    {
      _id: "security_question",
      type: "multiple_choice",
      text: "What security measures do you have?",
      choices: [
        { value: "Firewall" },
        { value: "VPN" },
        { value: "Encryption" },
        { value: "None" },
      ],
      userResponse: "",
      branchingLogic: [
        {
          conditions: [
            {
              questionId: "security_question",
              operator: "CONTAINS",
              value: ["None"],
            },
          ],
          next: "security_recommendation",
        },
        {
          conditions: [
            {
              questionId: "security_question",
              operator: "NOT_CONTAINS",
              value: ["None"],
            },
          ],
          next: "additional_info",
        },
      ],
    },
    {
      _id: "store_details",
      type: "short_text",
      text: "Provide your store address and details",
      choices: [],
      userResponse: "",
      alwaysGoTo: "final_step",
      branchingLogic: [],
    },
    {
      _id: "website_details",
      type: "short_text",
      text: "Describe your website requirements",
      choices: [],
      userResponse: "",
      alwaysGoTo: "final_step",
      branchingLogic: [],
    },
    {
      _id: "additional_info",
      type: "short_text",
      text: "Any additional information?",
      choices: [],
      userResponse: "",
      alwaysGoTo: "final_step",
      branchingLogic: [],
    },
    {
      _id: "security_recommendation",
      type: "short_text",
      text: "We recommend implementing security measures. Please provide your plan.",
      choices: [],
      userResponse: "",
      alwaysGoTo: "final_step",
      branchingLogic: [],
    },
    {
      _id: "final_step",
      type: "short_text",
      text: "Thank you for completing the questionnaire!",
      choices: [],
      userResponse: "",
      branchingLogic: [],
    },
  ];

  const zoomIn = () => setZoom((z) => Math.min(z + 0.1, 2));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.3));
  const resetView = () => {
    setZoom(1);
    setDragOffset({ x: 50, y: 50 });
  };

  // Improved algorithm to handle complex branching with circular reference detection
  const calculatePositions = useMemo(() => {
    const positions = new Map<string, { x: number; y: number; level: number }>();
    const processedNodes = new Set<string>();
    const nodesByLevel = new Map<number, string[]>();
    const circularReferences = new Set<string>();
    let maxLevel = 0;

    const findQuestion = (id: string): ScopeQuestion | undefined =>
      questionsData.find((q) => q._id === id);

    const processNode = (
      questionId: string,
      level = 0,
      visited = new Set<string>(),
      path: string[] = []
    ) => {
      if (visited.has(questionId)) {
        // Detected circular reference
        circularReferences.add(`${path[path.length - 1]}->${questionId}`);
        return;
      }

      if (processedNodes.has(questionId)) {
        return;
      }

      const question = findQuestion(questionId);
      if (!question) return;

      visited.add(questionId);
      processedNodes.add(questionId);
      path.push(questionId);

      // Calculate position for this node
      if (!nodesByLevel.has(level)) {
        nodesByLevel.set(level, []);
      }
      nodesByLevel.get(level)!.push(questionId);

      maxLevel = Math.max(maxLevel, level);

      // Process all possible next nodes
      const nextNodes: { id: string; condition: string }[] = [];

      // Handle branching logic
      if (question.branchingLogic && question.branchingLogic.length > 0) {
        question.branchingLogic.forEach((branch) => {
          if (branch.next) {
            nextNodes.push({
              id: branch.next,
              condition: branch.conditions?.[0]?.value?.join(", ") || "Default",
            });
          }
        });
      }

      // Handle alwaysGoTo
      if (question.alwaysGoTo) {
        nextNodes.push({
          id: question.alwaysGoTo,
          condition: "Always",
        });
      }

      // Process next nodes
      nextNodes.forEach(({ id: nextId }) => {
        processNode(nextId, level + 1, new Set(visited), [...path]);
      });

      visited.delete(questionId);
      path.pop();
    };

    // Start processing from the first question
    if (questionsData.length > 0) {
      processNode(questionsData[0]._id);
    }

    // Calculate actual positions
    const horizontalSpacing = 350;
    const verticalSpacing = 150;

    nodesByLevel.forEach((nodes, level) => {
      nodes.forEach((nodeId: string, index: number) => {
        const totalNodesAtLevel = nodes.length;
        const startY = (-(totalNodesAtLevel - 1) * verticalSpacing) / 2;

        positions.set(nodeId, {
          x: level * horizontalSpacing,
          y: startY + index * verticalSpacing,
          level,
        });
      });
    });

    return { positions, circularReferences };
  }, [questionsData]);

  const { positions, circularReferences } = calculatePositions;

  const findNextQuestion = (questionId: string): ScopeQuestion | undefined => {
    return questionsData.find((q) => q._id === questionId);
  };

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (viewMode === "flowchart") {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDragging && viewMode === "flowchart") {
      setDragOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return {
    // States
    selectedNode,
    expandedNodes,
    zoom,
    viewMode,
    dragOffset,
    isDragging,
    questionsData,
    positions,
    circularReferences,
    
    // Functions
    setSelectedNode,
    setViewMode,
    zoomIn,
    zoomOut,
    resetView,
    findNextQuestion,
    toggleExpanded,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
