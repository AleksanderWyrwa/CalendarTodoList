ToDo List Application 📋
A feature-rich ToDo List application designed to streamline task management and boost productivity. This application offers advanced task sorting, a dynamic calendar view, and intuitive filtering options.

Features 🌟
Task Sorting by Days: Organize your tasks efficiently by sorting them according to specific days.
Dynamic Calendar: View the total number of tasks to complete on any given day directly on the calendar.
Show All Tasks: Option to display all tasks in one view for comprehensive management.
Sorting Options:
Sort tasks alphabetically by name.
Sort tasks by their completion status (completed or pending).

Technology Stack 🛠️
-  Frontend: Vite + React.js
-  Backend: Spring Boot (Java)
-  Database: MySQL (using XAMPP for local setup)

Configuration for Spring Boot 🔧
Ensure the application.properties file in the Spring Boot project is configured as follows:

# Application name
spring.application.name=todolist

# Hibernate settings for database schema management
spring.jpa.hibernate.ddl-auto=update

# Datasource settings for MySQL (via XAMPP)
spring.datasource.url=jdbc:mysql://localhost:3306/todolist
spring.datasource.username=root
spring.datasource.password=

# Port where the Spring Boot application will run
server.port=8081

# MySQL driver
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Additional Hibernate settings (optional)
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.show-sql=true
Usage 🖱️


Add Tasks:

Use the task creation form to add new tasks, assigning them to specific dates.
View Tasks by Day:

Click on any date in the calendar to view tasks for that day.
View All Tasks:

Toggle the "Show All Tasks" option to display all tasks regardless of their assigned date.
Sort Tasks:

Use sorting options to organize tasks by:
Name: Alphabetically sort tasks.
Status: Group tasks by completion status (completed or pending).
Track Progress:

The calendar dynamically updates to show the number of tasks due for each day, helping you stay on top of deadlines.
