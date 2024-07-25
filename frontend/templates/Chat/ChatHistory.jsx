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

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteTopicAndHistory = () => {
    if (!selectedTopic) return;
    onClearHistory(selectedTopic);

    const newHistory = history.filter((msg) => msg.topic !== selectedTopic);
    setHistory(newHistory);
    localStorage.setItem('chatHistory', JSON.stringify(newHistory));
    handleMenuClose();
    setSelectedTopic(null);
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
    if (selectedTopic === topic) {
      setSelectedTopic(null); // Deselect if clicking the same topic
      setDisplayedMessages([]); // Clear messages when deselected
    } else {
      setSelectedTopic(topic); // Select new topic
      const messages = generateTopics(history)[topic];
      setDisplayedMessages(messages);
    }

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
            <ListItem
              button
              onClick={() => toggleTopic(topic)}
              style={{
                borderLeft:
                  selectedTopic === topic ? 'rgba(122, 16, 238, 0.8)' : 'none',
              }}
            >
              <ListItemText
                primary={topic}
                style={{ color: selectedTopic === topic ? '#c363fc' : 'white' }}
              />
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
                              style: { color: '#8080ff' },
                            }}
                            secondaryTypographyProps={{
                              style: { color: '#8080ff' },
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
        border: '2px solid blue',
        padding: '10px',
        backgroundColor: '#242424',
        maxWidth: '300px',
        position: 'fixed', // Fix position
        right: '0', // Align to the right
        top: '0%', // Adjust top position as needed
        zIndex: 1000, // Ensure it is above other elements
        overflowY: 'auto', // Ensure overflow is handled
        height: '110%', // Adjust height as needed
      }}
    >
      <div
        style={{
          display: 'flex ',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px', // Space between heading and list
        }}
      >
        <Typography variant="h6" style={{ color: 'white' }}>
          Chat History
        </Typography>
        <IconButton
          onClick={handleMenuOpen}
          style={{ color: 'blue', width: '30px', height: '30px' }}
        >
          <MoreHoriz />
        </IconButton>
      </div>
      <hr style={{ border: '1px solid blue', width: '100%' }} />
      {/* Line below chat history and button */}
      <List>
        {today.length > 0 && (
          <div>
            <ListItemText primary="Today" style={{ color: '#808080' }} />
            <List component="div" disablePadding>
              {renderTopics(today)}
            </List>
          </div>
        )}
        {yesterday.length > 0 && (
          <div>
            <ListItemText primary="Yesterday" style={{ color: '#808080' }} />
            <List component="div" disablePadding>
              {renderTopics(yesterday)}
            </List>
          </div>
        )}
        {older.length > 0 && (
          <div>
            <ListItemText primary="Older" style={{ color: '#808080' }} />
            <List component="div" disablePadding>
              {renderTopics(older)}
            </List>
          </div>
        )}
      </List>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={handleDeleteTopicAndHistory}
          style={{ color: 'red' }}
        >
          Delete Topic
        </MenuItem>
      </Menu>
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
