import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import { SmartToy, Close } from "@mui/icons-material";

interface AskAssistantButtonProps {
  onAskAssistant: (question: string) => Promise<void>;
}

const AskAssistantButton: React.FC<AskAssistantButtonProps> = ({
  onAskAssistant,
}) => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setQuestion("");
  };

  const handleSubmit = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      await onAskAssistant(question);
      handleClose();
    } catch (error) {
      console.error("Error asking assistant:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Ask AI Assistant">
        <IconButton
          onClick={handleOpen}
          color="primary"
          sx={{
            position: "absolute",
            bottom: 80,
            right: 20,
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
            width: 50,
            height: 50,
            boxShadow: 3,
          }}
        >
          <SmartToy />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <SmartToy sx={{ mr: 1 }} />
            Ask AI Assistant
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{ ml: "auto" }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Your question"
            fullWidth
            variant="outlined"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            multiline
            rows={3}
            placeholder="Ask anything about the conversation or general knowledge..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading || !question.trim()}
          >
            {loading ? "Asking..." : "Ask Assistant"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AskAssistantButton;
