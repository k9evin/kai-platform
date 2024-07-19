// ChatHistory.jsx
import React, { useState } from 'react';

import MoreHoriz from '@mui/icons-material/MoreHoriz';

import {
  Collapse,
  Fade,
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
const ChatHistory = ({ history, onClearHistory, setHistory }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [openCategories, setOpenCategories] = useState({
    today: true,
    yesterday: false,
    twoDaysAgo: false,
    other: false,
  });

  const handleMenuOpen = (event, topic) => {
    setAnchorEl(event.currentTarget);
    setSelectedTopic(topic);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTopic(null);
  };

  const handleDeleteTopicAndHistory = () => {
    if (!selectedTopic) return;
    onClearHistory(selectedTopic);

    const newHistory = history.filter((msg) => msg.topic !== selectedTopic);
    setHistory(newHistory);
    localStorage.setItem('chatHistory', JSON.stringify(newHistory));
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
  const generateTopics = (messages) => {
    const topics = {};
    messages.forEach((msg) => {
      const topic = msg.message.split(' ')[0];
      if (!topics[topic]) {
        topics[topic] = [];
      }
      topics[topic].push(msg);
    });
    return topics;
  };
  const renderTopics = (messages) => {
    const topics = generateTopics(messages);
    return (
      <>
        {Object.keys(topics).map((topic) => (
          <div key={topic}>
            <ListItem button onClick={() => setSelectedTopic(topic)}>
              <ListItemText primary={topic} style={{ color: 'black' }} />
              <IconButton
                onClick={(event) => handleMenuOpen(event, topic)}
                style={{ color: 'black' }}
              >
                <MoreHoriz />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && selectedTopic === topic}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={handleDeleteTopicAndHistory}
                  style={{ color: 'red' }}
                >
                  Delete
                </MenuItem>
              </Menu>
            </ListItem>
            <Collapse in={selectedTopic === topic} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Fade in={selectedTopic === topic} timeout={{ enter: 500 }}>
                  <div>
                    {topics[topic].map((message) => (
                      <ListItem key={message.id}>
                        <ListItemText
                          primary={message.message}
                          secondary={new Date(
                            message.timestamp
                          ).toLocaleString()}
                          primaryTypographyProps={{
                            style: { color: 'darkblue' },
                          }}
                          secondaryTypographyProps={{
                            style: { color: 'darkblue' },
                          }}
                        />
                      </ListItem>
                    ))}
                  </div>
                </Fade>
              </List>
            </Collapse>
          </div>
        ))}
      </>
    );
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
                {category === 'today' && renderTopics(today)}
                {category === 'yesterday' && renderTopics(yesterday)}
                {category === 'twoDaysAgo' && renderTopics(twoDaysAgo)}
                {category === 'other' && renderTopics(other)}
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
      topic: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClearHistory: PropTypes.func.isRequired,
  setHistory: PropTypes.func.isRequired,
};

export default ChatHistory;
