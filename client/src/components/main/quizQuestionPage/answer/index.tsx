import React from 'react';
import { Card, CardContent, Box, Radio, FormControlLabel } from '@mui/material';
import { handleHyperlink } from '../../../../tool';

interface AnswerProps {
  text: string;
  id: string;
  selected: boolean;
  onSelect: (answerId: string) => void;
  ansBy?: string;
  meta?: string;
}

/**
 * AnswerView component
 *
 * This component renders an individual answer option for a quiz question.
 * It displays the answer text and a radio button to select the answer.
 *
 * @param {AnswerProps} props - The props for the component
 * @param {string} props.text - The text of the answer
 * @param {string} props.id - The unique identifier of the answer
 * @param {boolean} props.selected - Whether the answer is selected
 * @param {(answerId: string) => void} props.onSelect - Function to call when the answer is selected
 */
const AnswerView: React.FC<AnswerProps> = ({ text, id, selected, onSelect }: AnswerProps) => (
  <Card variant='outlined' sx={{ mb: 2, p: 2 }}>
    <CardContent>
      <Box className='answerText' mb={2} display='flex' alignItems='center'>
        <FormControlLabel
          control={<Radio checked={selected} onChange={() => onSelect(id)} />}
          label={handleHyperlink(text)}
        />
      </Box>
    </CardContent>
  </Card>
);

export default AnswerView;
