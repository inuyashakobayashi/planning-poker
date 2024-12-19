import { createTheme } from "@mui/material/styles";
import colors from "./_themes-vars.module.scss";
import ThemePalette from "./ThemePalette";
import ThemeShadows from "./ThemeShadows";
import ThemeTypography from "./ThemeTypography";
import ThemeComponents from "./ThemeComponents";

const useDosTheme = () => {
  const themeOptions = {
    palette: ThemePalette({
      colors,
    }),
    typography: ThemeTypography({
      heading: colors.grey900,
      darkTextPrimary: colors.grey700,
      darkTextSecondary: colors.grey500,
      textDark: colors.grey900,
      menuSelected: colors.secondaryDark,
      menuSelectedBack: colors.secondaryLight,
      divider: colors.grey200,
    }),
    shadows: ThemeShadows,
    components: ThemeComponents,
  };

  return createTheme(themeOptions);
};

export default useDosTheme;
