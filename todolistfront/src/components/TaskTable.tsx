import React, { useState, useEffect } from 'react';
import { Dayjs } from 'dayjs';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Hidden,
  IconButton,
  Switch,
  InputAdornment,
  TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface Task {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

interface TaskTableProps {
  selectedDate: Dayjs | null;
  tasksUpdated: boolean;
  onTaskCompleted: (taskId: number, completed: boolean) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ selectedDate, tasksUpdated, onTaskCompleted }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTaskData, setEditedTaskData] = useState<Task | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Task; direction: 'asc' | 'desc' }>({
    key: 'completed',
    direction: 'asc',
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  const [showAllTasks, setShowAllTasks] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');  // State for search term

  const [page, setPage] = useState(0); // Current page number
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page

  const fetchTasks = () => {
    let url = 'http://localhost:8081/tasks';
    if (selectedDate && !showAllTasks) {
      const formattedDate = selectedDate.format('YYYY-MM-DD');
      url = `http://localhost:8081/tasks/due-date/${formattedDate}`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedDate, tasksUpdated, showAllTasks]);

  const handleStatusChange = (taskId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    fetch(`http://localhost:8081/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted: newStatus }),
    })
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, completed: newStatus } : task
          )
        );
        onTaskCompleted(taskId, newStatus);
      })
      .catch((error) => {
        console.error('Error updating task status:', error);
      });
  };

  const handleEditClick = (task: Task) => {
    setEditingTaskId(task.id);
    setEditedTaskData(task);
  };

  const handleSaveClick = () => {
    if (editedTaskData) {
      fetch(`http://localhost:8081/tasks/${editedTaskData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedTaskData),
      })
        .then(() => {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === editedTaskData.id ? editedTaskData : task
            )
          );
          setEditingTaskId(null);
        })
        .catch((error) => {
          console.error('Error updating task:', error);
        });
    }
  };

  const handleDeleteClick = (taskId: number) => {
    setTaskToDelete(taskId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete !== null) {
      fetch(`http://localhost:8081/tasks/${taskToDelete}`, {
        method: 'DELETE',
      })
        .then(() => {
          setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskToDelete));
          setOpenDeleteDialog(false);
        })
        .catch((error) => {
          console.error('Error deleting task:', error);
          setOpenDeleteDialog(false);
        });
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  const handleFieldChange = (field: keyof Task, value: string) => {
    setEditedTaskData((prevData) => {
      if (prevData) {
        return { ...prevData, [field]: value };
      }
      return prevData;
    });
  };

  const handleSort = (column: keyof Task) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === column && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: column, direction });
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredTasks = sortedTasks.filter((task) =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <label>Show All Tasks</label>
        <Switch
        checked={showAllTasks}
        onChange={(e) => setShowAllTasks(e.target.checked)}
        name="showAllTasks"
      />
      </div>

      <TextField
        label="Search Tasks"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        style={{ marginBottom: '20px' }}
      />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 340 }} aria-label="task table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '15%' }} onClick={() => handleSort('name')}>
                Task Name
                {sortConfig.key === 'name' && (
                  <IconButton size="small">
                    {sortConfig.direction === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                  </IconButton>
                )}
              </TableCell>
              {editingTaskId === null && (
                <TableCell align="center" sx={{ width: '20%' }} onClick={() => handleSort('completed')}>
                  Status
                  {sortConfig.key === 'completed' && (
                    <IconButton size="small">
                      {sortConfig.direction === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                    </IconButton>
                  )}
                </TableCell>
              )}
              <TableCell align="center" sx={{ width: '20%' }}>
                Actions
              </TableCell>
              <Hidden smDown>
                <TableCell sx={{ width: '30%' }}>Description</TableCell>
              </Hidden>
              {editingTaskId !== null && (
                <TableCell sx={{ width: '30%' }}>Due Date</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((task) => (
              <TableRow
                key={task.id}
                sx={{
                  backgroundColor: task.completed ? 'lightgreen' : 'transparent',
                }}
              >
                <TableCell component="th" scope="row" sx={{ width: '15%' }}>
                  {editingTaskId === task.id ? (
                    <TextField
                      value={editedTaskData?.name || ''}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    task.name
                  )}
                </TableCell>

                {editingTaskId === null && (
                  <TableCell align="center" sx={{ width: '20%' }}>
                    <Button
                      variant="contained"
                      color={task.completed ? 'success' : 'primary'}
                      onClick={() => handleStatusChange(task.id, task.completed)}
                    >
                      {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
                    </Button>
                  </TableCell>
                )}

                <TableCell align="center" sx={{ width: '20%' }}>
                  {editingTaskId === task.id ? (
                    <IconButton color="secondary" onClick={handleSaveClick}>
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <>
                      <IconButton onClick={() => handleEditClick(task)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteClick(task.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
                <Hidden smDown>
                  <TableCell sx={{ width: '30%' }}>
                    {editingTaskId === task.id ? (
                      <TextField
                        value={editedTaskData?.description || ''}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      task.description
                    )}
                  </TableCell>
                </Hidden>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredTasks.length} 
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <ConfirmDeleteDialog
        open={openDeleteDialog}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

interface ConfirmDeleteDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description">
      <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Are you sure you want to delete this task? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskTable;
