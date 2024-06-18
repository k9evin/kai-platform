import { Grid, Typography } from '@mui/material';

import HistoryCard, { HistoryCardSkeleton } from '../HistoryCard';

import styles from './styles';

const DEFAULT_TOOLS = new Array(8)
  .fill()
  .map((_, index) => ({ id: index + 1 }));

const cardMockData = [
  {
    title: 'User Interface Design Concepts',
    description: 'Explore fundamental principles of UI design',
    createdDate: '06/18/2024',
    backgroundImgURL:
      'https://firebasestorage.googleapis.com/v0/b/kai-ai-f63c8.appspot.com/o/UI_Design.png?alt=media&token=db14183f-a294-49b2-a9de-0818b007c080',
    logo: 'https://firebasestorage.googleapis.com/v0/b/kai-ai-f63c8.appspot.com/o/UI_Design_Logo.png?alt=media&token=2809083f-f816-41b6-8f86-80582b3da188',
  },
  {
    title: 'Mobile App Development Basics',
    description: 'Learn foundational concepts for building mobile apps',
    createdDate: '06/18/2024',
    backgroundImgURL:
      'https://firebasestorage.googleapis.com/v0/b/kai-ai-f63c8.appspot.com/o/App_Development.png?alt=media&token=db14183f-a294-49b2-a9de-0818b007c080',
    logo: 'https://firebasestorage.googleapis.com/v0/b/kai-ai-f63c8.appspot.com/o/App_Development_Logo.png?alt=media&token=2809083f-f816-41b6-8f86-80582b3da188',
  },
  {
    title: 'Advanced Data Structures',
    description: 'Master complex data structures and algorithms',
    createdDate: '06/18/2024',
    backgroundImgURL:
      'https://firebasestorage.googleapis.com/v0/b/kai-ai-f63c8.appspot.com/o/Data_Structures.png?alt=media&token=d1255f27-b1a1-444e-b96a-4a3ac559237d',
    logo: 'https://firebasestorage.googleapis.com/v0/b/kai-ai-f63c8.appspot.com/o/Data_Structures_Logo.png?alt=media&token=9bf1d066-fba4-4063-9640-ef732e237d31',
  },
];

/**
 * Renders the Historys Listings component.
 *
 * @param {object} props - The props object containing data and the category.
 * @param {object} props.data - The data to be rendered.
 * @param {object} props.category - The category of the tools.
 * @return {JSX.Element} The rendered Historys Listings component.
 */
const HistoryListingContainer = (props) => {
  const { data, loading, category } = props;

  const renderTitle = () => {
    return (
      <Grid {...styles.headerGridProps}>
        <Typography {...styles.categoryTitleProps}>
          {category} {data && `(${data?.length})`}
        </Typography>
      </Grid>
    );
  };

  const renderCards = () => {
    return (
      <Grid {...styles.containerGridProps}>
        <Grid {...styles.innerListGridProps}>
          {data?.map((tool) => (
            <HistoryCard key={tool.id} {...tool} />
          ))}
        </Grid>
      </Grid>
    );
  };

  const renderLoader = () => {
    return (
      <Grid {...styles.containerGridProps}>
        <Grid {...styles.innerListGridProps}>
          {DEFAULT_TOOLS?.map((tool) => (
            <HistoryCardSkeleton key={tool.id} />
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
