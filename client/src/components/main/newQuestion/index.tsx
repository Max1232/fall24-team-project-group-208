import React, { useState, SyntheticEvent } from 'react';
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
  Autocomplete,
} from '@mui/material';
import useNewQuestion from '../../../hooks/useNewQuestion';
import useTagPage from '../../../hooks/useTagPage';
import { TagData } from '../../../types';

interface NewQuestionPageProps {
  onClose: () => void;
}

const NewQuestionPage: React.FC<NewQuestionPageProps> = ({ onClose }) => {
  const {
    title,
    setTitle,
    text,
    setText,
    tags,
    setTags,
    titleErr,
    textErr,
    tagErr,
    postQuestion,
    showAlert,
    alertMessage,
    setShowAlert,
  } = useNewQuestion();

  const { tlist } = useTagPage();
  const [openNewTagDialog, setOpenNewTagDialog] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagDescription, setNewTagDescription] = useState('');

  const handleNewTagSubmit = () => {
    if (newTagName) {
      setTags(prevTags => {
        const newTags = new Map(prevTags);
        newTags.set(newTagName, newTagDescription || '');
        return newTags;
      });
      setOpenNewTagDialog(false);
      setNewTagName('');
      setNewTagDescription('');
    }
  };

  const handleTagChange = (_event: SyntheticEvent, newValue: string[]) => {
    const newTags = new Map();
    newValue.forEach((tag: string) => {
      const existingDesc = tags.get(tag) || '';
      newTags.set(tag, existingDesc);
    });
    setTags(newTags);
  };

  const handleSubmit = async () => {
    const success = await postQuestion();
    if (success) {
      onClose();
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
          fullWidth
          value={title}
          onChange={e => setTitle(e.target.value)}
          error={!!titleErr}
          helperText={titleErr}
        />
        <TextField
          margin='dense'
          label='Question Text'
          fullWidth
          multiline
          rows={4}
          value={text}
          onChange={e => setText(e.target.value)}
          error={!!textErr}
          helperText={textErr}
        />

        <FormControl fullWidth margin='dense'>
          <Autocomplete
            multiple
            id='tags-standard'
            options={tlist.map((t: TagData) => t.name)}
            value={Array.from(tags.keys())}
            onChange={handleTagChange}
            renderInput={params => (
              <TextField
                {...params}
                variant='standard'
                label='Tags'
                error={!!tagErr}
                helperText={tagErr}
              />
            )}
          />
        </FormControl>

        <Button onClick={() => setOpenNewTagDialog(true)} color='primary'>
          Add New Tag
        </Button>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
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
            fullWidth
            value={newTagName}
            onChange={e => setNewTagName(e.target.value)}
          />
          <TextField
            margin='dense'
            label='Tag Description'
            fullWidth
            value={newTagDescription}
            onChange={e => setNewTagDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewTagDialog(false)}>Cancel</Button>
          <Button onClick={handleNewTagSubmit} color='primary'>
            Add Tag
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NewQuestionPage;
