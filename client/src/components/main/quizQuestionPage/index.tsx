import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import AnswerHeader from './header';
import QuestionBody from './questionBody';
import AnswerView from './answer';
import { getMetaData } from '../../../tool';
import NewAnswerModal from '../newAnswer';
import useAnswerPage from '../../../hooks/useAnswerPage';

/**
 * AnswerPage component that displays the full content of a question along with its answers.
 * It also includes the functionality to vote, ask a new question, and post a new answer.
 */
const AnswerPage: React.FC = () => {
  const { question } = useAnswerPage();
  const [open, setOpen] = React.useState(false);
  const [checkboxLocked, setCheckboxLocked] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckboxChange = () => {
    setCheckboxLocked(true);
  };

  if (!question) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
        <CircularProgress color='primary' />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <AnswerHeader ansCount={question.answers.length} title={question.title} />
      <QuestionBody
        views={question.views.length}
        text={question.text}
        askby={question.askedBy}
        meta={getMetaData(new Date(question.askDateTime))}
        answerCount={question.answers.length}
        questionID={question._id || ''}
      />
      {question.answers.map((a, idx) => (
        <AnswerView
          key={idx}
          text={a.text}
          ansBy={a.ansBy}
          meta={getMetaData(new Date(a.ansDateTime))}
          checkboxLocked={checkboxLocked}
          onCheckboxChange={handleCheckboxChange}
        />
      ))}
      <Box mt={3} display='flex' justifyContent='center'>
        <Button variant='contained' color='primary' onClick={handleClickOpen}>
          Answer Question
        </Button>
        <NewAnswerModal open={open} onClose={handleClose} />
      </Box>
    </Box>
  );
};

export default AnswerPage;
