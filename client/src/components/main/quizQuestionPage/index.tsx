import React from 'react';
import { Box, Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import AnswerHeader from './header';
import QuestionBody from './questionBody';
import AnswerView from './answer';
import { getMetaData } from '../../../tool';
import useAnswerPage from '../../../hooks/useAnswerPage';

const AnswerPage: React.FC = () => {
  const { question } = useAnswerPage();
  const [checkboxLocked, setCheckboxLocked] = React.useState(false);
  const [selectedAnswerId, setSelectedAnswerId] = React.useState<string | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(false);

  const handleSubmitClick = () => {
    console.log('Submit button clicked');
    console.log('Current state:', {
      selectedAnswerId,
      checkboxLocked,
      questionCorrectId: question?.correctAnswerId,
    });

    if (!selectedAnswerId) {
      console.log('No answer selected');
      setShowFeedback(true);
      setIsCorrect(false);
      return;
    }

    // Force feedback to show
    setShowFeedback(true);

    if (question?.correctAnswerId) {
      console.log('Comparing answers:', {
        selected: selectedAnswerId,
        correct: question.correctAnswerId,
        isMatch: selectedAnswerId === question.correctAnswerId,
      });

      setIsCorrect(selectedAnswerId === question.correctAnswerId);
    } else {
      console.log('No correct answer ID found in question:', question);
    }
  };

  const handleCheckboxChange = (answerId: string) => {
    console.log('Checkbox changed:', answerId);
    setCheckboxLocked(true);
    setSelectedAnswerId(answerId);
  };

  const handleCloseFeedback = () => {
    setShowFeedback(false);
  };

  // Debug log when component renders
  console.log('Rendering AnswerPage with:', {
    questionId: question?._id,
    correctAnswerId: question?.correctAnswerId,
    selectedAnswerId,
    checkboxLocked,
  });

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
          Submit Answer
        </Button>
      </Box>

      <Snackbar
        open={showFeedback}
        autoHideDuration={6000}
        onClose={handleCloseFeedback}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={handleCloseFeedback}
          severity={isCorrect ? 'success' : 'error'}
          variant='filled'>
          {!selectedAnswerId
            ? 'Please select an answer first'
            : isCorrect
              ? '🎉 Correct! Well done!'
              : "Sorry, that's not correct. Try again!"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AnswerPage;
