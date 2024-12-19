export const QUEUE_PATHS = {};

export const TOPIC_PATHS = {
  SESSION_IDS_GET: () => "/topic/session/ids",
  SESSION_CREATED: () => "/topic/session/created",
  SESSION_JOINED: () => "/topic/session/joined",
  SESSION_RECONNECTED: () => "/topic/session/reconnected",
  SESSION_UPDATES: (sessionId) => `/topic/session/${sessionId}/state`,
};

export const BACKEND_ACTIONS = {
  GET_SESSION_IDS: () => "/app/poker/session/ids/get",
  CREATE_SESSION: () => "/app/poker/create",
  JOIN_SESSION: () => "/app/poker/join",
  RECONNECT_SESSION: () => "/app/poker/reconnect",
  LEAVE_SESSION: () => "/app/poker/leave",
  END_SESSION: () => "/app/poker/close",
  CLOSE_SESSION: () => "/app/poker/close",
  ADD_STORY: () => `/app/poker/story/add`,
  UPDATE_STORY: () => `/app/poker/story/update`,
  DELETE_STORY: () => `/app/poker/story/delete`,
  SELECT_STORY: () => `/app/poker/story/select`,
  VOTE_STORY: () => `/app/poker/story/vote`,
  REVEAL_VOTES: () => `/app/poker/story/reveal`,
  ACCEPT_STORY: () => `/app/poker/story/accept`,
  RESET_STORY: () => `/app/poker/story/reset`,
};

export const FRONTEND_ACTIONS = {};
