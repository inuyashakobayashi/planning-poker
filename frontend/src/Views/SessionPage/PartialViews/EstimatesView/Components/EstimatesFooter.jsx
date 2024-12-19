import { PowerSettingsNew } from "@mui/icons-material";
import {
    Button,
    Stack,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
} from "@mui/material";
import React, { useState } from "react";
import PropTypes from "prop-types";
import QuilEditor from "../../../../../PartialViews/QuilEditor.jsx";
import ConfirmationDialog from "../../../../../PartialViews/ConfirmationDialog";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const EstimatesFooter = ({
                             sessionId = "a23389cc",
                             buttonLabel = "End session",
                             confirmationMessage = "Are you sure?",
                             onClick = () => {},
                         }) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = () => {
        setOpen(false);
        onClick();
    };

    return (
        <Stack justifyContent={"flex-start"} justifySelf={"flex-end"} spacing={2}>
            <Typography
                variant="caption"
                fontSize={"0.8rem"}
                sx={{ fontFamily: "'Source Sans Pro', sans-serif", marginBottom: "0.5rem" }}
            >
                Session ID: {sessionId}
            </Typography>
            <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<PowerSettingsNew />}
                onClick={handleClickOpen}
                sx={{
                    fontFamily: "'Source Sans Pro', sans-serif",
                    padding: "0.5rem 1rem",
                }}
            >
                {buttonLabel}
            </Button>

            <ConfirmationDialog
                open={open}
                onClose={handleClose}
                onConfirm={handleConfirm}
                title="Are you sure?"
                description={confirmationMessage}
                confirmColor="#CAD400"
            />
        </Stack>
    );
};

EstimatesFooter.propTypes = {
    sessionId: PropTypes.string.isRequired,
    buttonLabel: PropTypes.string,
    confirmationMessage: PropTypes.string,
    onClick: PropTypes.func.isRequired,
};

export default EstimatesFooter;
