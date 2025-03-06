import { colors } from './theme';

export const appContainerStyles = {
  display: 'flex',
  minHeight: '100vh',
};

export const mainContentStyles = {
  flexGrow: 1,
  marginLeft: 200,
  padding: 20,
  backgroundColor: colors.background.default,
};

export const theme = {
  palette: {
    mode: 'light',
    primary: colors.primary,
    background: colors.background,
    text: colors.text,
  },
}; 