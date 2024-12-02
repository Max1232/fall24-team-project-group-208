import React from 'react';
import { Box, Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import AnswerHeader from './header';
import QuestionBody from './questionBody';
import AnswerView from './answer';
import { getMetaData } from '../../../tool';
import useAnswerPage from '../../../hooks/useAnswerPage';

/**
 * AnswerPage component
 *
 * This component renders the answer page for a quiz question. It displays the question,
 * the possible answers, and provides feedback based on the user's selection.
 */
const AnswerPage: React.FC = () => {
  const { question } = useAnswerPage();
  const [checkboxLocked, setCheckboxLocked] = React.useState(false);
  const [selectedAnswerId, setSelectedAnswerId] = React.useState<string | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(false);

  /**
   * Handles the submit button click event.
   * Shows feedback based on whether the selected answer is correct.
   */
  const handleSubmitClick = () => {
    if (!selectedAnswerId) {
      setShowFeedback(true);
      setIsCorrect(false);
      return;
    }

    // Force feedback to show
    setShowFeedback(true);

    if (question?.correctAnswerId) {
      setIsCorrect(selectedAnswerId === question.correctAnswerId);
    }
  };

  /**
   * Handles the checkbox change event.
   * Locks the checkbox and sets the selected answer ID.
   *
   * @param answerId - The ID of the selected answer
   */
  const handleCheckboxChange = (answerId: string) => {
    setCheckboxLocked(true);
    setSelectedAnswerId(answerId);
  };

  /**
   * Handles the close event for the feedback Snackbar.
   */
  const handleCloseFeedback = () => {
    setShowFeedback(false);
  };

  /**
   * Returns the feedback message based on the selected answer and correctness.
   *
   * @returns The feedback message
   */
  const getFeedbackMessage = () => {
    if (!selectedAnswerId) {
      return 'Please select an answer first';
    }
    return isCorrect ? '🎉 Correct! Well done!' : "Sorry, that's not correct. Try again!";
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
          {getFeedbackMessage()}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AnswerPage;
