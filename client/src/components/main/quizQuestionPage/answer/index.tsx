import React from 'react';
import { Card, CardContent, Box, Radio, FormControlLabel } from '@mui/material';
import { handleHyperlink } from '../../../../tool';

interface AnswerProps {
  text: string;
  ansBy: string;
  id: string;
  meta: string;
  selected: boolean;
  onSelect: (answerId: string) => void;
}

const AnswerView: React.FC<AnswerProps> = ({ text, id, selected, onSelect }) => (
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
