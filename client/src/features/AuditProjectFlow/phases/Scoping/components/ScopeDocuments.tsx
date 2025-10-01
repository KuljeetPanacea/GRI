import React from "react";
import styles from "./ScopeDocuments.module.css";
import { useScopeDocument } from "../hooks/useScopeDocuments";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";

const ScopeDocuments: React.FC = () => {
  const { activeTab, handleTabClick, headings} = useScopeDocument();
  const scopeDocumentData = useSelector((state: RootState) => state.projectManagement.ScopeDocument);
  const parseScopeDocument = (content: string) => {
    const sections: { [key: string]: string } = {};
    
    // Split by ## headers (section headers)
    const parts = content.split(/^## /gm);
    
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      const lines = part.split('\n');
      const title = lines[0].trim();
      const sectionContent = lines.slice(1).join('\n').trim();
      
      // Map section titles to your heading names
      const sectionMapping: { [key: string]: string } = {
        'Objective': 'Objective',
        'Business Overview': 'Business Overview',
        'Cardholder Data Environment': 'Cardholder Data Environment',
        'Connected Systems': 'Connected Systems',
        'Third-Party Services': 'Third Parties',
        'Out-of-Scope Systems': 'Out-of-Scope Systems',
        'Data Flows': 'Data Flows',
        'Risk Assessment Summary': 'Risk Assessment'
      };
      
      const mappedTitle = sectionMapping[title] || title;
      sections[mappedTitle] = sectionContent;
    }
    
    return sections;
  };

  // Get parsed sections from the scope document
  const getSections = () => {
    // scopeDocumentData is a string, not an object
    if (!scopeDocumentData || typeof scopeDocumentData !== 'string') {
      return {};
    }
    return parseScopeDocument(scopeDocumentData);
  };

  // Function to convert markdown-like text to HTML
  const formatContent = (content: string) => {
    if (!content) return '<p>No content available for this section.</p>';

    return content
      .replace(/### (.*?)(?=\n|$)/g, '<h3>$1</h3>')
      .replace(/## (.*?)(?=\n|$)/g, '<h2>$1</h2>')
      .replace(/# (.*?)(?=\n|$)/g, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/- (.*?)(?=\n|$)/g, '<li>$1</li>')
      .replace(/(\n|^)(\s*<li>.*?<\/li>)(?=\n|$)/g, '<ul>$2</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^\s*/, '<p>')
      .replace(/\s*$/, '</p>');
  };

  // Get the content for the active tab
  const getActiveContent = () => {
    const sections = getSections();
    const content = sections[activeTab];
    return formatContent(content || '');
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        {headings.map((heading) => (
          <div
            key={heading}
            className={`${styles.sidebarItem} ${activeTab === heading ? styles.active : ""}`}
            onClick={() => handleTabClick(heading)}
          >
            {heading}
          </div>
        ))}
      </div>
 
      {/* Main Content */}
      <div className={styles.content}>
        <div className={styles.subContent}>
          <div
            className="document-content"
            dangerouslySetInnerHTML={{ __html: getActiveContent() }}
          />
        </div>
        <button className={styles.sendForApproval}>Send for approval</button>
      </div>
    </div>
  );
};
 
export default ScopeDocuments;