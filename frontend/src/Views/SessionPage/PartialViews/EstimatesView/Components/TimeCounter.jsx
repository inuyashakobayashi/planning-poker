import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";

const TimeCounter = ({ startDate, endDate, isRunning = true }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isRunning) {
      return;
    }
    const calculateElapsedTime = () => {
      const endTime = new Date(endDate);
      const end = endTime.getFullYear() > 2000 ? endTime : new Date();
      const start = new Date(startDate);
      return Math.floor((end - start) / 1000);
    };

    setElapsedTime(calculateElapsedTime());

    const interval = setInterval(() => {
      setElapsedTime(calculateElapsedTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div>
      <Typography variant="h6">{formatTime(elapsedTime)}</Typography>
    </div>
  );
};

TimeCounter.propTypes = {
  startDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])
    .isRequired,
  endDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])
    .isRequired,
  isRunning: PropTypes.bool.isRequired,
};

export default TimeCounter;
