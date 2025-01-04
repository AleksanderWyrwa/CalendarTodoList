package com.aleksanderwyrwa.todolist.service;

import com.aleksanderwyrwa.todolist.model.Task;

import java.time.LocalDate;
import java.util.List;

public interface TaskService {
    Task saveTask(Task task);
    List<Task> getAllTasks();
    Task getTaskById(int id);
    Task updateTask(int id, Task updatedTask);
    void deleteTask(int id);

    List<Task> getTasksByDueDate(LocalDate dueDate);

    Task updateTaskCompletion(int taskId, boolean isCompleted);
}
