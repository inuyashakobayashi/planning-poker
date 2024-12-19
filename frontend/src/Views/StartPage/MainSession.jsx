import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { styled } from "@mui/system";
import JoinSession from "./JoinSession.jsx";
import CreateSession from "./CreateSession.jsx";

const StyledTabs = styled(Tabs)(({ theme }) => ({
  width: "100%",
  "& .MuiTab-root": {
    minWidth: "50%",
    fontWeight: "bold",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
    transition: "transform 0.3s ease",
    color: theme.palette.primary.main,
  },
  "& .Mui-selected": {
    backgroundColor: theme.palette.common.white,
    transform: "scale(1)",
    color: theme.palette.primary.main,
  },
  "& .MuiTab-root:not(.Mui-selected)": {
    backgroundColor: theme.palette.grey[700],
    fontSize: "0.9rem",
    transform: "scale(0.85)",
  },
  "& .MuiTabs-indicator": {
    display: "none",
  },
}));

function MainSession() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 500,
      }}
    >
      <StyledTabs
        value={currentTab}
        onChange={handleTabChange}
        aria-label="session tabs"
        sx={{
          position: "absolute",
          top: "-2rem",
          left: 0,
        }}
      >
        <Tab label="JOIN SESSION" />
        <Tab label="CREATE SESSION" />
      </StyledTabs>

      <Box
        sx={{
          bgcolor: "common.white",
          borderBottomRightRadius: "10px",
          borderBottomLeftRadius: "10px",
          boxShadow: 3,
          padding: 2,
          textAlign: "center",
          mt: 2,
        }}
      >
        {currentTab === 0 && <JoinSession />}
        {currentTab === 1 && <CreateSession />}
      </Box>
    </Box>
  );
}

export default MainSession;
