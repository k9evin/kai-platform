import React, { useEffect, useState } from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import FileDownloadIcon from '@mui/icons-material/FileDownload';

import SearchIcon from '@mui/icons-material/Search';

import {
  Button,
  Divider,
  Drawer,
  Grid,
  InputAdornment,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';

import styles from './styles';

const HistoryDrawer = (props) => {
  const {
    open,
    onClose,
    data,
    showHistory,
    toggleShowHistory,
    history,
    clearHistory,
    selectedTopic,
    setSelectedTopic,
  } = props;
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTopics, setFilteredTopics] = useState([]);

  useEffect(() => {
    setFilteredTopics(
      history
        .map((item) => item.topic)
        .filter((topic) =>
          topic.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [searchTerm, history]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTopicClick = (topic) => {
    // console.log('Clicked topic:', topic);
    setSelectedTopic(topic);
  };

  const renderHeader = () => {
    return (
      <Grid {...styles.headerGridProps}>
        <Typography {...styles.dateProps}>{data.createdDate}</Typography>
        <Typography {...styles.titleProps}>{data.title}</Typography>
        <Typography {...styles.descriptionProps}>{data.description}</Typography>
      </Grid>
    );
  };

  const renderQuestions = () =>
    data.questions.map((question, index) => (
      <div key={index}>
        <ListItem {...styles.listItemProps}>
          <Typography {...styles.questionProps}>{question.question}</Typography>
          <List {...styles.optionsListProps}>
            {question.options.map((option, optionIndex) => (
              <ListItem key={optionIndex} {...styles.listItemProps}>
                <Typography {...styles.optionProps}>{option}</Typography>
              </ListItem>
            ))}
          </List>
          <Typography {...styles.answerTextProps}>Answer Key</Typography>
          <Typography {...styles.answerKeyProps}>{question.answer}</Typography>
        </ListItem>
        {index < data.questions.length - 1 && <Divider />}
      </div>
    ));

  const handleCopyToClipboard = () => {
    const text = JSON.stringify(data, null, 2); // Format the JSON for readability
    navigator.clipboard
      .writeText(text)
      /* eslint-disable no-console */
      .then(() => {
        console.log('Text copied to clipboard');
      })
      /* eslint-disable no-console */
      .catch((err) => {
        console.error('Failed to copy text to clipboard', err);
      });
  };

  const handleExportToCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    data.forEach((row) => {
      const rowContent = row.map(
        (item) => `"${item.toString().replace(/"/g, '""')}"`
      ); // Handle commas and quotes in data
      csvContent += `${rowContent.join(',')}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'questions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up
  };

  const renderFooterButtons = () => {
    return (
      <Grid container justifyContent="flex-start" sx={{ mt: 3, width: '100%' }}>
        <Button onClick={handleCopyToClipboard} {...styles.drawerButtonProps}>
          <ContentCopyIcon {...styles.CopyIcon} />
          Copy
        </Button>
        <Button onClick={handleExportToCSV} {...styles.drawerButtonProps}>
          <FileDownloadIcon {...styles.downloadIcon} />
          Export
        </Button>
      </Grid>
    );
  };

  const renderChatHistory = () => (
    <div>
      <Typography variant="h6" style={{ color: '#1E88E5' }}>
        Chat History
      </Typography>
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search your topic"
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          style: {
            border: '1px solid black', // Ensure the border is black
            borderRadius: '4px',
            height: '30px', // Adjust the height of the input
            color: 'black',
          },
        }}
        style={{ marginBottom: '10px', width: '100%' }}
      />
      <List>
        {filteredTopics.map((topic, index) => (
          <ListItem key={index} button onClick={() => handleTopicClick(topic)}>
            <Typography variant="body2" style={{ color: '#1E88E5' }}>
              {topic}
            </Typography>
          </ListItem>
        ))}
      </List>
      <Button onClick={clearHistory} variant="contained" color="secondary">
        Clear History
      </Button>
    </div>
  );

  const renderSelectedMessages = () => {
    if (!selectedTopic) return null;
    const topicData = history.find((item) => item.topic === selectedTopic);
    console.log('Topic Data:', topicData);
    if (!topicData)
      return <Typography>No messages found for this topic.</Typography>;
    const { messages } = topicData;

    return (
      <div>
        <List>
          {messages.map((message, index) => (
            <ListItem key={index}>
              <Typography variant="body2" style={{ color: '#1E88E5' }}>
                {message}
              </Typography>
            </ListItem>
          ))}
        </List>
      </div>
    );
  };

  const renderContent = () => {
    if (showHistory) {
      if (selectedTopic) {
        return renderSelectedMessages();
      }
      return renderChatHistory();
    }
    return null; // or any fallback content when history is not shown
  };

  return (
    <Grid {...styles.mainGridProps}>
      <Drawer open={open} onClose={onClose} {...styles.drawerGridProps}>
        {renderHeader()}
        {renderQuestions()}
        {renderFooterButtons()}

        {/* Show/Hide History Button */}
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <Typography variant="body1" style={{ color: '#333333' }}>
            Want to see chat history?
          </Typography>
          <Button
            onClick={toggleShowHistory}
            variant="contained"
            color="secondary"
          >
            {showHistory ? 'Hide History' : 'Show History'}
          </Button>
        </div>
        {renderContent()}
      </Drawer>
    </Grid>
  );
};

export default HistoryDrawer;
