"use client";
import React, { createContext, useState, ReactNode } from "react";

interface AppData {
  inputFile?: File | null;
  processedFile?: {
    file: File;
    url: string;
  } | null;
  feedback?: {
    thumbs?: boolean | null;
    comment?: string | null;
  } | null;
}

interface AppContextProps {
  appData: AppData | null;
  setAppData: (appData: AppData | null) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [appData, setAppData] = useState<AppData | null>(null);

  return (
    <AppContext.Provider value={{ appData, setAppData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppData = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useFile must be used within a FileProvider");
  }
  return context;
};
