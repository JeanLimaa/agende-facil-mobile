import { createContext, useContext, useState } from "react";

type TabsData = Record<string, any>; // key do tab -> dados do tab

type SettingsTabsContextType = {
  tabsData: TabsData;
  setTabData: (tabKey: string, data: any) => void;
};

export const SettingsTabsContext = createContext<SettingsTabsContextType | undefined>(undefined);

export const useSettingsTabs = () => {
  const context = useContext(SettingsTabsContext);
  if (!context) {
    throw new Error("useSettingsTabs must be used within a SettingsTabsProvider");
  }
  return context;
};

export const SettingsTabsProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [tabsData, setTabsData] = useState<TabsData>({});

  const setTabData = (tabKey: string, data: any) => {
    setTabsData((prev) => ({ ...prev, [tabKey]: data }));
  };

  return (
    <SettingsTabsContext.Provider value={{ tabsData, setTabData }}>
      {children}
    </SettingsTabsContext.Provider>
  );
};