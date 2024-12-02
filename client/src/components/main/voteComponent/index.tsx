import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowCircleUpTwoToneIcon from '@mui/icons-material/ArrowCircleUpTwoTone';
import ArrowCircleDownTwoToneIcon from '@mui/icons-material/ArrowCircleDownTwoTone';
import { downvoteQuestion, upvoteQuestion } from '../../../services/questionService';
import useUserContext from '../../../hooks/useUserContext';
import { Question } from '../../../types';
import useVoteStatus from '../../../hooks/useVoteStatus';

/**
 * Interface represents the props for the VoteComponent.
 *
 * question - The question object containing voting information.
 */
interface VoteComponentProps {
  question: Question;
}

/**
 * A Vote component that allows users to upvote or downvote a question.
 *
 * @param question - The question object containing voting information.
 */
const VoteComponent: React.FC<VoteComponentProps> = ({ question }) => {
  const { user } = useUserContext();
  const { count, voted } = useVoteStatus({ question });

  /**
   * Function to handle upvoting or downvoting a question.
   *
   * @param _event
   * @param type - The type of vote, either 'upvote' or 'downvote'.
   */
  const handleVote = async (_event: React.MouseEvent<HTMLButtonElement>, type: string) => {
    try {
      if (question._id) {
        if (type === 'upvote') {
          await upvoteQuestion(question._id, user.username);
        } else if (type === 'downvote') {
          await downvoteQuestion(question._id, user.username);
        }
      }
    } catch (error) {
      throw new Error('Error while voting');
    }
  };

  return (
    <Box display='flex' flexDirection='column' alignItems='center'>
      <IconButton
        onClick={event => handleVote(event, 'upvote')}
        sx={{ color: voted === 1 ? 'success.main' : 'primary.light' }}>
        <ArrowCircleUpTwoToneIcon sx={{ fontSize: 30 }} />
      </IconButton>
      <Typography>{count}</Typography>
      <IconButton
        onClick={event => handleVote(event, 'downvote')}
        sx={{ color: voted === -1 ? 'error.main' : 'primary.light' }}>
        <ArrowCircleDownTwoToneIcon sx={{ fontSize: 30 }} />
      </IconButton>
    </Box>
  );
};

export default VoteComponent;
