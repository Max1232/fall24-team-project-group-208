import React, { useCallback, memo } from 'react';
import { Card, CardContent, Typography, Box, Modal, Button } from '@mui/material';
import { TagData } from '../../../../types';
import useTagSelected from '../../../../hooks/useTagSelected';

interface TagProps {
  t: TagData;
  clickTag: (tagName: string) => void;
}

/**
 * Component to display a tag with its name and description.
 * It also provides a modal to view more details about the tag.
 *
 * @param {TagProps} props - The properties for the TagView component.
 * @param {TagData} props.t - The tag data containing the name and description.
 * @param {function} props.clickTag - Function to handle the click event on the tag.
 * @returns {JSX.Element} The rendered TagView component.
 */
const TagView: React.FC<TagProps> = ({ t, clickTag }: TagProps): React.JSX.Element => {
  const { tag } = useTagSelected(t);
  const [open, setOpen] = React.useState(false);

  /**
   * Handle the event to open the modal.
   *
   * @param {React.MouseEvent} e - The mouse event.
   */
  const handleOpen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  }, []);

  /**
   * Handle the event to close the modal.
   */
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  /**
   * Handle the event to click on the tag.
   * It triggers the clickTag function and closes the modal.
   */
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
