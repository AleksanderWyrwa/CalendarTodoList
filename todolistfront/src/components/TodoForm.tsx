import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Dayjs } from 'dayjs';

interface TodoFormProps {
  selectedDate: Dayjs | null;
  onClose: () => void;
  onTaskAdded: () => void; 
}

const TodoForm: React.FC<TodoFormProps> = ({ selectedDate, onClose, onTaskAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedDate) {
      alert('Please select a date');
      return;
    }

    const task = {
      name,
      description,
      dueDate: selectedDate.format('YYYY-MM-DD'),
      isCompleted: false,
    };

    console.log('Form Submitted:', task);

    fetch('http://localhost:8081/tasks/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })
      .then((response) => {
        if (response.ok) {
          console.log('New Task added');
          onTaskAdded(); 
          onClose();
        } else {
          console.log('Failed to add task');
        }
      })
      .catch((error) => {
        console.error('Error adding task:', error);
      });
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
      }}
    >
      <Paper
        elevation={7}
        sx={{
          padding: 4,
          maxWidth: 400,
          borderRadius: 4,
          position: 'relative',
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          X
        </Button>

        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': {
              margin: '16px 0',
              width: '100%',
            },
            display: 'flex',
            flexDirection: 'column',
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <TextField
            required
            id="outlined-required"
            label="Name"
            placeholder="ex. Buy Eggs"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            id="outlined-multiline-static"
            label="Description"
            multiline
            rows={4}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default TodoForm;
