// Importing necessary libraries and components
import React, { useEffect, useRef, useState } from 'react';

import {
  ArrowDownwardOutlined,
  InfoOutlined,
  Settings,
} from '@mui/icons-material';

import {
  Button,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';

import { collection, onSnapshot, query, where } from 'firebase/firestore';

import { useDispatch, useSelector } from 'react-redux';

import NavigationIcon from '@/assets/svg/Navigation.svg';

import { MESSAGE_ROLE, MESSAGE_TYPES } from '@/constants/bots';

import CenterChatContentNoMessages from './CenterChatContentNoMessages';

import ChatHistory from './ChatHistory'; // Added component import underneath the CenterChat import

import ChatSpinner from './ChatSpinner';

import Message from './Message';

import styles from './styles';

import {
  setChatSession,
  setError,
  setFullyScrolled,
  setInput, // Importing setInput action
  setMessages,
  setMore,
  setOpenInfoChat, // Importing setOpenInfoChat action
  setResetChat, // Importing setResetChat action
  setSessionLoaded,
  setStreaming,
  setStreamingDone,
  setTyping,
} from '@/redux/slices/chatSlice'; // Alphabetically sorted imports

import { firestore } from '@/redux/store';

import createChatSession from '@/services/chatbot/createChatSession';

import sendMessage from '@/services/chatbot/sendMessage';

// Chat Component
const Chat = () => {
  // Local state for message input and chat history
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);

  // Handle sending a message and updating the history
  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: history.length + 1,
        timestamp: new Date().toISOString(),
        message,
      };
      setHistory([...history, newMessage]);
      setMessage('');
    }
  };

  return (
    <div>
      {/* Displaying chat history */}
      <ChatHistory history={history} />
      {/* Text field for typing message */}
      <TextField
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        label="Type your message"
        fullWidth
      />
      {/* Button to send message */}
      <Button onClick={handleSendMessage} variant="contained" color="primary">
        Send
      </Button>
    </div>
  );
};

