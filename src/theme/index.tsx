import React, { createContext, useContext, ReactNode } from 'react';
import { colors as baseColors, spacing as baseSpacing, typography as baseTypography, radii as baseRadii } from './tokens';

export const Theme = {
  colors: baseColors,
  spacing: baseSpacing,
  typography: baseTypography,
  radii: baseRadii,
};

const ThemeContext = createContext(Theme);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return <ThemeContext.Provider value={Theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

export default Theme;
