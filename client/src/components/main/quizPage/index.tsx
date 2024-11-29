import React, { useState } from 'react';
import { Box, Typography, Grid, Button, Dialog } from '@mui/material';
import QuestionView from './question';
import useQuizPage from '../../../hooks/useQuizPage';
import NewQuestionPage from '../newQuestion';
import { QuestionsWithTag } from '../../../types';

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
        <Typography variant='h4'>All Questions</Typography>
        <Typography variant='body1'>{qlist.length} Questions</Typography>
        <Button variant='contained' color='primary' onClick={handleOpen}>
          Ask a Question
        </Button>
      </Box>
      <Grid container spacing={2}>
        {qlist.map((q, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
            <QuestionView q={q} clickQuestion={clickQuestion} />
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} fullWidth maxWidth='md'>
        <NewQuestionPage onClose={handleClose} />
      </Dialog>
    </Box>
  );
};

export default QuizPage;
