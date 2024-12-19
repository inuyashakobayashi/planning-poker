import { Stack, Typography } from "@mui/material";

const BoxHeader = () => {
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"flex-end"}
      height={"10vh"}
      width={"100%"}
    >
      <img
        height={"100%"}
        alt="dos-logo"
        src="https://www.dos-online.de/wp-content/uploads/2023/08/cropped-DOS_Logo_2023_mit_UZ_RGB.png"
      />
      <Typography variant="h5">SCRUM Planning Poker</Typography>
    </Stack>
  );
};

export default BoxHeader;
