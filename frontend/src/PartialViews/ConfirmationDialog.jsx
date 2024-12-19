import React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from "@mui/material";

const ConfirmationDialog = ({ open, onClose, onConfirm, title, description }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-describedby="alert-dialog-slide-description"
            keepMounted
        >
            <DialogTitle
                sx={{
                    backgroundColor: "#004259",
                    color: "white",
                    fontWeight: "bold",
                    fontFamily: "'Source Sans Pro', sans-serif",
                    padding: "1rem 1rem",
                }}
            >
                {title || "Are you sure?"}
            </DialogTitle>
            <DialogContent
                sx={{
                    padding: "1.5rem 1.5rem 0.5rem",
                    marginTop: "1rem",
                }}
            >
                <DialogContentText
                    sx={{
                        fontFamily: "'Source Sans Pro', sans-serif",
                        fontSize: "1rem",
                        color: "#333",
                    }}
                >
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions
                sx={{
                    justifyContent: "center",
                    padding: "1rem",
                }}
            >
                <Button
                    onClick={onClose}
                    sx={{
                        backgroundColor: "white",
                        color: "red",
                        fontFamily: "'Source Sans Pro', sans-serif",
                        padding: "0.5rem 2rem",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        border: "2px solid red",
                        "&:hover": {
                            backgroundColor: "#ffe6e6",
                        },
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    sx={{
                        backgroundColor: "white",
                        color: "#CAD400",
                        fontFamily: "'Source Sans Pro', sans-serif",
                        padding: "0.5rem 2rem",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        border: "2px solid #CAD400",
                        "&:hover": {
                            backgroundColor: "#f9f9f9",
                        },
                    }}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
