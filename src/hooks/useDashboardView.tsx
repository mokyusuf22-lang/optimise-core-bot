import { createContext, useContext, useState, ReactNode } from "react";

export type DashboardView = "detailed" | "executive";

const DashboardViewContext = createContext<{
  view: DashboardView;
  setView: (v: DashboardView) => void;
}>({ view: "detailed", setView: () => {} });

export const DashboardViewProvider = ({ children }: { children: ReactNode }) => {
  const [view, setView] = useState<DashboardView>("detailed");
  return (
    <DashboardViewContext.Provider value={{ view, setView }}>
      {children}
    </DashboardViewContext.Provider>
  );
};

export const useDashboardView = () => useContext(DashboardViewContext);
