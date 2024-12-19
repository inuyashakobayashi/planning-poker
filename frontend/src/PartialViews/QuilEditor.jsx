import React, { useState, useMemo, Suspense, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import { TextField, Button, Box, Typography, Stack } from "@mui/material";
import ReactQuill from "react-quill";
import PropTypes from "prop-types";
import LoaderComp from "./../Components/Extras/LoaderComp";
import { DEFAULT_STORY } from "../Common/Vars/DefaultData";

function QuilEditor({
  sendData = (title, content) => {
    return { title, content };
  },
  onSubmit = () => {},
  initial,
  buttonLabel = "CONTINUE SESSION",
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ size: [] }],
        [{ font: [] }],
        [{ align: ["right", "center", "justify"] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: ["red", "#785412"] }],
        [{ background: ["red", "#785412"] }],
      ],
    }),
    []
  );

  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "link",
      "color",
      "background",
      "align",
      "size",
      "font",
    ],
    []
  );

  const handleContentChange = (content) => {
    setContent(content);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleSubmit = () => {
    sendData(title, content);
    onSubmit();
    alert("Story saved successfully!");
  };

  useEffect(() => {
    if (initial?.title && initial.content) {
      setTitle(initial.title);
      setContent(initial.content);
    } else {
      setTitle(DEFAULT_STORY?.title);
      setContent(DEFAULT_STORY?.content);
    }
  }, [initial]);

  return (
    <Box sx={{ p: 3, backgroundColor: "#ffffff", borderRadius: "8px" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
        height="10vh"
        width="100%"
        mb={2}
      >
        <img
          height="100%"
          alt="dos-logo"
          src="https://www.dos-online.de/wp-content/uploads/2023/08/cropped-DOS_Logo_2023_mit_UZ_RGB.png"
        />
        <Typography variant="h5">SCRUM Planning Poker</Typography>
      </Stack>

      <TextField
        fullWidth
        label="Story Title"
        variant="outlined"
        value={title}
        size="small"
        onChange={handleTitleChange}
        sx={{ mb: 2 }}
      />

      <Suspense fallback={<LoaderComp />}>
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          value={content}
          onChange={handleContentChange}
          style={{ maxHeight: "20rem", height: "20rem", width: "100%" }}
        />
      </Suspense>

      <Button
        onClick={handleSubmit}
        variant="contained"
        fullWidth
        sx={{ mt: 8 }}
      >
        {buttonLabel}
      </Button>
    </Box>
  );
}

QuilEditor.propTypes = {
  sendData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initial: PropTypes.object,
  buttonLabel: PropTypes.string,
};

export default QuilEditor;
