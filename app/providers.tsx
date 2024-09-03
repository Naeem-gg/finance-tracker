"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import {SessionProvider} from "next-auth/react"
export default function Providers({ children }: ThemeProviderProps) {
  return <SessionProvider><NextThemesProvider  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange>{children}</NextThemesProvider>
  </SessionProvider>
}
