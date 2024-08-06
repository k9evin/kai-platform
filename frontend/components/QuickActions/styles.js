import { ButtonGroup } from '@mui/material';

import styled from 'styled-components';

export const StyledButtonGroup = styled(ButtonGroup)`
  margin-bottom: 10px;
  justify-content: center;
  width: 100%;
`;

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;

export const MessageInput = styled.div`
  margin-top: 10px;
  width: 100%;
`;

export const SendButton = styled.div`
  margin-top: 10px;
  width: 100%;
`;

export const HistoryContainer = styled.div`
  width: 100%;
  margin-top: 20px;
`;
