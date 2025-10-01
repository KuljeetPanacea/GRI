import QstnrFilter from "./components/QstnrFilter";
import QstnrGridView from "./components/QstnrGridView";
import QstnrHeader from "./components/QstnrHeader";
import QstnrListView from "./components/QstnrListView";
import { useQstnrAdmin } from "./useQstnrAdmin";
const QstnrAdmin = () => {
  const { viewMode } = useQstnrAdmin();
  return (
    <div >
      <QstnrHeader />
      <QstnrFilter />
      {viewMode === "list" ? <QstnrListView /> : <QstnrGridView />}
    </div>
  );
};

export default QstnrAdmin;
