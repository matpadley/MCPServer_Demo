import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams
} from '@mui/x-data-grid';
import {
  Refresh,
  Delete,
  CheckCircle,
  RadioButtonUnchecked
} from '@mui/icons-material';
import { Todo } from '../types';
import { mcpService } from '../services/mcpService';

interface Props {
  refreshTrigger: number;
}

export const TodoList: React.FC<Props> = ({ refreshTrigger }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await mcpService.callTool('read_todos', {}) as { content?: string | any[] };
      
      // Parse the result - the MCP server returns content as string
      let todoList: Todo[] = [];
      if (result?.content) {
        const content = result.content;
        if (typeof content === 'string') {
          // Try to extract JSON from the content
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            todoList = JSON.parse(jsonMatch[0]);
          }
        } else if (Array.isArray(content)) {
          todoList = content;
        }
      }

      setTodos(todoList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [refreshTrigger]);

  const handleToggleComplete = async (id: number) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const newDescription = todo.completed 
        ? todo.description.replace('[COMPLETED] ', '')
        : `[COMPLETED] ${todo.description}`;

      await mcpService.callTool('update_todo', {
        id,
        description: newDescription
      });

      loadTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    try {
      await mcpService.callTool('delete_todo', { id });
      loadTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      type: 'number'
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      renderCell: (params) => {
        const isCompleted = params.row.description?.startsWith('[COMPLETED]');
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span style={{ 
              textDecoration: isCompleted ? 'line-through' : 'none',
              opacity: isCompleted ? 0.6 : 1
            }}>
              {params.value}
            </span>
            {isCompleted && (
              <Chip label="Completed" size="small" color="success" />
            )}
          </Box>
        );
      }
    },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      width: 180,
      renderCell: (params) => {
        return new Date(params.value).toLocaleString();
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params: GridRowParams) => {
        const isCompleted = params.row.description?.startsWith('[COMPLETED]');
        
        return [
          <GridActionsCellItem
            key="toggle-complete"
            icon={isCompleted ? <RadioButtonUnchecked /> : <CheckCircle />}
            label={isCompleted ? "Mark Incomplete" : "Mark Complete"}
            onClick={() => handleToggleComplete(params.id as number)}
          />,
          <GridActionsCellItem
            key="delete"
            icon={<Delete />}
            label="Delete"
            onClick={() => handleDelete(params.id as number)}
          />
        ];
      }
    }
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Todo List ({todos.length} items)
        </Typography>
        <Button
          variant="outlined"
          startIcon={loading ? <CircularProgress size={16} /> : <Refresh />}
          onClick={loadTodos}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DataGrid
        rows={todos}
        columns={columns}
        loading={loading}
        autoHeight
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } }
        }}
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #e0e0e0'
          }
        }}
      />
    </Paper>
  );
};