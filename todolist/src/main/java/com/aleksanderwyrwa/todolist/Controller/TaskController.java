package com.aleksanderwyrwa.todolist.Controller;

import com.aleksanderwyrwa.todolist.model.Task;
import com.aleksanderwyrwa.todolist.repository.TaskRepository;
import com.aleksanderwyrwa.todolist.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/tasks")
@CrossOrigin
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping("/due-date/{date}")
    public List<Task> getTasksByDueDate(@PathVariable String date) {
        // Convert the string date to LocalDate
        LocalDate dueDate = LocalDate.parse(date);
        return taskService.getTasksByDueDate(dueDate);
    }
    @PostMapping("/add")
    public Task createTask(@RequestBody Task task) {
        return taskService.saveTask(task);
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable int id) {
        return taskService.getTaskById(id);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable int id, @RequestBody Task updatedTask) {
        return taskService.updateTask(id, updatedTask);
    }

    @PatchMapping("/{taskId}")
    public Task updateTaskCompletion(@PathVariable int taskId, @RequestBody Map<String, Boolean> update) {
        boolean isCompleted = update.get("isCompleted");
        return taskService.updateTaskCompletion(taskId, isCompleted);
    }
    @GetMapping("/{taskId}/isCompleted")
    public ResponseEntity<Boolean> isTaskCompleted(@PathVariable int taskId) {
        // Znalezienie zadania na podstawie ID
        Optional<Task> taskOptional = taskRepository.findById(taskId);

        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            // Zwracamy odpowiedź, która zawiera status isCompleted
            return ResponseEntity.ok(task.isCompleted());
        } else {
            // Jeśli zadanie nie istnieje, zwrócimy błąd 404
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/uncompleted-count/{date}")
    public ResponseEntity<Integer> getUncompletedTaskCountByDate(@PathVariable String date) {
        // Convert the string date to LocalDate
        LocalDate dueDate = LocalDate.parse(date);

        // Fetch all tasks for the given date
        List<Task> tasksByDate = taskService.getTasksByDueDate(dueDate);

        if (tasksByDate.isEmpty()) {
            // Return -1 if no tasks exist for the given date
            return ResponseEntity.ok(-1);
        }

        // Count uncompleted tasks
        long uncompletedCount = tasksByDate.stream()
                .filter(task -> !task.isCompleted())
                .count();

        // Return 0 if all tasks are completed, or the count of uncompleted tasks
        return ResponseEntity.ok((int) uncompletedCount);
    }

    @GetMapping("/uncompleted-count/month/{year}/{month}")
    public ResponseEntity<Map<Integer, Integer>> getUncompletedTaskCountByMonth(
            @PathVariable int year,
            @PathVariable int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        Map<Integer, Integer> dailyCounts = new HashMap<>();

        while (!startDate.isAfter(endDate)) {
            List<Task> tasks = taskService.getTasksByDueDate(startDate);
            int uncompletedCount = tasks.isEmpty() ? -1 :
                    (int) tasks.stream().filter(task -> !task.isCompleted()).count();
            dailyCounts.put(startDate.getDayOfMonth(), uncompletedCount);
            startDate = startDate.plusDays(1);
        }

        return ResponseEntity.ok(dailyCounts);
    }

    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable int id) {
        taskService.deleteTask(id);
        return "Task with ID " + id + " has been deleted.";
    }
}
