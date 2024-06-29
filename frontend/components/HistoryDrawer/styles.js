const styles = {
  mainGridProps: {
    container: true,
    item: true,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  drawerGridProps: {
    anchor: 'right',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    sx: {
      '& .MuiDrawer-paper': {
        width: '45%',
        background: (theme) => theme.palette.common.white,
        p: '20px 40px',
      },
    },
  },
  headerGridProps: {
    container: true,
    item: true,
    flexDirection: 'column',
    pb: 1.5,
    sx: {
      borderBottom: (theme) => `2px solid ${theme.palette.grey[400]}`,
      mb: 1,
    },
  },
  dateProps: {
    display: 'flex',
    fontFamily: 'Satoshi Regular',
    fontSize: '14px',
    fontWeight: 700,
    borderRadius: 58,
    border: 'none',
    width: 125,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F2',
    color: '#4900E4',
  },
  titleProps: {
    fontFamily: 'Satoshi Bold',
    fontSize: '22px',
    fontWeight: 700,
    color: (theme) => theme.palette.Common.Black['100p'],
    marginTop: 1,
  },
  descriptionProps: {
    fontFamily: 'Satoshi Bold',
    fontSize: '14px',
    fontWeight: 700,
    color: '#B8B8B8',
  },
  listItemProps: {
    container: true,
    item: true,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    py: 2,
    sx: {
      display: 'flex', // This enables flexbox
      flexDirection: 'column', // This sets the flex direction to column
      // Add any other necessary styling here
    },
  },
  questionProps: {
    fontFamily: 'Satoshi Bold',
    fontSize: '18px',
    fontWeight: 700,
    color: (theme) => theme.palette.Common.Black['100p'],
  },
  optionsListProps: {
    container: true,
    item: true,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  optionProps: {
    fontFamily: 'Satoshi Regular',
    fontSize: '18px',
    fontWeight: 400,
    color: (theme) => theme.palette.Common.Black['100p'],
  },
  answerTextProps: {
    fontFamily: 'Satoshi Bold',
    fontSize: '18px',
    fontWeight: 700,
    color: (theme) => theme.palette.Common.Black['100p'],
  },
  answerKeyProps: {
    fontFamily: 'Satoshi Regular',
    fontSize: '18px',
    fontWeight: 400,
    color: (theme) => theme.palette.Common.Black['100p'],
  },
  drawerButtonProps: {
    sx: {
      backgroundColor: '#F3F0FF',
      color: '#4900E4',
      borderRadius: '100px',
      marginRight: '8px',
      marginLeft: '8px',
      width: '116px',
      height: '37px',
      fontFamily: 'Satoshi Bold',
      fontSize: '14px',
      fontWeight: 700,
      textTransform: 'none',
      gap: 0.5,
      '&:hover': {
        backgroundColor: '#F3F0FF',
        color: '#4900E4',
      },
    },
  },
};

export default styles;
