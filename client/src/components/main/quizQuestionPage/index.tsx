/* eslint-disable no-console */
import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import AnswerHeader from './header';
import QuestionBody from './questionBody';
import AnswerView from './answer';
import { getMetaData } from '../../../tool';
import useAnswerPage from '../../../hooks/useAnswerPage';

/**
 * AnswerPage component that displays the full content of a question along with its answers.
 * It also includes the functionality to vote, ask a new question, and post a new answer.
 */
const AnswerPage: React.FC = () => {
  const { question } = useAnswerPage();
  const [checkboxLocked, setCheckboxLocked] = React.useState(false);
  const [selectedAnswerId, setSelectedAnswerId] = React.useState<string | null>(null);

  const handleSubmitClick = () => {
    console.log('Submit clicked');
    // TODO: Fix question?.correctAnswerIndex set, it is returning undefined
    if (checkboxLocked && selectedAnswerId) {
      // Check if the answer is correct

      const userAnswer = selectedAnswerId;
      console.log('User answer:', userAnswer);
      console.log('Correct answer:', question?.correctAnswerIndex);
      if (userAnswer === question?.correctAnswerIndex) {
        console.log('Correct');
        /** TODO: Handle correct answer
         * - Update user reputation (Required)
         * - Display success message (desireable)
         * - Redirect to home page? (optional)
         * - Lock the quiz? (optional)
         */
      } else {
        console.log('Wrong');
      }
    }
  };

  const handleCheckboxChange = (answerId: string) => {
    console.log('Checkbox selected for answer with id of:', answerId);
    setCheckboxLocked(true);
    setSelectedAnswerId(answerId);
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
        question={question}
      />
      {question.answers.map((a, idx) => (
        <AnswerView
          key={idx}
          text={a.text}
          ansBy={a.ansBy}
          id={a._id || ''}
          meta={getMetaData(new Date(a.ansDateTime))}
          checkboxLocked={checkboxLocked}
          onCheckboxChange={() => handleCheckboxChange(a._id || '')}
        />
      ))}
      <Box mt={3} display='flex' justifyContent='center'>
        <Button variant='contained' color='primary' onClick={handleSubmitClick}>
          Answer Question
        </Button>
        {/* <NewAnswerModal open={open} onClose={handleClose} /> */}
      </Box>
    </Box>
  );
};

export default AnswerPage;
