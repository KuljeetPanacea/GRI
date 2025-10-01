import styles from "./Styles/PendingEvidences.module.css";
import useAssessor, { Question } from "../useAssessor";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import { UploadedEvidence } from "../../../api/AssetControl";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { selectAssessmentId } from "../../../redux/assessmentSlice";

const EvidencesGallery = () => {
  const assessmentId = useSelector(selectAssessmentId);
  const {
    selectedImage,
    selectedImageName,
    isModalOpen,
    axiosInstance,
    EvidenceUploaded,
    setEvidencesUploaded,
    handleImagePreview,
    closeModal,
  } = useAssessor();

  useEffect(() => {
    const getEvidenceUploaded = async () => {
      const data: Question[] = await UploadedEvidence(
        axiosInstance,
        assessmentId
      );
      setEvidencesUploaded(data);
    };
    getEvidenceUploaded();
  }, [assessmentId, axiosInstance]);

  return (
    <div className={styles.enhancedImageReview}>
      <div className={styles.reviewHeader}>
        <ImageIcon className={styles.reviewHeaderIcon} />
        <div>
          <h4 className={styles.reviewTitle}>Evidence Gallery</h4>
          <p className={styles.reviewSubtitle}>
            Review uploaded evidence files ({EvidenceUploaded.length} files
            available)
          </p>
        </div>
      </div>

      {EvidenceUploaded.length > 0 ? (
        <div className={styles.imageGallery}>
          {EvidenceUploaded.map((img, i) => (
            <div key={i} className={styles.imageCard}>
              <div className={styles.imageCardHeader}>
                <ImageIcon className={styles.imageCardIcon} />
                <span className={styles.imageCardTitle}>{img.name}</span>
              </div>

              <div className={styles.imageCardActions}>
                <button
                  className={styles.previewButton}
                  onClick={() => handleImagePreview(img)}
                  title="Preview image"
                >
                  <VisibilityIcon fontSize="small" />
                  <span>Preview</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyGallery}>
          <ImageIcon className={styles.emptyGalleryIcon} />
          <h5 className={styles.emptyGalleryTitle}>No Evidence Files Found</h5>
          <p className={styles.emptyGalleryText}>
            Upload evidence files to review them here
          </p>
        </div>
      )}

      {/* Enhanced Modal for Image Preview */}
      {isModalOpen && selectedImage && (
        <div className={styles.modal} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h5 className={styles.modalTitle}>
                <ImageIcon className={styles.modalTitleIcon} />
                {selectedImageName}
              </h5>
              <button className={styles.modalCloseButton} onClick={closeModal}>
                <CloseIcon />
              </button>
            </div>

            <div className={styles.modalImageContainer}>
              <img
                src={selectedImage}
                alt={selectedImageName}
                className={styles.modalImage}
              />
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.modalActionButton} onClick={closeModal}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidencesGallery;
