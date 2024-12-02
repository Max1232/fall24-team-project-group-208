import React, { useCallback, memo } from 'react';
import { Card, CardContent, Typography, Box, Modal, Button } from '@mui/material';
import { TagData } from '../../../../types';
import useTagSelected from '../../../../hooks/useTagSelected';

interface TagProps {
  t: TagData;
  clickTag: (tagName: string) => void;
}

const TagView: React.FC<TagProps> = ({ t, clickTag }) => {
  const { tag } = useTagSelected(t);
  const [open, setOpen] = React.useState(false);

  const handleOpen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleTagClick = useCallback(() => {
    clickTag(t.name);
    handleClose();
  }, [clickTag, t.name, handleClose]);

  return (
    <>
      <Card
        variant='outlined'
        sx={{
          'cursor': 'pointer',
          'mb': 2,
          'color': 'primary.main',
          'height': '150px',
          'borderColor': open ? 'transparent' : 'primary.main',
          'borderWidth': '1px',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
        onClick={handleOpen}>
        <CardContent>
          <Typography variant='h4' component='div' gutterBottom>
            {tag.name}
          </Typography>
          <Typography variant='body1' color='textSecondary'>
            {tag.description}
          </Typography>
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-title'
        aria-describedby='modal-description'>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
          onClick={e => e.stopPropagation()}>
          <Typography id='modal-title' variant='h6' component='h2'>
            {tag.name}
          </Typography>
          <Typography id='modal-description' sx={{ mt: 2 }}>
            {tag.description}
          </Typography>
          <Button variant='contained' color='primary' sx={{ mt: 2 }} onClick={handleTagClick}>
            View all questions with this tag
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default memo(TagView);
