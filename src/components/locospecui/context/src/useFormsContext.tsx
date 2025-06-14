import { useContext } from "react";
import { FormsContext } from "./FormsContext";

export const useFormsContext = () => {
  const context = useContext(FormsContext);
  if (context === undefined) {
    throw new Error("useFormsContext must be used within a FormsProvider");
  }
  return context;
};

useFormsContext.displayName = "useFormsContext";
