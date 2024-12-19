import React, { useState, useEffect } from "react";

import FrameComponent from "../../../../Components/Frames/FrameComponent";
import { Divider, IconButton, Stack, Dialog, Box } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import StoryComp from "./Components/StoryComp";
import CurrentVotes from "./Components/CurrentVotes.jsx";
import EstimateForm from "./Components/EstimateForm";
import EstimatesFooter from "./Components/EstimatesFooter";
import useStories from "../../../../Common/Hooks/useStories";
import LoaderComp from "../../../../Components/Extras/LoaderComp";
import QuilEditor from "../../../../PartialViews/QuilEditor.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  endSession,
  leaveSession,
} from "../../../../_redux/reducers/sessionSlice.js";
import { revealVotes } from "../../../../_redux/reducers/storySlice.js";
import DeleteConfirmationDialog from "./Components/DeleteConfirmationDialog.jsx";

const EstimatesView = () => {
  const {
    stories,
    selectedStory,
    handleSelectStory,
    handleAddStory,
    handleDeleteStory,
  } = useStories();
  const [openQuilEditor, setOpenQuilEditor] = useState(false);
  const dispatch = useDispatch();
  const { sessionId, isScrumMaster, roundStart, roundEnd } = useSelector(
    (state) => state.session
  );

  const addStory = (title, content) => {
    handleAddStory(title, content);
    setOpenQuilEditor(false);
  };
  const messages = {
    endSession:
      "Are you sure you want to end the session? This action cannot be undone and may affect other participants.",
    leaveSession:
      "Are you sure you want to leave the session? You can rejoin later if needed, but some changes may not be saved.",
  };

  const handleRevealVotes = () => {
    dispatch(revealVotes());
  };

  const handleLeaveSession = () => {
    dispatch(leaveSession());
  };

  const handleEndSession = () => {
    dispatch(endSession());
  };

  const [openDelete, setOpenDelete] = useState(false);
  const handleDeleteClick = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const deleteStory = () => {
    const request = { sessionCode: sessionId, userStoryId: selectedStory?.id };
    handleDeleteStory(request);
    handleCloseDelete();
  };

  const [blinking, setBlinking] = useState(false);
  useEffect(() => {
    if (isScrumMaster && stories.length === 0) {
      setBlinking(true);
    } else {
      setBlinking(false);
    }
  }, [isScrumMaster, stories.length]);

  return (
    <>
      <FrameComponent
        paperSx={{
          flex: 1,
        }}
        sx={{
          paddingY: 1,
          paddingX: 0,
        }}
        title={"User stories"}
        icon={
          isScrumMaster && (
            <IconButton
              onClick={() => setOpenQuilEditor(true)}
              className={blinking ? "blinking" : ""}
            >
              <AddCircleOutline color="secondary" fontSize="small" />
            </IconButton>
          )
        }
      >
        {false ? (
          <LoaderComp />
        ) : (
          <Stack height={"100%"}>
            <Stack spacing={1} height={"25%"} overflow={"auto"} paddingX={1}>
              {stories.map((story) => (
                <StoryComp
                  key={story?.id}
                  title={story?.title}
                  selected={selectedStory?.id === story?.id}
                  estimate={story?.estimate}
                  disabled={!isScrumMaster}
                  onDelete={handleDeleteClick}
                  onClick={() => handleSelectStory(story?.id)}
                />
              ))}
            </Stack>
            <Box px={2}>
              <Divider />
            </Box>
            <Box px={2} my={2}>
              <CurrentVotes
                startTime={roundStart}
                endTime={roundEnd}
                title="Current votes:"
                onClick={handleRevealVotes}
              />
            </Box>
            <Box px={2}>
              <Divider />
            </Box>
            <Stack flex={1} justifyContent={"space-between"} px={2} mt={2}>
              {isScrumMaster && <EstimateForm />}
              <Box display={"flex"} flexDirection={"column"} marginTop={"auto"}>
                <EstimatesFooter
                  sessionId={sessionId}
                  buttonLabel={isScrumMaster ? "End Session" : "Leave Session"}
                  confirmationMessage={
                    isScrumMaster ? messages.endSession : messages.leaveSession
                  }
                  onClick={
                    isScrumMaster ? handleEndSession : handleLeaveSession
                  }
                />
              </Box>
            </Stack>
          </Stack>
        )}
      </FrameComponent>

      <Dialog
        open={openQuilEditor}
        onClose={() => setOpenQuilEditor(false)}
        maxWidth="md"
        fullWidth
      >
        <QuilEditor
          sendData={addStory}
          onSubmit={() => setOpenQuilEditor(false)}
          initial={{
            title: "",
            content:
              "<b>Beschreibung: </b> <br /> <br />  <b>Ist - Zustand:</b> <br /> <br /> <b>Soll- Zustand:</b> <br /> <br />  <b>AKZ: </b> <br /> <br /> <b>Fazit:</b> <br /> <br />",
          }}
          buttonLabel="Save"
        />
      </Dialog>
      <DeleteConfirmationDialog
        open={openDelete}
        onClose={() => handleCloseDelete()}
        onConfirm={deleteStory}
        itemName={selectedStory?.title}
      />
    </>
  );
};

export default EstimatesView;

const styles = `
@keyframes blinkingEffect {
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
}

.blinking {
    animation: blinkingEffect 1.5s infinite;
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
