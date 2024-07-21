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
import styled, { keyframes } from 'styled-components';

const typingAnimation = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const blinkCaret = keyframes`
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: darkblue;
  }
`;

const TypingAnimation = styled.span`
  display: inline-block;
  overflow: hidden;
  white-space: normal; // Allow text to wrap onto the next line
  animation: ${typingAnimation} 2s steps(40, end),
    ${blinkCaret} 0.75s step-end infinite;
  border-right: 4px solid; /* Cursor */
  word-wrap: break-word; // Allow long words to break onto the next line
  width: auto; // Remove fixed width to allow wrapping
`;

// ChatHistory component displays a list of chat messages.
const ChatHistory = ({ history, onClearHistory, setHistory }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [displayedMessages, setDisplayedMessages] = useState({});

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
    const older = [];

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

    history.forEach((message) => {
      const messageTime = new Date(message.timestamp).getTime();
      if (messageTime >= todayStart) {
        today.push(message);
      } else if (messageTime >= yesterdayStart) {
        yesterday.push(message);
      } else {
        older.push(message);
      }
    });

    return { today, yesterday, older };
  };

  const { today, yesterday, older } = categorizeHistory(history);

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
  const toggleTopic = (topic) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topic]: !prev[topic],
    }));
    if (!expandedTopics[topic]) {
      // Simulate typing effect
      const messages = generateTopics(history)[topic];
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedMessages((prev) => ({
          ...prev,
          [topic]: messages.slice(0, index + 1),
        }));
        index += 1;
        if (index >= messages.length) clearInterval(interval);
      }, 200); // Adjust typing speed as needed
    }
  };

  const renderTopics = (messages) => {
    const topics = generateTopics(messages);
    return (
      <>
        {Object.keys(topics).map((topic) => (
          <div key={topic}>
            <ListItem button onClick={() => toggleTopic(topic)}>
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
            <Collapse in={expandedTopics[topic]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Fade in={expandedTopics[topic]} timeout={{ enter: 500 }}>
                  <div>
                    {displayedMessages[topic] &&
                      displayedMessages[topic].map((message) => (
                        <ListItem key={message.id}>
                          <ListItemText
                            primary={
                              <TypingAnimation>
                                {message.message}
                              </TypingAnimation>
                            }
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
        {['today', 'yesterday', 'older'].map((category) => (
          <div key={category}>
            <ListItemText
              primary={category.charAt(0).toUpperCase() + category.slice(1)}
              style={{ color: 'gray' }}
            />
            <List component="div" disablePadding>
              {category === 'today' && renderTopics(today)}
              {category === 'yesterday' && renderTopics(yesterday)}
              {category === 'older' && renderTopics(older)}
            </List>
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
