import React from 'react';
import { Box, Typography } from '@mui/material';

interface AnswerHeaderProps {
  ansCount: number;
  title: string;
}

/**
 * AnswerHeader component that displays a header section for the answer page.
 * It includes the number of answers, the title of the question, and a button to ask a new question.
 *
 * @param ansCount The number of answers to display.
 * @param title The title of the question or discussion thread.
 */
const AnswerHeader: React.FC<AnswerHeaderProps> = ({ ansCount, title }) => (
  <Box
    id='answersHeader'
    display='flex'
    justifyContent='space-between'
    alignItems='center'
    p={2}
    sx={{ backgroundColor: 'primary.main' }}>
    <Typography variant='h4' className='bold_title answer_question_title'>
      {title}
    </Typography>
    <Typography variant='h6' className='bold_title' sx={{ ml: 'auto' }}>
      {ansCount} answers
    </Typography>
   
  </Box>
);

export default AnswerHeader;
