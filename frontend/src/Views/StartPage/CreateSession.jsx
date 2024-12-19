import React from "react";
import {
    Button,
    TextField,
    Stack,
    Grid,
    Box,
    Dialog,
    IconButton,
} from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GoogleAvatars from "../../Common/Vars/GoogleAvatars";
import BoxHeader from "../../Components/Frames/BoxHeader.jsx";
import { DragIndicator } from "@mui/icons-material";
import useCreateSession from "../../Common/Hooks/useCreateSession.jsx";
import QuilEditor from "./../../PartialViews/QuilEditor";
import { DEFAULT_STORY } from "../../Common/Vars/DefaultData";

function CreateSession() {
    const {
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
    } = useCreateSession();

    return (
        <Grid
            container
            sx={{
                width: "100%",
                maxWidth: "600px",
                mt: 3,
                backgroundColor: "transparent",
                borderRadius: "8px",
                margin: "auto",
            }}
        >
            <BoxHeader />
            <Grid item xs={12} container spacing={2} mt={1}>
                <Grid
                    item
                    xs={4}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Box sx={{ position: "relative", display: "inline-flex" }}>
                        <img
                            src={GoogleAvatars[currentAvatarIndex]}
                            alt="avatar-logo"
                            style={{ width: "140px", height: "140px", borderRadius: "50%" }}
                        />
                        <IconButton
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                right: "5%",
                                boxShadow: 3,
                                transition: "transform 0.2s, box-shadow 0.2s",
                                backgroundColor: "common.white",
                                color: "common.white",
                                "&:hover": {
                                    backgroundColor: "common.white",
                                    transform: "scale(1.1)",
                                    boxShadow: 6,
                                },
                            }}
                            onClick={handleSwap}
                        >
                            <SwapHorizIcon sx={{ color: "primary.main" }} />
                        </IconButton>
                    </Box>
                </Grid>
                <Grid item xs={8} sx={{ mt: 2 }}>
                    <Stack
                        spacing={2}
                        sx={{
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Name"
                            variant="outlined"
                            value={name}
                            size="small"
                            onChange={(e) => setName(e.target.value)}
                            error={errors.name}
                            helperText={errors.name ? "This field is required" : ""}
                        />
                        <Button
                            variant="outlined"
                            color={sessionEdited ? "success" : "primary"}
                            size="small"
                            startIcon={!sessionEdited && <NoteAddIcon />}
                            endIcon={sessionEdited && <CheckCircleIcon />}
                            fullWidth
                            sx={{
                                fontSize: "1rem",
                            }}
                            onClick={handleOpenQuilEditor}
                        >
                            {sessionEdited ? "EDITED" : "ADD STORY"}
                        </Button>
                    </Stack>
                </Grid>
            </Grid>

            <Button
                variant="contained"
                fullWidth
                startIcon={<DragIndicator />}
                onClick={handleCreateSession}
                sx={{
                    mt: 2,
                }}
            >
                CREATE
            </Button>

            <Dialog
                open={openQuilEditor}
                onClose={handleCloseQuilEditor}
                maxWidth="md"
                fullWidth
            >
                <Box p={1}>
                    <QuilEditor
                        initial={DEFAULT_STORY}
                        sendData={getQuillData}
                        onSubmit={handleCloseQuilEditor}
                    />
                </Box>
            </Dialog>
        </Grid>
    );
}

export default CreateSession;
