import React from 'react';
import { Chip, Box } from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
import { ConnectionStatus } from '../types';

interface Props {
  status: ConnectionStatus;
}

export const ConnectionIndicator: React.FC<Props> = ({ status }) => {
  const getIcon = () => {
    if (status.connected) {
      return <CheckCircle />;
    }
    return <Error />;
  };

  const getColor = () => {
    if (status.connected) {
      return 'success';
    }
    return 'error';
  };

  const getLabel = () => {
    if (status.connected) {
      return 'Connected to MCP Server';
    }
    return status.error ? `Disconnected: ${status.error}` : 'Disconnected';
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Chip
        icon={getIcon()}
        label={getLabel()}
        color={getColor()}
        variant="outlined"
        size="small"
      />
      <small style={{ color: '#666' }}>
        Last checked: {status.lastChecked.toLocaleTimeString()}
      </small>
    </Box>
  );
};