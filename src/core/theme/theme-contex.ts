import React from 'react';
import { ITheme } from './itheme';
import { darkTheme } from '../../styles/themes/dark-theme';

export const ThemeContext = React.createContext<ITheme>(darkTheme);
