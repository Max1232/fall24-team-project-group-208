import React from 'react';
import { Box, Button, TextField, Typography, Modal } from '@mui/material';
import useAnswerForm from '../../../hooks/useAnswerForm';

/**
 * NewAnswerModal component allows users to submit an answer to a specific question.
 * The modal contains a text field for the answer text and a button to submit the answer.
 * Throws an error if the text field is empty.
 */
interface NewAnswerModalProps {
  open: boolean;
  onClose: () => void;
}

const NewAnswerModal: React.FC<NewAnswerModalProps> = ({ open, onClose }) => {
  const { text, textErr, setText, postAnswer } = useAnswerForm();

  const handleSubmit = () => {
    postAnswer().then(() => {});
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby='new-answer-modal-title'>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
        <Typography id='new-answer-modal-title' variant='h6' component='h2'>
          Submit Your Answer
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant='outlined'
          label='Answer Text'
          value={text}
          onChange={e => setText(e.target.value)}
          error={!!textErr}
          helperText={textErr}
          sx={{ mt: 2 }}
        />
        <Box mt={2} display='flex' justifyContent='space-between' alignItems='center'>
          <Button variant='contained' color='primary' onClick={handleSubmit}>
            Post Answer
          </Button>
          <Typography variant='caption' color='textSecondary'>
            * indicates mandatory fields
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewAnswerModal;
