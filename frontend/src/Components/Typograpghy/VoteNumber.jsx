import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import PropTypes from "prop-types";

const VoteNumber = ({
  number = 8,
  caption = "Last vote",
  includeCaption = false,
  alt = false,
  height = "1.8rem",
  width = "1.8rem",
  fontSize = "0.75rem",
}) => {
  const theme = useTheme();

  const mainColor = alt
    ? theme.palette.secondary.main
    : theme.palette.primary.main;

  const lightColor = alt
    ? theme.palette.secondary.light
    : theme.palette.primary.light;

  return (
    <Stack alignItems={"center"} height={"fit-content"} width={"fit-content"}>
      <Box
        height={"fit-content"}
        width={"fit-content"}
        borderRadius={"50%"}
        bgcolor={lightColor}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        padding={"2px"}
      >
        <Avatar
          sx={{
            fontSize: fontSize,
            height: height,
            width: width,
            border: 1,
            background: `linear-gradient(45deg, ${mainColor} 0%, ${lightColor} 100%)`,
          }}
        >
          {number}
        </Avatar>
      </Box>
      {includeCaption && (
        <Typography variant="caption" fontSize={"10px"}>
          {caption}
        </Typography>
      )}
    </Stack>
  );
};

VoteNumber.prototypes = {
  number: PropTypes.number.isRequired,
  caption: PropTypes.string,
  includeCaption: PropTypes.bool,
  alt: PropTypes.bool,
  height: PropTypes.string,
  width: PropTypes.string,
  fontSize: PropTypes.string,
};

export default VoteNumber;
