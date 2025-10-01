import styles from "./ScopeDocuments.module.css";
import { useDecDocuments } from "../useDceDocuments";
import styles1 from "../../DeviceIdentification/DeviceIdentificationView.module.css";
import PrimaryButton from "../../../../../common/ui/PrimaryButton";
import useAxios from "../../../../../api/useAxios";
import {
  cdeDocument,
  fetchCdeDocs,
  generateDocument,
} from "../../../../../api/project";
import { useDispatch } from "react-redux";
import { setScope_document } from "../../../../../redux/projectManagementSlice";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../../redux/store";
import { selectSelectedPhase } from "../../../../../redux/phaseSlice";

const CDEDocuments = () => {
  const axiosInstance = useAxios();
  const dispatch = useDispatch();
  const {
    fileInputRef,
    onFileChange,
    activeTab,
    handleTabClick,
    selectedImageUrl,
    selectedProject,
  } = useDecDocuments();
  const [uploadedDocs, setUploadedDocs] = useState<cdeDocument[]>(
    selectedProject?.cdeDocs || []
  );
  const genrateReport = async () => {
    if (!selectedProject?._id) {
      console.error("No project selected. Cannot generate report.");
      return;
    }
    const payload = {
      projectId: selectedProject._id,
      fileNames: uploadedDocs.map((doc) => doc.fileName),
    };
    const report = await generateDocument(axiosInstance, payload);
    dispatch(setScope_document(report.scope_document));
  };

  useEffect(() => {
    const getDocs = async () => {
      if (selectedProject?._id) {
        try {
          const docs = await fetchCdeDocs(axiosInstance, selectedProject._id);
          setUploadedDocs(docs);
        } catch (error) {
          console.error("Failed to fetch CDE docs:", error);
        }
      }
    };
    getDocs();
  }, [selectedProject?._id, axiosInstance]);

  const isPDF = (fileName: string) => fileName.toLowerCase().endsWith(".pdf");
  const selectedPhase = useAppSelector(selectSelectedPhase);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        {uploadedDocs.map((data, idx) => (
          <>
            <div
              key={idx}
              className={`${styles.sidebarItem} ${
                activeTab === data.status ? styles.active : ""
              }`}
              onClick={() => handleTabClick(data)}
            >
              {data.fileName}
            </div>
            {/* <button onClick={()=>{removeFile(data.s3Path)}}>Delete</button> */}
          </>
        ))}
        <div style={{ marginTop: "16px" }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            style={{ display: "none" }}
          />
          {selectedPhase === "scoping" && (
            <button
              className={styles1.addDeviceButton}
              onClick={() => fileInputRef.current?.click()}
            >
              + Upload Document
            </button>
          )}
        </div>

        {selectedPhase === "scoping" && uploadedDocs.length > 0 && (
          <div style={{}}>
            <PrimaryButton
              children={"Generate report"}
              onClick={genrateReport}
            />
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div>
          {selectedImageUrl ? (
            isPDF(
              uploadedDocs.find((doc) => doc.fileName === activeTab)?.fileName ||
                ""
            ) ? (
              <iframe
                src={selectedImageUrl}
                width="100%"
                height="100%"
                style={{ border: "none", flex: 1 }}
                title="PDF Document"
              />
            ) : (
              <div
                style={{ maxWidth: "100%", maxHeight: "50%", width: "auto" }}
              >
                <img
                  src={selectedImageUrl}
                  alt="Uploaded Document"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "50%",
                    objectFit: "contain",
                    display: "block",
                    margin: "auto",
                  }}
                />
              </div>
            )
          ) : (
            <div className={styles.emptyState}>
              <p>No document selected</p>
              <p className={styles.hint}>Click on a document from the sidebar to preview it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CDEDocuments;
