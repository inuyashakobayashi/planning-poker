import React from "react";
import { Stack } from "@mui/material";
import BoxHeader from "../../Components/Frames/BoxHeader";
import MembersView from "./PartialViews/MembersView/index";
import StoryView from "./PartialViews/StoryView/index";
import EstimatesView from "./PartialViews/EstimatesView/index";
import { useSelector } from "react-redux";

const SessionPage = () => {
  const sessionId = useSelector((state) => state.session.sessionId);
  if (!sessionId) {
    return null;
  }

  return (
    <Stack
      spacing={1}
      sx={{
        paddingX: 3,
        paddingY: 2,
        bgcolor: "white",
        width: "82vw",
        height: "90vh",
        borderRadius: "1rem",
        boxShadow: 3,
      }}
    >
      <BoxHeader />
      <Stack
        direction="row"
        spacing={1}
        flexShrink={1}
        height="calc(100% - 12vh - 1rem)"
      >
        <MembersView />
        <StoryView />
        <EstimatesView />
      </Stack>
    </Stack>
  );
};

export default SessionPage;
