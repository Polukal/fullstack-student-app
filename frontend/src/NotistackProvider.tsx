import { SnackbarProvider } from "notistack";
import { ReactNode } from "react";

export default function NotistackProvider({ children }: { children: ReactNode }) {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      autoHideDuration={3000}
    >
      {children}
    </SnackbarProvider>
  );
}
