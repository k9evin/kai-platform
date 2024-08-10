import React, { useState } from 'react';

import StarIcon from '@mui/icons-material/Star';

import {
  ActionIcon,
  StyledButtonGroup,
  StyledQuickActionButton,
} from './styles.js';

const QuickActions = ({ onAction }) => {
  const [actionsVisible, setActionsVisible] = useState(false);

  const toggleActions = () => {
    setActionsVisible(!actionsVisible);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <ActionIcon onClick={toggleActions} style={{ cursor: 'pointer' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px',
            backgroundColor: 'blue',
            borderRadius: '24px',
            border: '2px solid white',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              color: 'blue',
              backgroundColor: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '8px',
            }}
          >
            {actionsVisible ? '-' : '+'}
          </div>
          <span style={{ color: 'white' }}>Actions</span>
        </div>
      </ActionIcon>
      {actionsVisible && (
        <StyledButtonGroup
          aria-label="quick action buttons"
          style={{
            position: 'absolute',
            bottom: '10px',
            marginLeft: '700px',
            marginBottom: '100px',
            width: '50%',
          }}
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