// Chat Interface Component
const ChatInterface = () => {
  const messagesContainerRef = useRef();

  const dispatch = useDispatch();
  const {
    more,
    input,
    typing,
    chat,
    sessionLoaded,
    openSettingsChat,
    infoChatOpened,
    fullyScrolled,
    streamingDone,
    streaming,
    error,
  } = useSelector((state) => state.chat);
  const { data: userData } = useSelector((state) => state.user);

  const sessionId = localStorage.getItem('sessionId');

  const currentSession = chat;
  const chatMessages = currentSession?.messages;
  const showNewMessageIndicator = !fullyScrolled && streamingDone;

  // Start a new conversation
  const startConversation = async (message) => {
    dispatch(
      setMessages({
        role: MESSAGE_ROLE.AI,
      })
    );
    dispatch(setTyping(true));

    // Define the chat payload
    const chatPayload = {
      user: {
        id: userData?.id,
        fullName: userData?.fullName,
        email: userData?.email,
      },
      type: 'chat',
      message,
    };

    // Send a chat session
    const { status, data } = await createChatSession(chatPayload, dispatch);

    // Remove typing bubble
    dispatch(setTyping(false));
    if (status === 'created') dispatch(setStreaming(true));

    // Set chat session
    dispatch(setChatSession(data));
    dispatch(setSessionLoaded(true));
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      localStorage.removeItem('sessionId');
      dispatch(setResetChat());
    };
  }, []);

  // Listen for updates to the chat session
  useEffect(() => {
    let unsubscribe;

    if (sessionLoaded || currentSession) {
      messagesContainerRef.current?.scrollTo(
        0,
        messagesContainerRef.current?.scrollHeight,
        {
          behavior: 'smooth',
        }
      );

      const sessionRef = query(
        collection(firestore, 'chatSessions'),
        where('id', '==', sessionId)
      );

      unsubscribe = onSnapshot(sessionRef, async (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'modified') {
            const updatedData = change.doc.data();
            const updatedMessages = updatedData.messages;

            const lastMessage = updatedMessages[updatedMessages.length - 1];

            if (lastMessage?.role === MESSAGE_ROLE.AI) {
              dispatch(
                setMessages({
                  role: MESSAGE_ROLE.AI,
                  response: lastMessage,
                })
              );
              dispatch(setTyping(false));
            }
          }
        });
      });
    }

    return () => {
      if (sessionLoaded || currentSession) unsubscribe();
    };
  }, [sessionLoaded]);

  // Handle scrolling in the messages container
  const handleOnScroll = () => {
    const scrolled =
      Math.abs(
        messagesContainerRef.current.scrollHeight -
          messagesContainerRef.current.clientHeight -
          messagesContainerRef.current.scrollTop
      ) <= 1;

    if (fullyScrolled !== scrolled) dispatch(setFullyScrolled(scrolled));
  };

  // Scroll to the bottom of the messages container
  const handleScrollToBottom = () => {
    messagesContainerRef.current?.scrollTo(
      0,
      messagesContainerRef.current?.scrollHeight,
      {
        behavior: 'smooth',
      }
    );

    dispatch(setStreamingDone(false));
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    dispatch(setStreaming(true));

    if (!input) {
      dispatch(setError('Please enter a message'));
      setTimeout(() => {
        dispatch(setError(null));
      }, 3000);
      return;
    }

    const message = {
      role: MESSAGE_ROLE.HUMAN,
      type: MESSAGE_TYPES.TEXT,
      payload: {
        text: input,
      },
    };

    if (!chatMessages) {
      await startConversation(message);
      return;
    }

    dispatch(
      setMessages({
        role: MESSAGE_ROLE.HUMAN,
      })
    );

    dispatch(setTyping(true));

    await sendMessage({ message, id: sessionId }, dispatch);
  };

  // Handle quick reply messages
  const handleQuickReply = async (option) => {
    dispatch(setInput(option));
    dispatch(setStreaming(true));

    const message = {
      role: MESSAGE_ROLE.HUMAN,
      type: MESSAGE_TYPES.QUICK_REPLY,
      payload: {
        text: option,
      },
    };

    dispatch(
      setMessages({
        role: MESSAGE_ROLE.HUMAN,
      })
    );
    dispatch(setTyping(true));

    await sendMessage({ message, id: currentSession?.id }, dispatch);
  };

  // Handle key down events for sending a message
  const keyDownHandler = async (e) => {
    if (typing || !input || streaming) return;
    if (e.keyCode === 13) handleSendMessage();
  };

  // Attach keyDownHandler to document keydown event listener
  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [typing, input, streaming]); // Add dependencies to ensure correct behavior

  // Render the send icon
  const renderSendIcon = () => {
    return (
      <InputAdornment position="end">
        <IconButton
          onClick={handleSendMessage}
          {...styles.bottomChatContent.iconButtonProps(
            typing || error || !input || streaming
          )}
        >
          <NavigationIcon />
        </IconButton>
      </InputAdornment>
    );
  };

  // Render the more chat options
  const renderMoreChat = () => {
    if (!more) return null;
    return (
      <Grid {...styles.moreChat.moreChatProps}>
        <Grid {...styles.moreChat.contentMoreChatProps}>
          <Settings {...styles.moreChat.iconProps} />
          <Typography {...styles.moreChat.titleProps}>Settings</Typography>
        </Grid>
        <Grid
          {...styles.moreChat.contentMoreChatProps}
          onClick={() => dispatch(setOpenInfoChat())}
        >
          <InfoOutlined {...styles.moreChat.iconProps} />
          <Typography {...styles.moreChat.titleProps}>Information</Typography>
        </Grid>
      </Grid>
    );
  };

  // Render the center chat content with messages
  const renderCenterChatContent = () => {
    if (
      !openSettingsChat &&
      !infoChatOpened &&
      chatMessages?.length !== 0 &&
      !!chatMessages
    )
      return (
        <Grid
          onClick={() => dispatch(setMore({ role: 'shutdown' }))}
          {...styles.centerChat.centerChatGridProps}
        >
          <Grid
            ref={messagesContainerRef}
            onScroll={handleOnScroll}
            {...styles.centerChat.messagesGridProps}
          >
            {chatMessages?.map(
              (message, index) =>
                message?.role !== MESSAGE_ROLE.SYSTEM && (
                  <Message
                    ref={messagesContainerRef}
                    {...message}
                    messagesLength={chatMessages?.length}
                    messageNo={index + 1}
                    onQuickReply={handleQuickReply}
                    streaming={streaming}
                    fullyScrolled={fullyScrolled}
                    key={index}
                  />
                )
            )}
            {typing && <ChatSpinner />}
          </Grid>
        </Grid>
      );

    return null;
  };

  // Render the center chat content when there are no messages
  const renderCenterChatContentNoMessages = () => {
    if ((chatMessages?.length === 0 || !chatMessages) && !infoChatOpened)
      return <CenterChatContentNoMessages />;
    return null;
  };

  // Render the scroll to bottom button
  const renderScrollToBottomButton = () => {
    if (showNewMessageIndicator)
      return (
        <Fade in={showNewMessageIndicator}>
          <IconButton
            {...styles.bottomChatContent.floatingButtonProps}
            onClick={handleScrollToBottom}
          >
            <ArrowDownwardOutlined />
          </IconButton>
        </Fade>
      );
    return null;
  };

  return (
    <Grid {...styles.rootGridProps}>
      {renderMoreChat()}
      {renderCenterChatContent()}
      {renderCenterChatContentNoMessages()}
      {renderScrollToBottomButton()}
      {renderSendIcon()}
    </Grid>
  );
};

export default ChatInterface;
