import React from 'react';
import { Button, Box } from '@mui/material';
import { OrderType, orderTypeDisplayName } from '../../../../../types';

/**
 * Interface representing the props for the OrderButton component.
 *
 * name - The text to be displayed on the button.
 * setQuestionOrder - A function that sets the order of questions based on the message.
 */
interface OrderButtonProps {
  orderType: OrderType;
  setQuestionOrder: (order: OrderType) => void;
  isActive: boolean;
}

/**
 * OrderButton component renders a button that, when clicked, triggers the setQuestionOrder function
 * with the provided message.
 * It will update the order of questions based on the input message.
 *
 * @param orderType - The label for the button and the value passed to setQuestionOrder function.
 * @param setQuestionOrder - Callback function to set the order of questions based on the input message.
 * @param isActive - Boolean indicating if the button is active.
 */
const OrderButton: React.FC<OrderButtonProps> = ({ orderType, setQuestionOrder, isActive }) => {
  const handleClick = () => {
    setQuestionOrder(orderType);
  };

  return (
    <Box m={1}>
      <Button
        variant={isActive ? 'contained' : 'outlined'}
        color='primary'
        size='small'
        onClick={handleClick}
      >
        {orderTypeDisplayName[orderType]}
      </Button>
    </Box>
  );
};

export default OrderButton;
