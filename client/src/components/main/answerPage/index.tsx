import React from 'react';
import { Box, Button, CircularProgress, Dialog } from '@mui/material';
import AnswerHeader from './header';
import QuestionBody from './questionBody';
import CommentSection from '../commentSection';
import AnswerView from './answer';
import { getMetaData } from '../../../tool';
import { Comment } from '../../../types';
import NewAnswerModal from '../newAnswer';
import useAnswerPage from '../../../hooks/useAnswerPage';
import NewQuestionPage from '../newQuestion';
import VoteComponent from '../voteComponent';

/**
 * AnswerPage component that displays the full content of a question along with its answers.
 * It also includes the functionality to vote, ask a new question, and post a new answer.
 */
const AnswerPage: React.FC = () => {
  const { question, handleNewComment, questionID } = useAnswerPage();
  const [qOpen, setQOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleQuestionClickOpen = () => {
    setQOpen(true);
  };

  const handleQClose = () => {
    setQOpen(false);
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
      <Button variant='contained' color='primary' onClick={handleQuestionClickOpen} sx={{ mb:3 }}>
        Ask a New Question
      </Button>

      <Dialog open={qOpen}>
        <NewQuestionPage onClose={handleQClose} />
      </Dialog>

      <Box display='flex' alignItems='flex-start' mb={2}>
        <VoteComponent question={question} />
        <Box ml={2} flexGrow={1}>
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
        </Box>
      </Box>

      <Box pt={2} pb={2}>
        <CommentSection
          comments={question.comments}
          handleAddComment={(comment: Comment) => handleNewComment(comment, 'question', questionID)}
        />
      </Box>
      {question.answers.map((a, idx) => (
        <AnswerView
          key={idx}
          text={a.text}
          ansBy={a.ansBy}
          meta={getMetaData(new Date(a.ansDateTime))}
          comments={a.comments}
          handleAddComment={(comment: Comment) => handleNewComment(comment, 'answer', a._id)}
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
