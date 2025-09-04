import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { mcpService } from '../services/mcpService';

interface Props {
  onTodoAdded: () => void;
}

export const AddTodoForm: React.FC<Props> = ({ onTodoAdded }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await mcpService.callTool('create_todo', {
        description: description.trim(),
        createdDate: new Date().toISOString()
      });

      setDescription('');
      onTodoAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add New Todo
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          placeholder="Enter todo description..."
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !description.trim()}
          startIcon={<Add />}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Adding...' : 'Add Todo'}
        </Button>
      </Box>
    </Paper>
  );
};