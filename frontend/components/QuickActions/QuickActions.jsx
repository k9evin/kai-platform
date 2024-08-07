// QuickActions.js
import React from 'react';

import { Button, ButtonGroup } from '@mui/material';

const QuickActions = ({ onAction }) => (
  <ButtonGroup variant="contained" aria-label="outlined primary button group">
    <Button
      onClick={() => {
        onAction('suggest_techniques');
        alert('Suggested Learning Techniques');
      }}
    >
      Suggest Learning Techniques
    </Button>
    <Button
      onClick={() => {
        onAction('recommend_books');
        alert('Recommended Books');
      }}
    >
      Recommend Books
    </Button>
    {/* Add more quick action buttons as needed */}
  </ButtonGroup>
);

export default QuickActions;
