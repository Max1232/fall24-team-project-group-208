import React, { useState } from 'react';
import { Box, Typography, Grid, Button, Dialog } from '@mui/material';
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">All Tags</Typography>
        <Typography variant="body1">{tlist.length} Tags</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Ask a Question
        </Button>
      </Box>
      <Grid container spacing={2}>
        {tlist.map((t, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
            <TagView t={t} clickTag={clickTag} />
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <NewQuestionPage />
      </Dialog>
    </Box>
  );
};

export default TagPage;
