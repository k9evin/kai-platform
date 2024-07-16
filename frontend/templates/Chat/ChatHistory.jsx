// ChatHistory.jsx
import React, { useState } from 'react';

import MoreHoriz from '@mui/icons-material/MoreHoriz';

import {
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';

// Ensure PropTypes is imported from the correct package
import PropTypes from 'prop-types';

// ChatHistory component displays a list of chat messages.
const ChatHistory = ({ history, onClearHistory }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [openCategories, setOpenCategories] = useState({
    today: true,
    yesterday: false,
    twoDaysAgo: false,
    other: false,
  });

  const handleMenuOpen = (event, message) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessage(message);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMessage(null);
  };

  const handleDeleteMessage = () => {
    const newHistory = history.filter((msg) => msg.id !== selectedMessage.id);
    localStorage.setItem('chatHistory', JSON.stringify(newHistory));
    onClearHistory();
    handleMenuClose();
  };

  const categorizeHistory = () => {
    const today = [];
    const yesterday = [];
    const twoDaysAgo = [];
    const other = [];

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;
    const twoDaysAgoStart = yesterdayStart - 24 * 60 * 60 * 1000;

    history.forEach((message) => {
      const messageTime = new Date(message.timestamp).getTime();
      if (messageTime >= todayStart) {
        today.push(message);
      } else if (messageTime >= yesterdayStart) {
        yesterday.push(message);
      } else if (messageTime >= twoDaysAgoStart) {
        twoDaysAgo.push(message);
      } else {
        other.push(message);
      }
    });

    return { today, yesterday, twoDaysAgo, other };
  };

  const { today, yesterday, twoDaysAgo, other } = categorizeHistory(history);

  const getCategoryText = (category) => {
    switch (category) {
      case 'today':
        return 'Today';
      case 'yesterday':
        return 'Yesterday';
      case 'twoDaysAgo':
        return 'Two Days Ago';
      default:
        return 'Older';
    }
  };

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        maxWidth: '300px',
        position: 'fixed', // Fix position
        right: '0', // Align to the right
        top: '0.4%', // Adjust top position as needed
        zIndex: 1000, // Ensure it is above other elements
        overflowY: 'auto', // Ensure overflow is handled
        height: '110%', // Adjust height as needed
      }}
    >
      <Typography variant="h6" style={{ color: 'Black' }}>
        Chat History
      </Typography>

      <List>
        {['today', 'yesterday', 'twoDaysAgo', 'other'].map((category) => (
          <div key={category}>
            <ListItem
              button
              onClick={() =>
                setOpenCategories((prev) => ({
                  ...prev,
                  [category]: !prev[category],
                }))
              }
            >
              <ListItemText
                primary={getCategoryText(category)}
                style={{ color: 'gray' }}
              />
            </ListItem>
            <Collapse
              in={openCategories[category]}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {category === 'today' &&
                  today.map((message) => (
                    <ListItem key={message.id}>
                      <ListItemText
                        primary={message.message}
                        secondary={new Date(message.timestamp).toLocaleString()}
                        primaryTypographyProps={{
                          style: { color: 'darkblue' },
                        }}
                        secondaryTypographyProps={{
                          style: { color: 'darkblue' },
                        }}
                      />
                      <IconButton
                        onClick={(event) => handleMenuOpen(event, message)}
                        style={{ color: 'darkblue' }}
                      >
                        <MoreHoriz />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem
                          onClick={handleDeleteMessage}
                          style={{ color: 'red' }}
                        >
                          Delete
                        </MenuItem>
                      </Menu>
                    </ListItem>
                  ))}
                {category === 'yesterday' &&
                  yesterday.map((message) => (
                    <ListItem key={message.id}>
                      <ListItemText
                        primary={message.message}
                        secondary={new Date(message.timestamp).toLocaleString()}
                        primaryTypographyProps={{
                          style: { color: 'darkblue' },
                        }}
                        secondaryTypographyProps={{
                          style: { color: 'darkblue' },
                        }}
                      />
                      <IconButton
                        onClick={(event) => handleMenuOpen(event, message)}
                        style={{ color: 'darkblue' }}
                      >
                        <MoreHoriz />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem
                          onClick={handleDeleteMessage}
                          style={{ color: 'red' }}
                        >
                          Delete
                        </MenuItem>
                      </Menu>
                    </ListItem>
                  ))}
                {category === 'twoDaysAgo' &&
                  twoDaysAgo.map((message) => (
                    <ListItem key={message.id}>
                      <ListItemText
                        primary={message.message}
                        secondary={new Date(message.timestamp).toLocaleString()}
                        primaryTypographyProps={{
                          style: { color: 'darkblue' },
                        }}
                        secondaryTypographyProps={{
                          style: { color: 'darkblue' },
                        }}
                      />
                      <IconButton
                        onClick={(event) => handleMenuOpen(event, message)}
                        style={{ color: 'darkblue' }}
                      >
                        <MoreHoriz />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem
                          onClick={handleDeleteMessage}
                          style={{ color: 'red' }}
                        >
                          Delete
                        </MenuItem>
                      </Menu>
                    </ListItem>
                  ))}
                {category === 'other' &&
                  other.map((message) => (
                    <ListItem key={message.id}>
                      <ListItemText
                        primary={message.message}
                        secondary={new Date(message.timestamp).toLocaleString()}
                        primaryTypographyProps={{
                          style: { color: 'darkblue' },
                        }}
                        secondaryTypographyProps={{
                          style: { color: 'darkblue' },
                        }}
                      />
                      <IconButton
                        onClick={(event) => handleMenuOpen(event, message)}
                        style={{ color: 'darkblue' }}
                      >
                        <MoreHoriz />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem
                          onClick={handleDeleteMessage}
                          style={{ color: 'red' }}
                        >
                          Delete
                        </MenuItem>
                      </Menu>
                    </ListItem>
                  ))}
              </List>
            </Collapse>
          </div>
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
  onClearHistory: PropTypes.func.isRequired,
};

export default ChatHistory;
