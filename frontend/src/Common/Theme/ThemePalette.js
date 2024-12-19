const ThemePalette = (theme) => {
  return {
    common: {
      white: theme.colors?.paper,
      black: theme.colors?.black,
    },
    primary: {
      light: theme.colors?.primaryLight,
      main: theme.colors?.primaryMain,
      dark: theme.colors?.primaryDark,
      200: theme.colors?.primary200,
      800: theme.colors?.primary800,
    },
    secondary: {
      light: theme.colors?.secondaryLight,
      main: theme.colors?.secondaryMain,
      dark: theme.colors?.secondaryDark,
      200: theme.colors?.secondary200,
      800: theme.colors?.secondary800,
    },
    info: {
      light: theme.colors?.infoLight,
      main: theme.colors?.infoMain,
      dark: theme.colors?.infoDark,
    },
    error: {
      light: theme.colors?.errorLight,
      main: theme.colors?.errorMain,
      dark: theme.colors?.errorDark,
    },
    warning: {
      light: theme.colors?.warningLight,
      main: theme.colors?.warningMain,
      dark: theme.colors?.warningDark,
    },
    success: {
      light: theme.colors?.successLight,
      200: theme.colors?.success200,
      main: theme.colors?.successMain,
      dark: theme.colors?.successDark,
    },
    grey: {
      50: theme.colors?.grey50,
      150: theme.colors?.grey150,
      200: theme.colors?.grey200,
      250: theme.colors?.grey250,
      300: theme.colors?.grey300,
      400: theme.colors?.grey400,
      500: theme.colors?.grey500,
      600: theme.colors?.grey600,
      700: theme.colors?.grey700,
      800: theme.colors?.grey800,
      900: theme.colors?.grey900,
    },
    dark: {
      light: theme.colors?.darkTextPrimary,
      main: theme.colors?.darkLevel1,
      dark: theme.colors?.darkLevel2,
      800: theme.colors?.darkBackground,
      900: theme.colors?.darkPaper,
    },
    text: {
      primary: theme.colors.grey700,
      secondary: theme.colors.grey500,
      dark: theme.colors.grey900,
      hint: theme.colors?.grey100,
    },
    background: {
      paper: theme.colors?.paper,
      light: theme.colors?.backgroundLight,
      dark: theme.colors?.backgroundDark,
    },
  };
};

export default ThemePalette;
