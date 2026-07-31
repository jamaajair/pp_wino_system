import { Box, Tab, Tabs as MuiTabs } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

export interface TabItem<T extends string = string> {
  value: T;
  label: string;
}

interface AppTabsProps<T extends string> {
  tabs: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  sx?: SxProps<Theme>;
}

function AppTabs<T extends string>({ tabs, value, onChange, sx }: AppTabsProps<T>) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <MuiTabs
        value={value}
        onChange={(_, v: T) => onChange(v)}
        sx={{ mb: 2, borderBottom: '1px solid #e0e0e0', ...sx }}
      >
        {tabs.map(t => (
          <Tab key={t.value} value={t.value} label={t.label} />
        ))}
      </MuiTabs>
    </Box>
  );
}

export default AppTabs;