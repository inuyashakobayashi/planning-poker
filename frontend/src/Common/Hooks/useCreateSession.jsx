import { useCallback, useEffect, useState } from "react";
import GoogleAvatars from "../Vars/GoogleAvatars";
import { createSession } from "../../_redux/reducers/sessionSlice";
import { useDispatch } from "react-redux";
import { DEFAULT_STORY } from "../Vars/DefaultData";

const useCreateSession = () => {
  const [openQuilEditor, setOpenQuilEditor] = useState(false);
  const [sessionEdited, setSessionEdited] = useState(false);
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0);

  const [name, setName] = useState("");
  const [errors, setErrors] = useState({ name: false });
  const [initialStory, setInitialStory] = useState({}); // Story data

  const dispatch = useDispatch();

  const handleOpenQuilEditor = () => {
    setOpenQuilEditor(true);
  };

  const handleCloseQuilEditor = () => {
    setOpenQuilEditor(false);
  };

  const handleSwap = () => {
    setCurrentAvatarIndex((prevIndex) =>
      prevIndex === GoogleAvatars.length - 1 ? 0 : prevIndex + 1
    );
  };

  const getQuillData = useCallback((title, content) => {
    setInitialStory({ title, content });
  }, []);

  useEffect(() => {
    if (initialStory?.content && initialStory.title) {
      setSessionEdited(true);
    } else {
      setSessionEdited(false);
    }
  }, [initialStory]);

  const handleCreateSession = () => {
    const newErrors = {
      name: name.trim() === "",
    };
    setErrors(newErrors);

    if (!newErrors.name) {
      const request = {
        userName: name,
        initialStoryTitle: initialStory?.title ?? DEFAULT_STORY?.title,
        initialStoryDescription:
          initialStory?.content ?? DEFAULT_STORY?.content,
        avatarIndex: currentAvatarIndex,
      };
      dispatch(createSession(request));
    }
  };
  return {
    handleCreateSession,
    handleSwap,
    handleCloseQuilEditor,
    handleOpenQuilEditor,
    currentAvatarIndex,
    setName,
    name,
    sessionEdited,
    openQuilEditor,
    errors,
    getQuillData,
    initialStory,
  };
};

export default useCreateSession;
