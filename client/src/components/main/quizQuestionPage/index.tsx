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
  const [selectedAnswerId, setSelectedAnswerId] = React.useState<string | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(false);

  const handleSubmitClick = async () => {
    if (!question || !selectedAnswerId || !question.correctAnswerId) {
      setShowFeedback(true);
      setIsCorrect(false);
      return;
    }

    const correct = selectedAnswerId === question.correctAnswerId;

    if (correct) {
      try {
        await fetch('http://localhost:8000/quiz/reputation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: question.askedBy,
            isCorrect: true,
          }),
        });
      } catch (error) {
        throw new Error('Error updating reputation');
      }
    }

    setIsCorrect(correct);
    setShowFeedback(true);

    if (!correct) {
      setSelectedAnswerId(null);
    }
  };

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswerId(answerId);
  };

  const handleCloseFeedback = () => {
    setShowFeedback(false);
  };

  const getFeedbackMessage = () => {
    if (!selectedAnswerId) {
      return 'Incorrect, try again';
    }
    if (!question || !question.correctAnswerId) {
      return 'No correct answer set';
    }
    return isCorrect ? '🎉 Correct!' : 'Incorrect, try again';
  };

  if (!question)
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
        <CircularProgress color='primary' />
      </Box>
    );

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
          selected={a._id?.toString() === selectedAnswerId}
          onSelect={handleAnswerSelect}
        />
      ))}
      <Box mt={3} display='flex' justifyContent='center'>
        <Button
          variant='contained'
          color='primary'
          onClick={handleSubmitClick}
          disabled={!selectedAnswerId}>
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
