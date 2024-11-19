import React, { useState } from 'react';
import OrderButton from './orderButton';
import { OrderType, orderTypeDisplayName } from '../../../../types';
import AskQuestionButton from '../../askQuestionButton';
import { Box, Typography } from '@mui/material';

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
 * It includes the title, a button to ask a new question, the number of the quesions,
 * and buttons to set the order of questions.
 *
 * @param titleText - The title text to display in the header.
 * @param qcnt - The number of questions displayed in the header.
 * @param setQuestionOrder - Function to set the order of questions based on input message.
 */
const QuestionHeader: React.FC<QuestionHeaderProps> = ({ titleText, qcnt, setQuestionOrder }) => {
  const [activeOrder, setActiveOrder] = useState<OrderType | null>(null);

  const handleOrderChange = (order: OrderType) => {
    setQuestionOrder(order);
    setActiveOrder(order);
  };

  return (
    <Box display="flex" alignItems="center">
      <Typography variant="h3" color="primary.main">
        {titleText}
      </Typography>
      <Typography variant="body2" sx={{ fontStyle: 'italic', ml: 1 }}>
        ({qcnt})
      </Typography>
      <Box display="flex" ml={2}>
        {Object.keys(orderTypeDisplayName).map((order, idx) => (
          <OrderButton
            key={idx}
            orderType={order as OrderType}
            setQuestionOrder={handleOrderChange}
            isActive={activeOrder === order}
          />
        ))}
      </Box>
    </Box>
  );
};

export default QuestionHeader;