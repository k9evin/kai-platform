// Redux actions for fetching and storing chat history.
import { createAsyncThunk } from '@reduxjs/toolkit';

import { initializeApp } from 'firebase/app';

import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';

import firebaseConfig from '../../firebase/config';

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

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
