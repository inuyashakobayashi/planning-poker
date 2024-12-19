import { setMembers } from "../../_redux/reducers/memberSlice";
import {
  clearSession,
  setRoundEnd,
  setRoundStart,
} from "../../_redux/reducers/sessionSlice";
import { setVotesRevealed } from "../../_redux/reducers/storySlice";

import {
  setSelectedStory,
  setStories,
  setVotes,
} from "../../_redux/reducers/storySlice";
import { sendMessage } from "../../_redux/reducers/webSocketSlice";
import WebSocketManager from "../Config/WebSocketManager";
import { TOPIC_PATHS } from "../Vars/Channels";
import { STATUS } from "../Vars/Constants";
import { generateToken, getToken, setToken } from "./tokenUtils";

function formatRoleString(role) {
  return role
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const dispatchSessionData = (dispatch, data) => {
  const {
    userStories,
    participants,
    currentUserStoryId,
    sessionVotes,
    votesRevealed,
    roundStart,
    roundEnd,
  } = data;
  let stories = userStories;
  let members = participants;
  let votes = sessionVotes;

  if (stories === null) stories = [];
  // Dispatch addStory action for each story
  const mappedStories = stories.map((story) => ({
    id: story?.id,
    title: story?.title,
    estimate: story?.estimate || 0,
    content: story?.description,
  }));

  dispatch(setStories(mappedStories));

  if (members === null) members = [];
  // Dispatch addMember action for each member
  const mappedMembers = members.map((member) => ({
    id: member?.id,
    name: member?.name,
    avatarIndex: member?.avatarIndex ?? 0,
    lastVote: 0,
    voted: false,
    role: formatRoleString(member?.role),
  }));

  dispatch(setMembers(mappedMembers));

  let story = mappedStories.find((story) => story.id === currentUserStoryId);
  if (!story && mappedStories?.length > 0) story = mappedStories[0];
  dispatch(setSelectedStory(story));

  // ----------------------------------------------------------------------------
  if (votes === null) votes = [];
  const mappedVotes = votes?.map((vote) => ({
    memberId: vote?.userId,
    estimation: vote?.estimation,
  }));
  dispatch(setVotes(mappedVotes));

  // ---------------------
  dispatch(setVotesRevealed(votesRevealed));
  dispatch(setRoundStart(new Date(roundStart)));
  dispatch(setRoundEnd(new Date(roundEnd)));
};

export const handleSessionUpdates = (dispatch, data) => {
  const { sessionId, participants } = data;
  if (sessionId == null || participants == null) {
    dispatch(clearSession());
  } else {
    dispatchSessionData(dispatch, data);
  }
};

// Handler for pending state
export const handlePending = (state) => {
  state.status = STATUS.LOADING;
  state.error = null;
};

// Handler for fulfilled state
export const handleFulfilled = (state, { payload }) => {
  state.status = STATUS.SUCCEEDED;
  state.sessionId = payload.sessionId;
  state.token = payload.token;
};

// Handler for rejected state
export const handleRejected = (state, { payload }) => {
  state.status = STATUS.FAILED;
  state.error = payload;
};

export const handleSessionResponse = async (
  dispatch,
  destination,
  subscription,
  request,
  resolve,
  reject,
  keepToken = false
) => {
  try {
    // Check if WebSocket is fully connected
    if (await WebSocketManager.isFullyConnectedAsync()) {
      // Subscribe to the session creation topic
      await WebSocketManager.subscribe(subscription, async (data) => {
        try {
          debugger;
          // Handle session updates and extract sessionId and token
          handleSessionUpdates(dispatch, data);
          const { sessionId } = data;

          let token;
          if (keepToken) {
            token = getToken();
          } else {
            token = generateToken(data);
            setToken(token);
          }

          await WebSocketManager.subscribe(
            TOPIC_PATHS.SESSION_UPDATES(sessionId),
            (data) => {
              handleSessionUpdates(dispatch, data);
            }
          );

          WebSocketManager.unsubscribe(subscription); // Unsubscribe to prevent duplicate handling
          resolve({ sessionId, token });
        } catch (error) {
          console.error("Error handling session creation message:", error);
          reject(error); // Reject if processing the message fails
        }
      });

      // Send the create session request via WebSocket
      const action = {
        destination,
        body: request,
      };
      dispatch(sendMessage(action));
    } else {
      throw new Error("WebSocket is not connected.");
    }
  } catch (error) {
    console.error("Failed to create session:", error);
    reject(error); // Reject if WebSocket is not connected or other errors occur
  }
};
