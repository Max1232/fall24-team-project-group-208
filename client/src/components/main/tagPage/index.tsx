import React, { useState } from 'react';
import { Box, Typography, Button, Dialog } from '@mui/material';
import TagView from './tag';
import useTagPage from '../../../hooks/useTagPage';
import NewQuestionPage from '../newQuestion';

/**
 * Represents the TagPage component which displays a list of tags
 * and provides functionality to handle tag clicks and ask a new question.
 */
const TagPage = () => {
  const { tlist, clickTag } = useTagPage();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box p={3}>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
        <Typography variant='h4'>All Tags</Typography>
        <Typography variant='body1'>{tlist.length} Tags</Typography>
        <Button variant='contained' color='primary' onClick={handleOpen}>
          Ask a Question
        </Button>
      </Box>
      <Box display='grid' gridTemplateColumns='repeat(auto-fill, minmax(300px, 1fr))' gap={2}>
        {tlist.map((t, idx) => (
          <Box key={idx}>
            <TagView t={t} clickTag={clickTag} />
          </Box>
        ))}
      </Box>
      <Dialog open={open} fullWidth maxWidth='md'>
        <NewQuestionPage onClose={handleClose} />
      </Dialog>
    </Box>
  );
};

export default TagPage;
