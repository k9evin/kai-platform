// ChatHistory.jsx
import React from 'react';

import { Close } from '@mui/icons-material'; // Import the Close icon

import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';

// Ensure PropTypes is imported from the correct package
import PropTypes from 'prop-types';

// Allows you to dragg the history page
import Draggable from 'react-draggable';

// ChatHistory component displays a list of chat messages.
const ChatHistory = ({ history, onClearHistory }) => {
  return (
    // Draggable
    <Draggable>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          backgroundColor: '#f9f9f9',
          maxWidth: '300px',
          position: 'relative',
        }}
      >
        {/* Clear Chat History Button */}
        <IconButton
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            color: 'black', // Set the color to black
          }}
          onClick={onClearHistory} // Add onClick event to trigger clear history
        >
          <Close />
        </IconButton>

        {/* Display a title for the chat history */}
        <Typography variant="h6">Chat History</Typography>
        <List>
          {/* Map through the history array to display each message */}
          {history.map((message) => (
            <ListItem key={message.id}>
              <ListItemText
                primary={`Message ${message.id}: ${message.message}`}
                secondary={new Date(message.timestamp).toLocaleString()}
                primaryTypographyProps={{ style: { color: 'darkblue' } }}
                secondaryTypographyProps={{ style: { color: 'darkblue' } }}
              />
            </ListItem>
          ))}
        </List>
      </div>
    </Draggable>
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
  onClearHistory: PropTypes.func.isRequired, // Ensure onClearHistory is required
};

export default ChatHistory;
