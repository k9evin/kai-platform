import { Button, ButtonGroup } from '@mui/material';

import styled from 'styled-components';

export const StyledButtonGroup = styled(ButtonGroup)`
  margin-left: 10px; /* Adjust spacing if needed */
  display: flex;
  justify-content: space-evenly; /* Ensure even spacing */
  width: 100%;
`;

export const StyledQuickActionButton = styled(Button)`
  border: 2px solid purple;
  color: purple;
  display: flex;
  align-items: center;
`;

export const ActionIcon = styled.div`
  color: blue;
  cursor: pointer;
  margin-right: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }
`;
