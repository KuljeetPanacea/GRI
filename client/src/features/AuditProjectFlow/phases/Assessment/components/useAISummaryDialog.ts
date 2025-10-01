import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeAISummaryDialog, selectAISummaryDialogOpen, selectAISummary, selectAISummaryLoading, selectAISummaryError } from "../../../../../redux/assessmentSlice";

const formatContent = (content: unknown) => {
  if (!content) return "<p>No summary available.</p>";
  const safeContent = String(content);

  const lines = safeContent.split('\n').map(line => line.trim()).filter(line => line);
  let formattedContent = '';
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.endsWith(':')) {
      if (inList) {
        formattedContent += '</ul>';
        inList = false;
      }
      const headerText = line.replace(/\*\*(.*?)\*\*/g, '$1');
      formattedContent += `<p style="margin:8px 0 4px 0;font-weight:bold">${headerText}</p>`;
    }
    else if (line.startsWith('- ')) {
      if (!inList) {
        formattedContent += '<ul style="margin:4px 0 8px 0;padding-left:20px;list-style-type:disc">';
        inList = true;
      }
      const listItem = line.substring(2);
      formattedContent += `<li style="margin:2px 0;padding:0">${listItem}</li>`;
    }
    else {
      if (inList) {
        formattedContent += '</ul>';
        inList = false;
      }
      const boldFormatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formattedContent += `<p style="margin:4px 0">${boldFormatted}</p>`;
    }
  }

  if (inList) {
    formattedContent += '</ul>';
  }

  return formattedContent;
};

export const useAISummaryDialog = () => {
  const dispatch = useDispatch();
  const open = useSelector(selectAISummaryDialogOpen);
  const summary = useSelector(selectAISummary);
  const loading = useSelector(selectAISummaryLoading);
  const error = useSelector(selectAISummaryError);

  const formattedSummaryHtml = useMemo(() => formatContent(summary), [summary]);

  const handleClose = useCallback(() => {
    dispatch(closeAISummaryDialog());
  }, [dispatch]);

  return {
    open,
    summary,
    loading,
    error,
    formattedSummaryHtml,
    handleClose,
  };
};

export default useAISummaryDialog;


