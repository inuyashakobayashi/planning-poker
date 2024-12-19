import { CircularProgress, Stack, Typography } from "@mui/material";
import React from "react";

const LoaderComp = () => {
  return (
    <Stack
      height={"100%"}
      width={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
      spacing={1}
    >
      <CircularProgress />
      <Typography variant="caption">Loading</Typography>
    </Stack>
  );
};

export default LoaderComp;
