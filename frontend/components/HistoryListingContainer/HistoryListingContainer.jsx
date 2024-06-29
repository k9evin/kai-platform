import { Grid, Typography } from '@mui/material';

import HistoryCard, { HistoryCardSkeleton } from '../HistoryCard';

import styles from './styles';

const DEFAULT_TOOLS = new Array(8)
  .fill()
  .map((_, index) => ({ id: index + 1 }));

const HistoryListingContainer = (props) => {
  const { data, loading } = props;

  const renderTitle = () => {
    return (
      <Grid {...styles.headerGridProps}>
        <Typography {...styles.categoryTitleProps}>
          This Week {data && `(${data?.length})`}
        </Typography>
      </Grid>
    );
  };

  const renderCards = () => {
    return (
      <Grid {...styles.containerGridProps}>
        <Grid {...styles.innerListGridProps}>
          {data?.map((history, index) => (
            <HistoryCard key={index} {...history} />
          ))}
        </Grid>
      </Grid>
    );
  };

  const renderLoader = () => {
    return (
      <Grid {...styles.containerGridProps}>
        <Grid {...styles.innerListGridProps}>
          {DEFAULT_TOOLS?.map((history) => (
            <HistoryCardSkeleton key={history.id} />
          ))}
        </Grid>
      </Grid>
    );
  };

  return (
    <Grid {...styles.mainGridProps}>
      {renderTitle()}
      {loading ? renderLoader() : renderCards()}
    </Grid>
  );
};

export default HistoryListingContainer;
