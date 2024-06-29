import React, { useState } from 'react';

import { Button, Card, Grid, Typography } from '@mui/material';

import Image from 'next/image';

import styles from './styles';

const HistoryCard = (props) => {
  const { backgroundImgURL, logo, title, description, createdDate } = props;
  const [open, setOpen] = useState(false);

  const handleDrawer = () => {
    setOpen(!open);
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
        <Button {...styles.previewButtonProps} onClick={handleDrawer}>
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
    </Grid>
  );
};

export default HistoryCard;
