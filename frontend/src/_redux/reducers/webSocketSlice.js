import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import WebSocketManager from "../../Common/Config/WebSocketManager";

export const connectWebSocket = createAsyncThunk(
  "webSocket/connectWebSocket",
  async (_, { dispatch, rejectWithValue }) => {
    await WebSocketManager.connect(import.meta.env.VITE_API_BASE_URL);
    dispatch(setConnected(true));
  }
);

export const disconnectWebSocket = createAsyncThunk(
  "webSocket/disconnectWebSocket",
  async (_, { dispatch, rejectWithValue }) => {
    WebSocketManager.disconnect();
    dispatch(setConnected(false));
  }
);

export const sendMessage = createAsyncThunk(
  "webSocket/sendMessage",
  async (request, { dispatch, rejectWithValue }) => {
    const { destination, body } = request;
    WebSocketManager.sendMessage(destination, body);
  }
);

const initialState = {
  connected: false,
  error: null,
};

const webSocketSlice = createSlice({
  name: "webSocket",
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setConnected, setError } = webSocketSlice.actions;
export default webSocketSlice.reducer;
