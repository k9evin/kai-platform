import { Grid, Typography } from '@mui/material';

import HistoryListingContainer from '@/components/HistoryListingContainer';
import ToolsListingContainer from '@/components/ToolsListingContainer';

import styles from './styles';

const HomePage = (props) => {
  const { data, loading } = props;

  const renderTitle = () => {
    return (
      <Grid {...styles.titleGridProps}>
        <Typography {...styles.titleProps}>
          Welcome to{' '}
          <Typography {...styles.highlightTextProps}>Kai Tools</Typography> 👋
        </Typography>
        <Typography {...styles.subtitleProps}>
          Made for{' '}
          <Typography {...styles.highlightTextProps}>educators</Typography>
        </Typography>
      </Grid>
    );
  };

  const cardMockData = [
    {
      title: 'Questions from Youtube - Javascript Basic Tutorial',
      description: 'Explore fundamental principles of UI design test test test',
      createdDate: '06/18/2024',
      backgroundImgURL:
        'https://firebasestorage.googleapis.com/v0/b/kai-ai-f63c8.appspot.com/o/Quizify.png?alt=media&token=d1255f27-b1a1-444e-b96a-4a3ac559237d',
      logo: 'https://firebasestorage.googleapis.com/v0/b/kai-ai-f63c8.appspot.com/o/QuizifyLogo.png?alt=media&token=9bf1d066-fba4-4063-9640-ef732e237d31',
    },
    {
      title: 'Advanced Data Structures',
      description: 'Master complex data structures and algorithms',
      createdDate: '06/18/2024',
      backgroundImgURL:
        'https://firebasestorage.googleapis.com/v0/b/kai-ai-f63c8.appspot.com/o/Dynamo.png?alt=media&token=db14183f-a294-49b2-a9de-0818b007c080',
      logo: 'https://firebasestorage.googleapis.com/v0/b/kai-ai-f63c8.appspot.com/o/YoutubeLogo.png?alt=media&token=2809083f-f816-41b6-8f86-80582b3da188',
    },
  ];

  return (
    <Grid {...styles.mainGridProps}>
      {renderTitle()}
      <ToolsListingContainer
        data={data}
        loading={loading}
        category="All Tools"
      />
      <HistoryListingContainer data={cardMockData} loading={loading} />
    </Grid>
  );
};
export default HomePage;
