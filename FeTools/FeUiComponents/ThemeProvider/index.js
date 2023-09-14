'use client'
 
import {NextUIProvider} from "@nextui-org/react";
 
function ThemeProvider({ children }) {
  return <NextUIProvider>
     <main className="dark text-foreground bg-background">
     {children}
     </main></NextUIProvider>
}

export default ThemeProvider;