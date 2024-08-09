import React, { useState } from 'react';

import StarIcon from '@mui/icons-material/Star';

import {
  ActionIcon,
  StyledButtonGroup,
  StyledQuickActionButton,
} from './Styles';

const QuickActions = ({ onAction }) => {
  const [actionsVisible, setActionsVisible] = useState(false);

  const toggleActions = () => {
    setActionsVisible(!actionsVisible);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <ActionIcon onClick={toggleActions}>
        {actionsVisible ? '-' : '+'} Actions
      </ActionIcon>
      {actionsVisible && (
        <StyledButtonGroup
          variant="contained"
          aria-label="quick action buttons"
        >
          <StyledQuickActionButton
            onClick={() => {
              onAction('suggest_techniques');
              alert('Suggested Learning Techniques');
            }}
          >
            <StarIcon style={{ color: 'purple', marginRight: '8px' }} />
            Suggest Learning Techniques
          </StyledQuickActionButton>
          <StyledQuickActionButton
            onClick={() => {
              onAction('recommend_books');
              alert('Recommended Books');
            }}
          >
            <StarIcon style={{ color: 'purple', marginRight: '8px' }} />
            Recommend Books
          </StyledQuickActionButton>
        </StyledButtonGroup>
      )}
    </div>
  );
};

export default QuickActions;
