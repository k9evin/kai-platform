// Importing necessary libraries and components
import React, { useEffect, useRef, useState } from 'react';

import { ArrowDownwardOutlined, InfoOutlined } from '@mui/icons-material';

import {
  Button,
  Fade,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';

import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase authentication libraries

import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

import { useDispatch, useSelector } from 'react-redux';

import { MESSAGE_ROLE, MESSAGE_TYPES } from '@/constants/bots';

import CenterChatContentNoMessages from './CenterChatContentNoMessages';

import ChatHistory from './ChatHistory'; // Added component import underneath the CenterChat import

import ChatSpinner from './ChatSpinner';

import Message from './Message';

import styles from './styles';

import {
  resetChat, // Importing setResetChat action
  setChatSession,
  setError,
  setFullyScrolled,
  setInput, // Importing setInput action
  setMessages,
  setOpenInfoChat, // Importing setOpenInfoChat action
  setSessionLoaded,
  setStreaming,
  setStreamingDone,
  setTyping,
} from '@/redux/slices/chatSlice'; // Alphabetically sorted imports

import { firestore } from '@/redux/store';

import createChatSession from '@/services/chatbot/createChatSession';

import sendMessage from '@/services/chatbot/sendMessage';

// Chat Component
const Chat = ({ user }) => {
  // Local state for message input and chat history
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState(() => {
    // Retrieve the saved history from local storage
    const savedHistory = localStorage.getItem('chatHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  // Handle sending a message and updating the history
  const handleSendMessage = async () => {
    if (message.trim()) {
      const topic = message.split(' ')[0];
      const newMessage = {
        id: history.length + 1,
        timestamp: new Date().toISOString(),
        message,
        topic,
        userId: user.uid, //  Add user ID for data validation and storage
      };
      const newHistory = [...history, newMessage];
      setHistory(newHistory);
      setMessage('');
      localStorage.setItem('chatHistory', JSON.stringify(newHistory)); // Save history to local storage
      // Save chat message to Firestore
      try {
        await addDoc(collection(firestore, 'chats'), newMessage);
      } catch (e) {
        // console.error('Error adding document: ', e);
      }
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  // Function to clear chat history
  const handleClearHistory = async (topic) => {
    // Delete messages related to the topic from Firestore
    try {
      // Query to get all messages for the given topic
      const q = query(
        collection(firestore, 'chats'),
        where('topic', '==', topic)
      );
      const snapshot = await getDocs(q);

      // Delete each message document
      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Update local state and localStorage
      const updatedHistory = history.filter((msg) => msg.topic !== topic);
      setHistory(updatedHistory);
      localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
    } catch (e) {
      // console.error('Error deleting documents: ', e);
    }
  };
  return (
    <div>
      {/* Displaying chat history */}
      <ChatHistory
        history={history}
        onClearHistory={handleClearHistory}
        setHistory={setHistory}
      />
      {/* Text field for typing message */}
      <TextField
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress} // Add key press handler
        label="Type your message"
        fullWidth
        InputProps={{
          style: { color: 'darkblue' },
        }}
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
  } = useSelector((state) => state.chat);
  const { data: userData } = useSelector((state) => state.user);
  const [user, setUser] = useState(null); // Local state for authenticated user
  const auth = getAuth();

  // Monitor authentication state
  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser); // Set authenticated user
      } else {
        // Redirect to login page or handle unauthenticated state
        window.location.href = '/login'; // Example redirect
      }
    });
  }, []);

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
      dispatch(resetChat());
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
    const messagesContainer = messagesContainerRef.current;
    const isScrolledToBottom =
      messagesContainer.scrollHeight - messagesContainer.clientHeight <=
      messagesContainer.scrollTop + 1;

    if (!isScrolledToBottom) {
      messagesContainerRef.current?.scrollTo({
        top: messagesContainerRef.current?.scrollHeight,
        behavior: 'smooth',
      });
    }

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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      await handleSendMessage();
    }
  };

  // Attach keyDownHandler to document keydown event listener
  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [typing, input, streaming]); // Add dependencies to ensure correct behavior

  // Render the more chat options
  const renderMoreChat = () => {
    if (!more) return null;
    return (
      <Fade in timeout={300}>
        <Grid item style={styles.moreChat}>
          <IconButton
            onClick={() => dispatch(setOpenInfoChat(true))}
            size="small"
          >
            <InfoOutlined fontSize="small" />
          </IconButton>
          <Typography variant="body2">Information</Typography>
        </Grid>
      </Fade>
    );
  };

  // Render the center chat content with messages
  const renderCenterChatContent = () => {
    if (
      !openSettingsChat &&
      !infoChatOpened &&
      chatMessages?.length !== 0 &&
      !!chatMessages
    ) {
      return (
        <div
          ref={messagesContainerRef}
          onScroll={handleOnScroll}
          style={styles.centerChatContent}
        >
          {chatMessages?.map((message, index) => (
            <Message
              key={`message-${index}`}
              {...message}
              onQuickReply={handleQuickReply}
              streaming={streaming}
              fullyScrolled={fullyScrolled}
            />
          ))}
          {typing && <ChatSpinner />}
        </div>
      );
    }
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
    if (showNewMessageIndicator) {
      return (
        <Fade in timeout={300}>
          <IconButton
            onClick={handleScrollToBottom}
            style={styles.scrollToBottomButton}
            size="small"
          >
            <ArrowDownwardOutlined fontSize="small" />
          </IconButton>
        </Fade>
      );
    }
    return null;
  };

  return (
    <Grid {...styles.rootGridProps}>
      {renderMoreChat()}
      {renderCenterChatContent()}
      {renderCenterChatContentNoMessages()}
      {renderScrollToBottomButton()}
      {user && <Chat user={user} />}
      {/* Pass authenticated user to Chat component */}
    </Grid>
  );
};

export default ChatInterface;
