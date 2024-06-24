// ChatHistory.jsx
import React from 'react';

import { List, ListItem, ListItemText, Typography } from '@mui/material';

// Ensure PropTypes is imported from the correct package
import PropTypes from 'prop-types';

// ChatHistory component displays a list of chat messages.
const ChatHistory = ({ history }) => {
  return (
    <div>
      {/* Display a title for the chat history */}
      <Typography variant="h6">Chat History</Typography>
      <List>
        {/* Map through the history array to display each message */}
        {history.map((message) => (
          <ListItem key={message.id}>
            <ListItemText
              // Primary text shows message ID and content
              primary={`Message ${message.id}: ${message.message}`}
              // Secondary text shows formatted timestamp
              secondary={new Date(message.timestamp).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

// Define PropTypes for the history prop to enforce data structure
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
