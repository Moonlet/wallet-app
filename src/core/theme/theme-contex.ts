import React from 'react';
import { ITheme } from './itheme';
import { darkTheme } from './theme-dark';

export const ThemeContext = React.createContext<ITheme>(darkTheme);
