// QuickActions.js
import React from 'react';

import { Button } from '@mui/material';

import { StyledButtonGroup } from './styles';

const QuickActions = ({ onAction }) => (
  <StyledButtonGroup
    variant="contained"
    aria-label="outlined primary button group"
  >
    <Button onClick={() => onAction('suggest_techniques')}>
      Suggest Learning Techniques
    </Button>
    <Button onClick={() => onAction('recommend_books')}>Recommend Books</Button>
    {/* Add more quick action buttons as needed */}
  </StyledButtonGroup>
);

export default QuickActions;
