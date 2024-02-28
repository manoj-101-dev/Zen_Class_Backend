# Zen Class Backend

This is the backend server for the Zen Class application. It provides APIs for user authentication, managing queries, leave applications, and tasks.

## Technologies Used

- **Node.js:** Server-side JavaScript runtime environment.
- **Express.js:** Web application framework for Node.js.
- **MongoDB:** NoSQL database for storing data.
- **JWT (JSON Web Tokens):** Used for user authentication and authorization.

## Available Routes

- **POST /signup:** Sign up a new user.
- **POST /login:** Log in an existing user.
- **GET /protected-route:** Access a protected route (requires authentication).
- **POST /queries:** Create a new query.
- **GET /queries:** Get all queries.
- **DELETE /queries/:id:** Delete a query by ID.
- **POST /leaveApplication:** Apply for leave.
- **GET /allLeaveApplication:** Get all leave applications.
- **DELETE /leaveApplication/:id:** Delete a leave application by ID.
- **POST /tasks:** Create a new task.
- **GET /AllTasks:** Get all tasks.
- **DELETE /tasks/:id:** Delete a task by ID.
