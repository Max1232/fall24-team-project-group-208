import React from 'react';
import { DialogContent, DialogTitle, TextField, DialogActions, Button } from '@mui/material';
import useNewQuestion from '../../../hooks/useNewQuestion';

interface NewQuestionPageProps {
  onClose: () => void;
}

/**
 * NewQuestionPage component allows users to submit a new question with a title,
 * description, tags, and username.
 */
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
  } = useNewQuestion();

  const handleSubmit = () => {
    postQuestion();
    onClose();
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
    </>
  );
};

export default NewQuestionPage;
