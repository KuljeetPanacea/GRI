import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CustomAccordion = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>{title}</AccordionSummary>
    <AccordionDetails>{children}</AccordionDetails>
  </Accordion>
);

export default CustomAccordion;
