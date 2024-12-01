import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
} from '@mui/material';
import { Answer } from '../../../../../types';

interface SelectCorrectAnswerModalProps {
  open: boolean;
  onClose: () => void;
  answers: Answer[];
  onSelect: (index: string) => void;
  selectedAnswerIndex?: string | null;
}

const SelectCorrectAnswerModal: React.FC<SelectCorrectAnswerModalProps> = ({
  open,
  onClose,
  answers,
  onSelect,
  selectedAnswerIndex,
}) => {
  const [localSelectedIndex, setLocalSelectedIndex] = React.useState<string | null>(null);

  // reset local state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setLocalSelectedIndex(null);
    }
  }, [open]);

  // update local state when selectedAnswerIndex changes
  useEffect(() => {
    if (selectedAnswerIndex !== undefined) {
      setLocalSelectedIndex(selectedAnswerIndex);
    }
  }, [selectedAnswerIndex]);

  const handleSubmit = () => {
    if (localSelectedIndex !== null) {
      onSelect(localSelectedIndex);
    }
  };

  const handleClose = () => {
    setLocalSelectedIndex(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle>Select Correct Answer</DialogTitle>
      <DialogContent>
        <Typography variant='body1' sx={{ mb: 2 }}>
          Please select which answer should be marked as correct for this quiz question:
        </Typography>
        <RadioGroup
          value={localSelectedIndex}
          onChange={e => setLocalSelectedIndex(e.target.value)}>
          {answers.map((answer, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                p: 2,
                border: '1px solid',
                borderColor: 'primary.light',
                borderRadius: 1,
              }}>
              <FormControlLabel
                value={index}
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant='body1'>{answer.text}</Typography>
                    <Typography variant='caption' color='text.secondary'>
                      by {answer.ansBy}
                    </Typography>
                  </Box>
                }
              />
            </Box>
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={localSelectedIndex === null}>
          Confirm Selection
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectCorrectAnswerModal;
