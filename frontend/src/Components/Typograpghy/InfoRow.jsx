import { Stack, Typography } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

const InfoRow = ({ title = "Time", value = "--:--", color }) => {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Typography variant="caption" color={color}>
        {title}
      </Typography>
      <Typography variant="h6" color={color}>
        {value}
      </Typography>
    </Stack>
  );
};

InfoRow.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  color: PropTypes.string,
};

export default InfoRow;
