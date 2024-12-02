import React, { useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { getMetaData } from '../../../tool';
import { Comment } from '../../../types';
import useUserContext from '../../../hooks/useUserContext';

/**
 * Interface representing the props for the Comment Section component.
 *
 * - comments - list of the comment components
 * - handleAddComment - a function that handles adding a new comment, taking a Comment object as an argument
 */
interface CommentSectionProps {
  comments: Comment[];
  handleAddComment: (comment: Comment) => void;
}

/**
 * CommentSection component shows the users all the comments and allows the users add more comments.
 *
 * @param comments: an array of Comment objects
 * @param handleAddComment: function to handle the addition of a new comment
 */
const CommentSection = ({ comments, handleAddComment }: CommentSectionProps) => {
  const { user } = useUserContext();
  const [text, setText] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [textErr, setTextErr] = useState<string>('');
  const [showComments, setShowComments] = useState<boolean>(false);

  /**
   * Function to handle the addition of a new comment.
   */
  const handleAddCommentClick = () => {
    if (text.trim() === '' || user.username.trim() === '') {
      setTextErr(text.trim() === '' ? 'Comment text cannot be empty' : '');
      return;
    }

    const newComment: Comment = {
      text,
      commentBy: user.username,
      commentDateTime: new Date(),
    };

    handleAddComment(newComment);
    setText('');
    setTextErr('');
  };

  return (
    <Box className='comment-section'>
      <Button
        variant='outlined'
        color='primary'
        onClick={() => setShowComments(!showComments)}
        className='toggle-button'>
        {showComments ? 'Hide Replies' : 'Show Replies'}
      </Button>

      {showComments && (
        <Box className='comments-container'>
          <List className='comments-list'>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <ListItem key={index} className='comment-item' alignItems='flex-start'>
                  <ListItemText
                    primary={<Typography className='comment-text'>{comment.text}</Typography>}
                    secondary={
                      <Typography className='comment-meta' variant='body2' color='textSecondary'>
                        {comment.commentBy}, {getMetaData(new Date(comment.commentDateTime))}
                      </Typography>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <Typography className='no-comments'>No replies yet.</Typography>
            )}
          </List>

          <Box className='add-comment' mt={2}>
            <TextField
              placeholder='Comment'
              value={text}
              onChange={e => setText(e.target.value)}
              className='comment-textarea'
              fullWidth
              multiline
              rows={4}
              variant='outlined'
            />
            <Button
              variant='contained'
              color='primary'
              onClick={handleAddCommentClick}
              className='add-comment-button'
              sx={{ mt: 1 }}>
              Add Reply
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CommentSection;
