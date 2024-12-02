import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Modal, Button } from '@mui/material';
import { Question } from '../../../../types';

/**
 * Props for the Question component.
 *
 * q - The question object.
 * clickTag - Function to handle the tag click event.
 */
interface QuestionProps {
  q: Question;
  clickQuestion: (questionName: string) => void;
}

/**
 * Question component that displays information about a specific question.
 * The component displays the question's title, description, and the number of associated tags.
 * It also triggers a click event to handle tag selection.
 *
 * @param q - The question object.
 * @param clickTag - Function to handle tag clicks.
 */
const QuestionView: React.FC<QuestionProps> = ({ q, clickQuestion }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Card
        variant='outlined'
        sx={{
          'cursor': 'pointer',
          'mb': 2,
          'color': 'primary.main',
          'height': '150px',
          'borderColor': open ? 'transparent' : 'primary.main',
          'borderWidth': '1px',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
        onClick={handleOpen}>
        <CardContent>
          <Typography variant='h2' component='div' gutterBottom>
            {q.title}
          </Typography>
          <Typography variant='body1' color='textSecondary'>
            Question: {q.text}
          </Typography>
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-title'
        aria-describedby='modal-description'>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}>
          <Typography id='modal-title' variant='h3' component='h2'>
            {q.title}
          </Typography>
          <Typography id='modal-description' variant='body1' sx={{ mt: 2 }}>
            Multiple choice question with {q.answers.length} answers
          </Typography>
          <Typography id='modal-description' variant='body1' sx={{ mt: 2 }}>
            Tags: {q.tags.map(tag => tag.name).join(', ')}
          </Typography>
          <Button
            variant='contained'
            color='primary'
            sx={{ mt: 2 }}
            onClick={() => {
              if (q._id) {
                clickQuestion(q._id);
              } else {
                // eslint-disable-next-line no-console
                console.error('Question ID not found');
              }
              handleClose();
            }}>
            View this quiz question
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default QuestionView;
