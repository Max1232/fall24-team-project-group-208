import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { handleHyperlink } from '../../../../tool';
import useUserContext from '../../../../hooks/useUserContext';

/**
 * Interface representing the props for the QuestionBody component.
 *
 * - views - The number of views the question has received.
 * - text - The content of the question, which may contain hyperlinks.
 * - askby - The username of the user who asked the question.
 * - meta - Additional metadata related to the question, such as the date and time it was asked.
 */
interface QuestionBodyProps {
  views: number;
  text: string;
  askby: string;
  meta: string;
  answerCount: number;
}

/**
 * QuestionBody component that displays the body of a question.
 * It includes the number of views, the question content (with hyperlink handling),
 * the username of the author, and additional metadata.
 *
 * @param views The number of views the question has received.
 * @param text The content of the question.
 * @param askby The username of the question's author.
 * @param meta Additional metadata related to the question.
 */
const QuestionBody: React.FC<QuestionBodyProps> = ({ views, text, askby, meta, answerCount }) => {
  const { user } = useUserContext();

  // Determine if the button should be displayed
  const shouldShowButton = user && (user.username === askby || user.role === 0) && answerCount >= 3;
  return (
    <Box
      id='questionBody'
      className='questionBody right_padding'
      p={2}
      sx={{
        border: '1px solid',
        borderColor: 'primary.main',
        borderRadius: 1,
      }}>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Typography variant='h5' sx={{ ml: 2 }}>
          {handleHyperlink(text)}
        </Typography>
        <Typography variant='h6' sx={{ ml: 1 }}>
          {views} views
        </Typography>
      </Box>
      <Box className='answer_question_right' mt={2} display='flex' alignItems='center'>
        <Typography variant='body2' className='question_author'>
          {askby}
        </Typography>
        <Typography variant='body2' className='answer_question_meta' sx={{ ml: 1 }}>
          asked {meta}
        </Typography>
      </Box>
      {shouldShowButton && (
        <Button variant='contained' color='primary'>
          MAKE QUIZ
        </Button>
      )}
    </Box>
  );
};

export default QuestionBody;
