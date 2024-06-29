import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
  Button,
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
  Typography,
} from '@mui/material';

import styles from './styles';

const HistoryDrawer = (props) => {
  const { open, onClose, data } = props;

  const defaultData = {
    createdData: new Date().toLocaleDateString(),
    title: 'Video Comprehension Questions',
    description: 'Generate guiding questions aligned to a Youtube video on UX',
    questions: [
      {
        question: '1. Default Question?',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        answer: 'Option A',
      },
    ],
  };

  const { createdData, title, description, questions } = defaultData;

  const renderHeader = () => {
    return (
      <Grid {...styles.headerGridProps}>
        <Typography {...styles.dateProps}>{createdData}</Typography>
        <Typography {...styles.titleProps}>{title}</Typography>
        <Typography {...styles.descriptionProps}>{description}</Typography>
      </Grid>
    );
  };

  const renderQuestions = () => {
    return questions.map((question, index) => (
      <ListItem key={index} {...styles.listItemProps}>
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
    ));
  };

  const handleCopyToClipboard = () => {
    const text = JSON.stringify(data, null, 2); // Format the JSON for readability
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log('Text copied to clipboard');
      })
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

  return (
    <Grid {...styles.mainGridProps}>
      <Drawer open={open} onClose={onClose} {...styles.drawerGridProps}>
        {renderHeader()}
        {renderQuestions()}
        {renderFooterButtons()}
      </Drawer>
    </Grid>
  );
};

export default HistoryDrawer;
