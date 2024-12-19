import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectWebSocket } from "../../_redux/reducers/webSocketSlice";
import { connectSession } from "../../_redux/reducers/sessionSlice";
import WebSocketManager from "../Config/WebSocketManager";
import { getTokenData } from "../Utils/tokenUtils";

const useWebSocketListener = () => {
  const dispatch = useDispatch();
  const sessionId = useSelector((state) => state.session.sessionId);

  const reconnectToSession = useCallback(async () => {
    if (getTokenData()?.sessionId && !sessionId) {
      if (await WebSocketManager.isFullyConnectedAsync()) {
        dispatch(connectSession());
      }
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(connectWebSocket());
    reconnectToSession();
  }, [dispatch]);
};

export default useWebSocketListener;
