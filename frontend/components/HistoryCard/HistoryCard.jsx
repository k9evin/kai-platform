import React, { useState } from 'react';

import { Button, Card, Grid, Typography } from '@mui/material';

import Image from 'next/image';

import HistoryDrawer from '../HistoryDrawer';

import styles from './styles';

const HistoryCard = (props) => {
  const { backgroundImgURL, logo, title, description, createdDate } = props;
  const [open, setOpen] = useState(false);

  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [showHistory, setShowHistory] = useState(false);

  const defaultData = {
    createdData: new Date().toLocaleDateString(),
    title: 'Video Comprehension Questions',
    description: 'Video Comprehension Questions',
    questions: [
      {
        question: 'Default Question 1',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        answer: 'Option A',
      },
    ],
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Function to toggle chat history visibility
  const toggleShowHistory = () => {
    setShowHistory((prev) => !prev);
  };

  const renderImage = () => {
    return (
      <Grid {...styles.imageGridProps}>
        <Image src={logo} alt="kai logo" {...styles.imageProps} />
      </Grid>
    );
  };

  const renderDetails = () => {
    return (
      <Grid {...styles.contentGridProps}>
        <Typography {...styles.dateProps}>{createdDate}</Typography>
        <Typography {...styles.titleProps}>{title}</Typography>
        <Typography {...styles.descriptionProps}>{description}</Typography>
        <Button {...styles.previewButtonProps} onClick={toggleDrawer}>
          Preview
        </Button>
      </Grid>
    );
  };

  return (
    <Grid {...styles.mainGridProps}>
      <Grid {...styles.historyCardProps}>
        <Card {...styles.cardProps(backgroundImgURL)}>{renderImage()}</Card>
        <Grid {...styles.toolDetailsGridProps}>{renderDetails()}</Grid>
      </Grid>
      {/* HistoryDrawer component */}
      <HistoryDrawer
        open={open}
        onClose={toggleDrawer}
        data={defaultData}
        showHistory={showHistory}
        toggleShowHistory={toggleShowHistory}
        history={history}
        clearHistory={() => {
          setHistory([]);
          localStorage.removeItem('chatHistory');
        }}
      />
    </Grid>
  );
};

export default HistoryCard;
