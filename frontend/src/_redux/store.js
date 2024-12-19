import { configureStore } from "@reduxjs/toolkit";
import memberReducer from "./reducers/memberSlice";
import storyReducer from "./reducers/storySlice";
import sessionReducer from "./reducers/sessionSlice";
import webSocketReducer from "./reducers/webSocketSlice";

const store = configureStore({
  reducer: {
    member: memberReducer,
    story: storyReducer,
    session: sessionReducer,
    webSocket: webSocketReducer,
  },
});

export default store;
