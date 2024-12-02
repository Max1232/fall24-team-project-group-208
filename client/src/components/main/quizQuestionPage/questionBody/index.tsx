// TODO: Remove unused code and fix lint issues
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { handleHyperlink } from '../../../../tool';
import useUserContext from '../../../../hooks/useUserContext';
import useQuizTag from '../../../../hooks/useQuizTag';
import { Question } from '../../../../types';

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
  questionID: string;
  question: Question;
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
const QuestionBody: React.FC<QuestionBodyProps> = ({
  views,
  text,
  askby,
  meta,
  answerCount,
  questionID,
  question,
}) => {
  // TODO: Remove this stuff if it is still unused
  const { user } = useUserContext();
  const { addQuizTag, isLoading, error } = useQuizTag(questionID, question);
  return (
    <Box
      id='questionBody'
      className='questionBody right_padding'
      p={2}
      sx={{
        border: '1px solid',
        borderColor: 'primary.main',
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        mb: 2,
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
      {error && (
        <Typography color='error' sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default QuestionBody;
