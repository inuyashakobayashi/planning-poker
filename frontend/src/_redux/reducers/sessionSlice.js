import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { STATUS } from "../../Common/Vars/Constants";
import { removeToken, getTokenData } from "../../Common/Utils/tokenUtils";
import {
  handleFulfilled,
  handlePending,
  handleRejected,
  handleSessionResponse,
} from "../../Common/Utils/sessionUtils";
import { sendMessage } from "./webSocketSlice";
import { BACKEND_ACTIONS, TOPIC_PATHS } from "../../Common/Vars/Channels";
import WebSocketManager from "../../Common/Config/WebSocketManager";

export const createSession = createAsyncThunk(
  "session/createSession",
  async (request, { dispatch }) => {
    return new Promise(async (resolve, reject) => {
      const destination = BACKEND_ACTIONS.CREATE_SESSION();
      const subscription = TOPIC_PATHS.SESSION_CREATED();

      handleSessionResponse(
        dispatch,
        destination,
        subscription,
        request,
        resolve,
        reject
      );
    });
  }
);

export const joinSession = createAsyncThunk(
  "session/joinSession",
  async (request, { dispatch }) => {
    return new Promise(async (resolve, reject) => {
      const destination = BACKEND_ACTIONS.JOIN_SESSION();
      const subscription = TOPIC_PATHS.SESSION_JOINED();

      handleSessionResponse(
        dispatch,
        destination,
        subscription,
        request,
        resolve,
        reject
      );
    });
  }
);

export const connectSession = createAsyncThunk(
  "session/connectSession",
  async (_, { dispatch }) => {
    return new Promise(async (resolve, reject) => {
      const { sessionId, memberId } = getTokenData();
      const request = { sessionCode: sessionId, userId: memberId };

      const destination = BACKEND_ACTIONS.RECONNECT_SESSION();
      const subscription = TOPIC_PATHS.SESSION_RECONNECTED();

      handleSessionResponse(
        dispatch,
        destination,
        subscription,
        request,
        resolve,
        reject,
        true
      );
    });
  }
);

export const leaveSession = createAsyncThunk(
  "session/leaveSession",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      return new Promise(async () => {
        if (await WebSocketManager.isFullyConnectedAsync()) {
          const { sessionId, memberId } = getTokenData();

          if (!sessionId || !memberId) {
            rejectWithValue("No session or member data available.");
            return;
          }
          const destination = BACKEND_ACTIONS.LEAVE_SESSION();
          const request = { sessionCode: sessionId, userId: memberId };
          const action = { destination, body: request };
          dispatch(sendMessage(action));
          dispatch(clearSession());
        }
      });
    } catch (error) {
      return rejectWithValue("Failed to leave the session.");
    }
  }
);

export const endSession = createAsyncThunk(
  "session/endSession",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      return new Promise(async () => {
        if (await WebSocketManager.isFullyConnectedAsync()) {
          const { sessionId, memberId } = getTokenData();

          if (!sessionId || !memberId) {
            rejectWithValue("No session or member data available.");
            return;
          }

          const destination = BACKEND_ACTIONS.END_SESSION();
          const request = { sessionCode: sessionId, userId: memberId };
          const action = { destination, body: request };
          dispatch(sendMessage(action));
          dispatch(clearSession());
        }
      });
    } catch (error) {
      return rejectWithValue("Failed to close the session.");
    }
  }
);

export const getSessions = createAsyncThunk(
  "session/getSessions",
  async (_, { dispatch }) => {
    if (await WebSocketManager.isFullyConnectedAsync()) {
      const action = {
        destination: BACKEND_ACTIONS.GET_SESSION_IDS(),
        body: {},
      };
      dispatch(sendMessage(action));
    }
  }
);

const thunkReducers = [
  createSession,
  joinSession,
  connectSession,
  // getSessions,
  // leaveSession,
  // endSession,
];

const initialState = {
  activeSessionIds: null,
  sessionId: null,
  roundStart: null,
  roundEnd: null,
  token: null,
  isScrumMaster: null,
  status: STATUS.IDLE,
  error: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setActiveSessionIds(state, { payload }) {
      state.activeSessionIds = payload;
    },
    setScrumMaster(state, { payload }) {
      state.isScrumMaster = payload;
    },
    setRoundStart(state, { payload }) {
      state.roundStart = payload;
    },
    setRoundEnd(state, { payload }) {
      state.roundEnd = payload;
    },
    clearSession(state) {
      state.sessionId = null;
      state.token = null;
      removeToken();
    },
  },
  extraReducers: (builder) => {
    thunkReducers.forEach((thunk) => {
      builder
        .addCase(thunk.pending, handlePending)
        .addCase(thunk.fulfilled, handleFulfilled)
        .addCase(thunk.rejected, handleRejected);
    });
  },
});

export const {
  setActiveSessionIds,
  clearSession,
  setScrumMaster,
  setRoundStart,
  setRoundEnd,
} = sessionSlice.actions;
export default sessionSlice.reducer;
