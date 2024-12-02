import React, { useState } from 'react';
import { Box, Typography, Grid, Button, Dialog } from '@mui/material';
import QuestionView from './question';
import useQuizPage from '../../../hooks/useQuizPage';
import NewQuestionPage from '../newQuestion';

/**
 * Represents the QuizPage component which displays a list of questions
 * and provides functionality to handle tag clicks and ask a new question.
 */
const QuizPage = () => {
  const { qlist, clickQuestion } = useQuizPage();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box p={3}>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
      <Typography variant='h2' sx={{ color: 'primary.main' }}>Quizzes</Typography>   
        <Button variant='contained' color='primary' onClick={handleOpen}>
          Ask a Question
        </Button>
      </Box>
      <Box display='flex' flexDirection='column' width='100%'>
        {qlist.map((q, idx) => (
          <Box key={idx} mb={2}>
            <QuestionView q={q} clickQuestion={clickQuestion} />
          </Box>
        ))}
      </Box>
      <Dialog open={open} fullWidth maxWidth='md'>
        <NewQuestionPage onClose={handleClose} />
      </Dialog>
    </Box>
  );
};

export default QuizPage;
