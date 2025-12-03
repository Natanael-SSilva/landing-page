// src/app/ThemeProvider.tsx
"use client";

import * as React from "react";
// A correção está aqui: importamos o componente e seus tipos da mesma fonte
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}