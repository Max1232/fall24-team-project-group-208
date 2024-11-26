import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { handleHyperlink } from '../../../../tool';
import CommentSection from '../../commentSection';
import { Comment } from '../../../../types';

/**
 * Interface representing the props for the AnswerView component.
 *
 * - text The content of the answer.
 * - ansBy The username of the user who wrote the answer.
 * - meta Additional metadata related to the answer.
 * - comments An array of comments associated with the answer.
 * - handleAddComment Callback function to handle adding a new comment.
 */
interface AnswerProps {
  text: string;
  ansBy: string;
  meta: string;
  comments: Comment[];
  handleAddComment: (comment: Comment) => void;
}

/**
 * AnswerView component that displays the content of an answer with the author's name and metadata.
 * The answer text is processed to handle hyperlinks, and a comment section is included.
 *
 * @param text The content of the answer.
 * @param ansBy The username of the answer's author.
 * @param meta Additional metadata related to the answer.
 * @param comments An array of comments associated with the answer.
 * @param handleAddComment Function to handle adding a new comment.
 */
const AnswerView: React.FC<AnswerProps> = ({ text, ansBy, meta, comments, handleAddComment }) => (
  <Card variant='outlined' sx={{ mb: 2, p: 2 }}>
    <CardContent>
      <Box className='answerText' mb={2}>
        <Typography variant='body1'>{handleHyperlink(text)}</Typography>
      </Box>
      <Box
        className='answerAuthor'
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}>
        <Typography variant='body2' className='answer_author'>
          {ansBy}
        </Typography>
        <Typography variant='body2' className='answer_question_meta' sx={{ ml: 1 }}>
          {meta}
        </Typography>
      </Box>
      <CommentSection comments={comments} handleAddComment={handleAddComment} />
    </CardContent>
  </Card>
);

export default AnswerView;
