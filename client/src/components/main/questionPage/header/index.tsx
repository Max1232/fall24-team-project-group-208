import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  // DialogTitle,
  // DialogContent,
  // DialogActions,
  // TextField,
} from '@mui/material';
import OrderButton from './orderButton';
import { OrderType, orderTypeDisplayName } from '../../../../types';
// import useNewQuestion from '../../../../hooks/useNewQuestion';
import NewQuestionPage from '../../newQuestion';

/**
 * Interface representing the props for the QuestionHeader component.
 *
 * titleText - The title text displayed at the top of the header.
 * qcnt - The number of questions to be displayed in the header.
 * setQuestionOrder - A function that sets the order of questions based on the selected message.
 */
interface QuestionHeaderProps {
  titleText: string;
  qcnt: number;
  setQuestionOrder: (order: OrderType) => void;
}

/**
 * QuestionHeader component displays the header section for a list of questions.
 * It includes the title, a button to ask a new question, the number of the questions,
 * and buttons to set the order of questions.
 *
 * @param titleText - The title text to display in the header.
 * @param qcnt - The number of questions displayed in the header.
 * @param setQuestionOrder - Function to set the order of questions based on input message.
 */
const QuestionHeader: React.FC<QuestionHeaderProps> = ({ titleText, qcnt, setQuestionOrder }) => {
  const [activeOrder, setActiveOrder] = useState<OrderType | null>(null);
  const [open, setOpen] = useState(false);

  const handleOrderChange = (order: OrderType) => {
    setQuestionOrder(order);
    setActiveOrder(order);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box display='flex' alignItems='center'>
        <Typography variant='h3' color='primary.main'>
          {titleText}
        </Typography>
        <Typography variant='body2' sx={{ fontStyle: 'italic', ml: 1 }}>
          ({qcnt})
        </Typography>
        <Box display='flex' ml={2}>
          {Object.keys(orderTypeDisplayName).map((order, idx) => (
            <OrderButton
              key={idx}
              orderType={order as OrderType}
              setQuestionOrder={handleOrderChange}
              isActive={activeOrder === order}
            />
          ))}
        </Box>
        <Button variant='contained' color='primary' onClick={handleClickOpen} sx={{ ml: 2 }}>
          Ask a New Question
        </Button>
      </Box>
      <Dialog open={open}>
        <NewQuestionPage onClose={handleClose} />
      </Dialog>
    </>
  );
};

export default QuestionHeader;
