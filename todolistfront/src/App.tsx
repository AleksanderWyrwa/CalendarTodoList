import { useState } from 'react';
import SearchAppBar from './components/TodoAppHeader';
import DateCalendar from './components/DateCalender';
import TaskTable from './components/TaskTable';
import TodoForm from './components/TodoForm';
import Button from '@mui/material/Button';
import './App.css';
import dayjs, { Dayjs } from 'dayjs';

export default function App() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tasksUpdated, setTasksUpdated] = useState(false);
  const [badgesUpdated, setBadgesUpdated] = useState(false);  
  const refreshTaskList = () => {
    setTasksUpdated((prev) => !prev);  
  };

  const refreshBadges = () => {
    setBadgesUpdated((prev) => !prev);  
  }

  return (
    <div id="root">
      <header>
        <SearchAppBar />
      </header>
      <main className="main-content">
        <div className="card">
          <DateCalendar 
            selectedDate={selectedDate} 
            onDateChange={setSelectedDate}
            refreshBadges={refreshBadges}  
            badgesUpdated={badgesUpdated} 
          />
          <div>
            <Button variant="contained" onClick={() => setIsFormOpen(true)}>
              Show Todo Form
            </Button>
            {isFormOpen && (
              <TodoForm
                selectedDate={selectedDate}
                onClose={() => setIsFormOpen(false)}
                onTaskAdded={() => {
                  refreshTaskList();
                  refreshBadges();  
                }}
              />
            )}
          </div>
          <TaskTable selectedDate={selectedDate} tasksUpdated={tasksUpdated} onTaskCompleted={refreshBadges}/>
        </div>
      </main>
    </div>
  );
}
