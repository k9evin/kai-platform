// Redux actions for fetching and storing chat history.
import { createAsyncThunk } from '@reduxjs/toolkit';

import { collection, getDocs, query, where } from 'firebase/firestore';

import { db } from './firebaseConfig';

export const fetchChatHistory = createAsyncThunk(
  'chat/fetchChatHistory',
  async (userId) => {
    const q = query(collection(db, 'chats'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const history = [];
    querySnapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() });
    });
    return history;
  }
);
