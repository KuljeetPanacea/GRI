import { Tabs, Tab } from "@mui/material";

const CustomTabs = ({ value, onChange, labels }: { value: number; onChange: (event: any, newValue: number) => void; labels: string[] }) => (
  <Tabs value={value} onChange={onChange}>
    {labels.map((label, index) => (
      <Tab key={index} label={label} />
    ))}
  </Tabs>
);
export default CustomTabs;