import React from 'react';
import {
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import useNewQuestion from '../../../hooks/useNewQuestion';

interface NewQuestionPageProps {
  onClose: () => void;
}

const NewQuestionPage: React.FC<NewQuestionPageProps> = ({ onClose }) => {
  const {
    title,
    setTitle,
    text,
    setText,
    tagNames,
    setTagNames,
    titleErr,
    textErr,
    tagErr,
    postQuestion,
    showAlert,
    alertMessage,
    setShowAlert,
  } = useNewQuestion();

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
        <TextField
          margin='dense'
          label='Tags'
          type='text'
          fullWidth
          value={tagNames}
          onChange={e => setTagNames(e.target.value)}
          error={!!tagErr}
          helperText={tagErr}
        />
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
    </>
  );
};

export default NewQuestionPage;
