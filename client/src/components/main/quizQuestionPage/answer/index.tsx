/* eslint-disable no-console */
import React, { useState } from 'react';
import { Card, CardContent, Box, Typography, Checkbox } from '@mui/material';
import { handleHyperlink } from '../../../../tool';

/**
 * Interface representing the props for the AnswerView component.
 *
 * - text The content of the answer.
 * - ansBy The username of the user who wrote the answer.
 * - meta Additional metadata related to the answer.
 * - comments An array of comments associated with the answer.
 * - handleAddComment Callback function to handle adding a new comment.
 */
interface AnswerProps {
  text: string;
  ansBy: string;
  id: string;
  meta: string;
  checkboxLocked: boolean;
  onCheckboxChange: (answerId: string) => void;
}

/**
 * AnswerView component that displays the content of an answer with the author's name and metadata.
 * The answer text is processed to handle hyperlinks, and a comment section is included.
 *
 * @param text The content of the answer.
 * @param ansBy The username of the answer's author.
 * @param meta Additional metadata related to the answer.
 * @param comments An array of comments associated with the answer.
 * @param handleAddComment Function to handle adding a new comment.
 */
const AnswerView: React.FC<AnswerProps> = ({
  text,
  ansBy,
  id,
  meta,
  checkboxLocked,
  onCheckboxChange,
}) => {
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onCheckboxChange(id);
    setChecked(event.target.checked);
  };

  return (
    <Card variant='outlined' sx={{ mb: 2, p: 2 }}>
      <CardContent>
        <Box className='answerText' mb={2} display='flex' alignItems='center'>
          <Checkbox checked={checked} onChange={handleCheckboxChange} disabled={checkboxLocked} />
          <Box component='span' sx={{ display: 'inline' }}>
            {handleHyperlink(text)}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AnswerView;
