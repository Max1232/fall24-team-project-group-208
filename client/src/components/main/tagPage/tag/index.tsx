import React, { useState } from 'react';
import { TagData } from '../../../../types';
import useTagSelected from '../../../../hooks/useTagSelected';
import { Card, CardContent, Typography, Box, Modal, Button } from '@mui/material';

/**
 * Props for the Tag component.
 *
 * t - The tag object.
 * clickTag - Function to handle the tag click event.
 */
interface TagProps {
  t: TagData;
  clickTag: (tagName: string) => void;
}

/**
 * Tag component that displays information about a specific tag.
 * The component displays the tag's name, description, and the number of associated questions.
 * It also triggers a click event to handle tag selection.
 *
 * @param t - The tag object .
 * @param clickTag - Function to handle tag clicks.
 */
const TagView: React.FC<TagProps> = ({ t, clickTag }) => {
  const { tag } = useTagSelected(t);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          cursor: 'pointer',
          mb: 2,
          color: 'primary.main',
          height: '150px',
          borderColor: open ? 'transparent' : 'primary.main', 
          borderWidth: '1px',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
        onClick={handleOpen}
      >
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom>
            {tag.name}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {tag.description}
          </Typography>
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
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
        >
          <Typography id="modal-title" variant="h6" component="h2">
            {tag.name}
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            {tag.description}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => {
              clickTag(t.name);
              handleClose();
            }}
          >
            View all questions with this tag
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default TagView;
