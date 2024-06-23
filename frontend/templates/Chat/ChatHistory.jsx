//ChatHistory.jsx
import React from 'react';

import { List, ListItem, ListItemText, Typography } from '@mui/material';

import PropTypes from 'prop-types';

const ChatHistory = ({ history }) => {
  return (
    <div>
      <Typography variant="h6">Chat History</Typography>
      <List>
        {history.map((message) => (
          <ListItem key={message.id}>
            <ListItemText
              primary={`Message ${message.id}: ${message.message}`}
              secondary={new Date(message.timestamp).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

ChatHistory.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      timestamp: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ChatHistory;