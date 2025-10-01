import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Upload,
  MessageSquare,
  ArrowRight,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import styles from "./BranchingLogicGraph.module.css";
import PrimaryButton from "../../../../../common/ui/PrimaryButton";
import { useScopingGraph, ScopeQuestion } from "../hooks/useScopingGraph";
import { useScopeDocument } from "../hooks/useScopeDocuments";

// Accept dynamic questionnaire data in dependency
const ScopeGraph = () => {
  const { scopingDataArray } = useScopeDocument();
  const [activeSetIndex, setActiveSetIndex] = useState(0);
  type ScopingSet = {
    questions?: Array<{
      _id: string;
      type: string;
      text: string;
      choices?: { value: string }[];
      userResponse?: string | string[];
      branchingLogic?: { conditions?: { value?: string[] }[]; next: string }[];
      alwaysGoTo?: string;
    }>;
  };

  const currentSet = scopingDataArray[activeSetIndex] as ScopingSet | undefined;
  const currentQuestions: ScopeQuestion[] = Array.isArray(currentSet?.questions)
    ? currentSet!.questions!.map((q) => {
        type BranchCond = {
          questionId?: string;
          operator?: string;
          value?: string[];
        };
        const branching: ScopeQuestion["branchingLogic"] = Array.isArray(
          q.branchingLogic
        )
          ? q.branchingLogic.map(
              (b: { next: string; conditions?: BranchCond[] }) => ({
                next: String(b.next),
                conditions: Array.isArray(b.conditions)
                  ? b.conditions.map((c: BranchCond) => ({
                      questionId: String(c.questionId ?? q._id),
                      operator: String(c.operator ?? "EQUALS"),
                      value: Array.isArray(c.value) ? c.value.map(String) : [],
                    }))
                  : [],
              })
            )
          : [];

        return {
          _id: String(q._id),
          type: String(q.type),
          text: String(q.text),
          choices: Array.isArray(q.choices) ? q.choices : [],
          userResponse:
            typeof q.userResponse === "string"
              ? q.userResponse
              : Array.isArray(q.userResponse)
              ? (q.userResponse[0] as string | undefined)
              : undefined,
          branchingLogic: branching,
          alwaysGoTo:
            typeof q.alwaysGoTo === "string" ? q.alwaysGoTo : undefined,
        } as ScopeQuestion;
      })
    : [];

  const getSetQuestionCount = (set: unknown): number => {
    if (typeof set === "object" && set !== null) {
      const maybe = set as { questions?: unknown };
      if (Array.isArray(maybe.questions)) return maybe.questions.length;
    }
    return 0;
  };

  // Adjust custom hooks to use current set
  const {
    selectedNode,
    expandedNodes,
    zoom,
    viewMode,
    dragOffset,
    positions,
    circularReferences,
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
  } = useScopingGraph(currentQuestions);
  useEffect(() => {
    setSelectedNode(null);
  }, [activeSetIndex, setSelectedNode]);

  // --- Helper icon/color functions (unchanged)
  const getQuestionIcon = (type: string) => {
    switch (type) {
      case "file_type":
        return <Upload className="w-4 h-4" />;
      case "short_text":
        return <FileText className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };
  const getQuestionColorClass = (type: string) => {
    switch (type) {
      case "multiple_choice":
        return styles.multipleChoice;
      case "single_choice":
        return styles.singleChoice;
      case "file_type":
        return styles.fileType;
      case "short_text":
        return styles.shortText;
      default:
        return styles.defaultType;
    }
  };

  // --- Drawing Connections (unchanged)
  const renderConnection = (
    startPos: { x: number; y: number },
    endPos: { x: number; y: number },
    condition: string = "",
    isCircular: boolean = false
  ) => {
    const startX = startPos.x + 300;
    const startY = startPos.y + 50;
    const endX = endPos.x;
    const endY = endPos.y + 50;
    let path;
    if (isCircular) {
      const midX = startX + 100;
      const midY = Math.min(startY, endY) - 100;
      path = `M${startX},${startY} Q${midX},${midY} ${endX},${endY}`;
    } else {
      const controlX1 = startX + 75;
      const controlX2 = endX - 75;
      path = `M${startX},${startY} C${controlX1},${startY} ${controlX2},${endY} ${endX},${endY}`;
    }

    return (
      <g key={`${startPos.x}-${startPos.y}-${endPos.x}-${endPos.y}`}>
        <path
          d={path}
          fill="none"
          stroke={isCircular ? "#ef4444" : "#6b7280"}
          strokeWidth="2"
          strokeDasharray={isCircular ? "5,5" : "none"}
          markerEnd="url(#arrowhead)"
        />
        {condition && (
          <text
            x={(startX + endX) / 2}
            y={(startY + endY) / 2 - 10}
            className={styles.conditionLabel}
            textAnchor="middle"
          >
            {condition}
          </text>
        )}
      </g>
    );
  };

  // --- Flowchart Rendering
  const renderFlowChart = () => {
    const connections: JSX.Element[] = [];
    const nodes: JSX.Element[] = [];

    // Use only questions for active set
    currentQuestions.forEach((question: ScopeQuestion) => {
      const startPos = positions.get(question._id);
      if (!startPos) return;

      if (question.branchingLogic && question.branchingLogic.length > 0) {
        question.branchingLogic.forEach((branch) => {
          if (branch.next) {
            const endPos = positions.get(branch.next);
            if (endPos) {
              const condition =
                branch.conditions?.[0]?.value?.join(", ") || "Default";
              const isCircular = circularReferences.has(
                `${question._id}->${branch.next}`
              );
              connections.push(
                renderConnection(startPos, endPos, condition, isCircular)
              );
            }
          }
        });
      }
      if (question.alwaysGoTo) {
        const endPos = positions.get(question.alwaysGoTo);
        if (endPos) {
          const isCircular = circularReferences.has(
            `${question._id}->${question.alwaysGoTo}`
          );
          connections.push(
            renderConnection(startPos, endPos, "Always", isCircular)
          );
        }
      }
    });

    Array.from(positions.entries()).forEach(
      ([questionId, pos]: [
        string,
        { x: number; y: number; level: number }
      ]) => {
        const question = currentQuestions.find((q) => q._id === questionId);
        if (!question) return;
        nodes.push(
          <foreignObject
            key={questionId}
            x={pos.x}
            y={pos.y}
            width="300"
            height="500"
          >
            <div
              className={`${styles.questionNode} ${getQuestionColorClass(
                question.type
              )} ${
                selectedNode === questionId ? styles.questionNodeSelected : ""
              }`}
              onClick={() => setSelectedNode(questionId || null)}
            >
              <div className={styles.questionNodeHeader}>
                {getQuestionIcon(question.type)}
                <span className={styles.questionType}>{question.type}</span>
              </div>
              <div className={styles.questionText}>{question.text}</div>
              {question.userResponse && (
                <div className={styles.userResponse}>
                  Response: {question.userResponse}
                </div>
              )}
            </div>
          </foreignObject>
        );
      }
    );

    return [...connections, ...nodes];
  };

  // --- TreeView Rendering
  const renderTreeView = () => {
    const renderQuestion = (
      question: ScopeQuestion,
      level: number = 0,
      visited: Set<string> = new Set()
    ) => {
      if (visited.has(question._id)) {
        return (
          <div
            key={`${question._id}-circular`}
            className={styles.circularReference}
          >
            <ArrowRight className="w-4 h-4" />
            <span>Circular reference to: {question.text}</span>
          </div>
        );
      }
      const isExpanded = expandedNodes.has(question._id);
      const hasChildren =
        (question.branchingLogic && question.branchingLogic.length > 0) ||
        question.alwaysGoTo;

      const newVisited = new Set(visited);
      newVisited.add(question._id);

      return (
        <div key={question._id} className={styles.treeNode}>
          <div
            className={`${styles.treeNodeContent} ${getQuestionColorClass(
              question.type
            )} ${
              selectedNode === question._id ? styles.questionNodeSelected : ""
            }`}
            style={{ marginLeft: `${level * 20}px` }}
            onClick={() => setSelectedNode(question._id || null)}
          >
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (question._id) {
                    toggleExpanded(question._id);
                  }
                }}
                className={styles.expandButton}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
            {!hasChildren && <div className={styles.spacer}></div>}

            <div className={styles.treeNodeInfo}>
              {getQuestionIcon(question.type)}
              <span className={styles.questionType}>{question.type}</span>
            </div>

            <div className={styles.treeNodeMain}>
              <div className={styles.nodeTitle}>{question.text}</div>
              {question.userResponse && (
                <div className={styles.nodeResponse}>
                  Response: {question.userResponse}
                </div>
              )}
            </div>
          </div>

          {isExpanded && hasChildren && (
            <div className={styles.treeChildren}>
              {question.branchingLogic?.map(
                (
                  branch: { next: string; conditions?: { value?: string[] }[] },
                  idx: number
                ) => {
                  if (branch.next) {
                    const nextQuestion = findNextQuestion(branch.next);
                    if (nextQuestion) {
                      return (
                        <div key={idx} className={styles.treeBranch}>
                          <div className={styles.conditionInfo}>
                            <ArrowRight className="w-3 h-3" />
                            Condition:{" "}
                            {branch.conditions?.[0]?.value?.join(", ") ||
                              "Always"}
                          </div>
                          {renderQuestion(nextQuestion, level + 1, newVisited)}
                        </div>
                      );
                    }
                  }
                  return null;
                }
              )}
              {question.alwaysGoTo && (
                <div className={styles.treeBranch}>
                  <div className={styles.conditionInfo}>
                    <ArrowRight className="w-3 h-3" />
                    Always go to:
                  </div>
                  {(() => {
                    const nextQuestion = findNextQuestion(question.alwaysGoTo);
                    return nextQuestion
                      ? renderQuestion(nextQuestion, level + 1, newVisited)
                      : null;
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      );
    };
    // Show only current questionnaire
    return currentQuestions.length > 0
      ? renderQuestion(currentQuestions[0] as ScopeQuestion)
      : null;
  };

  // --- Main Return Block
  return (
    <div className={styles.container}>
      <div className={styles.maxWidthContainer}>
        <div className={styles.header}>
          {/* Questionnaire set selector */}
          {scopingDataArray.length > 1 && (
            <div className={styles.selector}>
              <label htmlFor="qn-set">Questionnaire set:&nbsp;</label>
              <select
                id="qn-set"
                value={activeSetIndex}
                onChange={(e) => setActiveSetIndex(Number(e.target.value))}
              >
                {scopingDataArray.map((set, idx: number) => (
                  <option key={idx} value={idx}>
                    {set.title} ({getSetQuestionCount(set)} questions)
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.buttonGroup}>
            <PrimaryButton
              children={"Tree View"}
              onClick={() => setViewMode("tree")}
              className={`${styles.viewButton} ${
                viewMode === "tree" ? styles.active : ""
              }`}
            />
            <PrimaryButton
              children={"Flow Chart"}
              onClick={() => setViewMode("flowchart")}
              className={`${styles.viewButton} ${
                viewMode === "flowchart" ? styles.active : ""
              }`}
            />
          </div>

          {viewMode === "flowchart" && (
            <div className={styles.controls}>
              <div className={styles.zoomControls}>
                <button onClick={zoomOut} className={styles.zoomButton}>
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className={styles.zoomLevel}>
                  {Math.round(zoom * 100)}%
                </span>
                <button onClick={zoomIn} className={styles.zoomButton}>
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button onClick={resetView} className={styles.resetButton}>
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.mainContent}>
          <div className={styles.leftPanel}>
            {viewMode === "tree" ? (
              <div>
                <div className={styles.treeContainer}>{renderTreeView()}</div>
              </div>
            ) : (
              <div>
                <div
                  className={styles.chartWrapper}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <svg
                    width="100%"
                    height="900"
                    className={styles.chartContainer}
                  >
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
                      </marker>
                    </defs>
                    <g
                      transform={`translate(${dragOffset.x}, ${dragOffset.y}) scale(${zoom})`}
                    >
                      {renderFlowChart()}
                    </g>
                  </svg>
                </div>
                {circularReferences.size > 0 && (
                  <div className={styles.circularWarning}>
                    <strong>Circular References Detected:</strong>
                    <ul>
                      {Array.from(circularReferences).map((ref) => (
                        <li key={ref}>{ref}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScopeGraph;
