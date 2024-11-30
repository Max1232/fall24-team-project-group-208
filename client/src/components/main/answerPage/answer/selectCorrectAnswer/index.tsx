import React from 'react';
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
  onSelect: (index: number) => void;
}

const SelectCorrectAnswerModal: React.FC<SelectCorrectAnswerModalProps> = ({
  open,
  onClose,
  answers,
  onSelect,
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const handleSubmit = () => {
    if (selectedIndex !== null) {
      onSelect(selectedIndex);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Select Correct Answer</DialogTitle>
      <DialogContent>
        <Typography variant='body1' sx={{ mb: 2 }}>
          Please select which answer should be marked as correct for this quiz question:
        </Typography>
        <RadioGroup value={selectedIndex} onChange={e => setSelectedIndex(Number(e.target.value))}>
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={selectedIndex === null}>
          Confirm Selection
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectCorrectAnswerModal;
