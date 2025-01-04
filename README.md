# ToDo List Application 📋

A feature-rich ToDo List application designed to streamline task management and boost productivity. This application offers advanced task sorting, a dynamic calendar view, and intuitive filtering options.

---

## Features 🌟

- **Task Sorting by Days**: Organize your tasks efficiently by sorting them according to specific days.
- **Dynamic Calendar**: View the total number of tasks to complete on any given day directly on the calendar.
- **Show All Tasks**: Option to display all tasks in one view for comprehensive management.
- **Sorting Options**:
  - Sort tasks alphabetically by name.
  - Sort tasks by their completion status (completed or pending).
- **Responsive Design**: A user-friendly interface that works seamlessly across devices.

---

## Technology Stack 🛠️

- **Frontend**: Vite + React.js
- **Backend**: Spring Boot (Java)
- **Database**: MySQL (using XAMPP for local setup)

---

## Getting Started 🚀

Follow these steps to set up and run the **ToDo List Application** locally.

### Prerequisites

1. Install **XAMPP** for MySQL:
   - [Download XAMPP](https://www.apachefriends.org/index.html) and start the MySQL service.
2. Install **Java Development Kit (JDK)**:
   - Ensure JDK 17+ is installed and configured.
3. Install **Node.js**:
   - [Download Node.js](https://nodejs.org/).

---

## Database Setup with XAMPP ⚙️

1. **Start MySQL**:
   - Open XAMPP and start the **MySQL** service.

2. **Create Database**:
   - Open phpMyAdmin (`http://localhost/phpmyadmin`).
   - Create a new database named `todolist`.

3. **Set Up User and Permissions** (Optional):
   - Use `root` as the username with no password for local development (default configuration).

---

## Frontend Setup (Vite + React) 🖥️

1. **Navigate to the Frontend Directory**:
   cd path-to-your-vite-react-project
   
   **Install Dependencies**:
   npm install

   **Run the Frontend:**
   npm run dev

## Configuration for Spring Boot 🔧

Ensure the `application.properties` file in the Spring Boot project is configured as follows:

```properties
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
```

## Running the Backend with IntelliJ IDEA 🚀

Follow these steps to run the Spring Boot backend with IntelliJ IDEA:

### 1. **Open the Project**
   - Launch IntelliJ IDEA and open your Spring Boot project by navigating to **File > Open** and selecting the project directory.

### 2. **Configure the Application**
   - Open the `application.properties` or `application.yml` file and make sure that the database configurations and port are set properly (as described previously).
   - Make sure your MySQL database is running via XAMPP and the `todolist` database exists.

### 3. **Run the Application**
   - In IntelliJ, open the **Run/Debug Configuration** settings by clicking on the **Run** menu and selecting **Edit Configurations**.
   - Select the default Spring Boot run configuration or create a new one:
     - Choose **Application** as the configuration type.
     - In the **Main class** field, specify the main class (usually the one with the `@SpringBootApplication` annotation, e.g., `com.example.TodolistApplication`).
     - Click **OK** to save the configuration.
   - To run the application, simply click on the **Run** button (the green play icon) or press `Shift + F10`. The application will start, and you should see logs in the console.

### 4. **Access the Backend**
   - After the application starts, you can access the backend on `http://localhost:8081` (or the port you configured).

---

## Usage 🖱️

1. **Add Tasks**:
   - Use the task creation form to add new tasks, assigning them to specific dates.

2. **View Tasks by Day**:
   - Click on any date in the calendar to view tasks for that day.

3. **View All Tasks**:
   - Toggle the "Show All Tasks" option to display all tasks regardless of their assigned date.

4. **Sort Tasks**:
   - **By Name**: Alphabetically sort tasks.
   - **By Status**: Group tasks by completion status (completed or pending).

5. **Track Progress**:
   - The calendar dynamically updates to show the number of tasks due for each day, helping you stay on top of deadlines.

---

## Troubleshooting 🛠️

1. **Database Connection Issues**:
   - Ensure XAMPP MySQL service is running.
   - Verify the `todolist` database exists in phpMyAdmin.
   - Check that the username (`root`) and password are correctly configured in `application.properties`.

2. **Frontend Not Loading**:
   - Ensure `npm install` was executed before running `npm run dev`.

---

## Contact 📧

For any questions or suggestions, feel free to reach out:  
**Aleksander Wyrwa**  
**aleksander.wyrwa13@gmail.com**
