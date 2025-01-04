package com.aleksanderwyrwa.todolist.service;

import com.aleksanderwyrwa.todolist.Exception.ResourceNotFoundException;
import com.aleksanderwyrwa.todolist.model.Task;
import com.aleksanderwyrwa.todolist.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TaskServiceImplementation implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Override
    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    public List<Task> getTasksByDueDate(LocalDate dueDate) {
        return taskRepository.findByDueDate(dueDate);
    }

    public Task updateTaskCompletion(int taskId, boolean isCompleted) {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        task.setCompleted(isCompleted);
        return taskRepository.save(task);
    }


    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public Task getTaskById(int id) {
        Optional<Task> task = taskRepository.findById(id);
        return task.orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));
    }

    @Override
    public Task updateTask(int id, Task updatedTask) {
        Task existingTask = getTaskById(id);
        existingTask.setName(updatedTask.getName());
        existingTask.setDescription(updatedTask.getDescription());
        existingTask.setDueDate(updatedTask.getDueDate());
        existingTask.setCompleted(updatedTask.isCompleted());
        return taskRepository.save(existingTask);
    }


    @Override
    public void deleteTask(int id) {
        taskRepository.deleteById(id);
    }
}
