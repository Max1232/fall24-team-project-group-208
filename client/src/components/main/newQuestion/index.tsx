import React, { useState } from 'react';
import {
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
  Button,
  Alert,
  Snackbar,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import useNewQuestion from '../../../hooks/useNewQuestion';
import useTagPage from '../../../hooks/useTagPage';
import { TagData } from '../../../types';

interface NewQuestionPageProps {
  onClose: () => void;
}

/**
 * NewQuestionPage component
 *
 * This component renders a dialog for asking a new question. It includes fields for the question title,
 * text, and tags, and provides validation feedback. It also handles the submission of the new question.
 *
 * @param {NewQuestionPageProps} props - The props for the component
 * @param {() => void} props.onClose - Function to call when the dialog is closed
 */
const NewQuestionPage: React.FC<NewQuestionPageProps> = ({ onClose }: NewQuestionPageProps) => {
  const {
    title,
    setTitle,
    text,
    setText,
    tagNames,
    setTagNames,
    setTagDescription,
    titleErr,
    textErr,
    tagErr,
    postQuestion,
    showAlert,
    alertMessage,
    setShowAlert,
  } = useNewQuestion();

  const { tlist, clickTag } = useTagPage();
  
  const [openNewTagDialog, setOpenNewTagDialog] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagDescription, setNewTagDescription] = useState('');

  const handleNewTagSubmit = () => {
    if (newTagName && newTagDescription) {
      setTagNames(newTagName);
      setTagDescription(newTagDescription);
      setOpenNewTagDialog(false);

    } else if (newTagName) {
      setTagNames(newTagName);
      setTagDescription('');
      setOpenNewTagDialog(false);

    }
  };

  /**
   * Handles the submission of the new question.
   * If the question is successfully posted, the dialog is closed.
   */
  const handleSubmit = async () => {
    const success = await postQuestion();
    if (success) {
      onClose(); // Only close the dialog if the question was successfully posted
    }
  };

  return (
    <>
      <DialogTitle>Ask a New Question</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          label='Question Title'
          type='text'
          fullWidth
          value={title}
          onChange={e => setTitle(e.target.value)}
          error={!!titleErr}
          helperText={titleErr}
        />
        <TextField
          margin='dense'
          label='Question Text'
          type='text'
          fullWidth
          multiline
          rows={4}
          value={text}
          onChange={e => setText(e.target.value)}
          error={!!textErr}
          helperText={textErr}
        />
        <FormControl fullWidth margin='dense'>
          <InputLabel>Tags</InputLabel>
          <Select
            value={tagNames}
            onChange={e => setTagNames(e.target.value)}
            error={!!tagErr}>
            {tlist.map((t: TagData) => (
              <MenuItem key={t.name} value={t.name}>
                {t.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button onClick={() => setOpenNewTagDialog(true)} color='primary'>
          Add New Tag
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color='primary'>
          Post Question
        </Button>
      </DialogActions>
      <Snackbar open={showAlert} autoHideDuration={3000} onClose={() => setShowAlert(false)}>
        <Alert severity='error' onClose={() => setShowAlert(false)}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Dialog open={openNewTagDialog} onClose={() => setOpenNewTagDialog(false)}>
        <DialogTitle>Add New Tag</DialogTitle>
        <DialogContent>
          <TextField
            margin='dense'
            label='Tag Name'
            type='text'
            fullWidth
            value={newTagName}
            onChange={e => setNewTagName(e.target.value)}
          />
          <TextField
            margin='dense'
            label='Tag Description'
            type='text'
            fullWidth
            value={newTagDescription}
            onChange={e => setNewTagDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewTagDialog(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleNewTagSubmit} color='primary'>
            Add Tag
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NewQuestionPage;
