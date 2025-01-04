import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';

interface DateCalendarProps {
  selectedDate: Dayjs | null;
  onDateChange: (date: Dayjs | null) => void;
  refreshBadges: () => void;
  badgesUpdated: boolean;  
}

const DateCalendar: React.FC<DateCalendarProps> = ({ selectedDate, onDateChange, refreshBadges, badgesUpdated }) => {
  const requestAbortController = React.useRef<AbortController | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState<number[]>([]);
  const [taskCounts, setTaskCounts] = React.useState<Record<number, number>>({}); 

  const fetchHighlightedDaysForMonth = async (month: Dayjs) => {
    const controller = new AbortController();
    requestAbortController.current = controller;

    setIsLoading(true);
    setHighlightedDays([]);  
    setTaskCounts({}); 

    try {
      console.log(`Fetching uncompleted tasks for month ${month.month() + 1} of ${month.year()}`);

      const response = await fetch(
        `http://localhost:8081/tasks/uncompleted-count/month/${month.year()}/${month.month() + 1}`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        console.error(`Error: Failed to fetch tasks. Status: ${response.status} ${response.statusText}`);
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const dailyCounts: Record<number, number> = await response.json();
      console.log('API response:', dailyCounts);

      const allDays = Array.from({ length: month.daysInMonth() }, (_, i) => i + 1);
      const fullTaskCounts = allDays.reduce((acc, day) => {
        acc[day] = dailyCounts[day] ?? -1; 
        return acc;
      }, {} as Record<number, number>);

      const daysToHighlight = Object.entries(fullTaskCounts)
        .filter(([_, count]) => count > -1)
        .map(([day]) => parseInt(day, 10));

      console.log('Days to highlight:', daysToHighlight);
      setHighlightedDays(daysToHighlight);
      setTaskCounts(fullTaskCounts); 
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Fetch canceled');
      } else {
        console.error('Error fetching highlighted days:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchHighlightedDaysForMonth(dayjs());
  }, [badgesUpdated]);  

  const handleMonthChange = (month: Dayjs) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }

    fetchHighlightedDaysForMonth(month);
  };

  function ServerDay(props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }) {
    const { day, outsideCurrentMonth, ...other } = props;
    const taskCount = taskCounts[day.date()] ?? -1;

    if (taskCount === -1) {
      return <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />;
    }

    return (
      <Badge
        key={day.toString()}
        overlap="circular"
        badgeContent={taskCount === 0 ? '⭐' : taskCount > 9 ? '9+' : taskCount} 
        color={taskCount === 0 ? 'secondary' : 'primary'} 
      >
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
      </Badge>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        orientation="landscape"
        value={selectedDate}
        onChange={onDateChange}
        loading={isLoading}
        onMonthChange={handleMonthChange}
        renderLoading={() => <div>Loading...</div>}
        slots={{
          day: (dayProps) => <ServerDay {...dayProps} highlightedDays={highlightedDays} />,
        }}
        sx={{
          '.MuiPickersCalendarHeader-root': {
            color: '#1976d2',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            backgroundColor: '#e3f2fd',
          },
          '.MuiPickersDay-root': {
            color: '#0d47a1',
            backgroundColor: '#bbdefb',
            borderRadius: '50%',
            '&:hover': {
              backgroundColor: '#90caf9',
            },
            '&.Mui-selected': {
              backgroundColor: '#1976d2',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            },
          },
          '.MuiPickersDay-daySelected': {
            backgroundColor: '#1976d2',
            color: '#ffffff',
          },
          '.MuiPickersMonth-root': {
            fontSize: '1rem',
          },
          '.MuiPickersDay-day': {
            minWidth: '2rem',
            height: '2rem',
          },
          '.MuiButtonBase-root': {
            color: '#1976d2',
            '&:hover': {
              backgroundColor: '#90caf9',
            },
          },
          borderRadius: '12px',
          borderWidth: '1px',
          borderColor: '#2196f3',
          border: '1px solid',
          backgroundColor: '#e3f2fd',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',

          '@media (max-width: 640px)': {
            '.MuiPickersToolbar-root': {
              display: 'none',
            },
          },

          '@media (min-width: 640px)': {
            '.MuiPickersToolbar-root': {
              display: 'block',
            },
          },

          '.MuiPickerToolbar-action': {
            display: 'none',
          },
        }}
      />
    </LocalizationProvider>
  );
};


export default DateCalendar;
