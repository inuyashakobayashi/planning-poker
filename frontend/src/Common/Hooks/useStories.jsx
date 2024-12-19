import { useDispatch, useSelector } from "react-redux";
import {
  addStory,
  removeStory,
  selectStory,
  updateStory,
} from "../../_redux/reducers/storySlice";
import { getTokenData } from "../Utils/tokenUtils";

const useStories = () => {
  const dispatch = useDispatch();
  const { status, stories, selectedStory } = useSelector(
    (state) => state.story
  );

  const handleAddStory = (title, content) => {
    const newStory = {
      sessionCode: getTokenData().sessionId,
      title,
      description: content,
    };
    dispatch(addStory(newStory));
  };

  const handleSelectStory = (storyId) => {
    dispatch(selectStory(storyId));
  };

  const handleUpdateStory = (updatedStory) => {
    dispatch(updateStory(updatedStory));
  };

  const handleDeleteStory = (request) => {
    dispatch(removeStory(request));
  };

  return {
    status,
    stories,
    selectedStory,
    handleSelectStory,
    handleUpdateStory,
    handleAddStory,
    handleDeleteStory,
  };
};

export default useStories;
