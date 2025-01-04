package com.aleksanderwyrwa.todolist.repository;

import com.aleksanderwyrwa.todolist.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task,Integer> {
    List<Task> findByDueDate(LocalDate dueDate);
}
