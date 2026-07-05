# Personal Blogging API Platform

A RESTful backend API for a personal blogging platform built with **Node.js**, **Express.js**, and **PostgreSQL**. The API allows users to register, authenticate, and manage blog articles securely using JSON Web Tokens (JWT).

## 📖 Overview

This project was built to strengthen my backend development skills by implementing a complete REST API with user authentication, database integration, and CRUD operations.

The application follows a layered architecture, separating responsibilities into routes, controllers, services, middleware, and database configuration to improve maintainability and scalability.

---

## ✨ Features

### User Authentication

* User registration
* User login
* User logout
* Password hashing with bcrypt
* JWT access token authentication
* Refresh token support

### Article Management

* Create articles
* Retrieve all articles
* Search articles by title or content
* Update articles
* Delete articles

### Security

* Password hashing
* Protected routes using JWT middleware
* Environment variables for sensitive configuration
* Parameterized SQL queries to reduce SQL injection risks

---

## 🛠 Tech Stack

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL

### Authentication

* JSON Web Token (JWT)
* bcrypt

### Development Tools

* dotenv
* cookie-parser

---

## 📂 Project Structure

```text
personal-blogging-api-platform/
│
├── src/
│   ├── controller/
│   ├── services/
│   ├── middleware/
│   ├── routes/
│   └── database/
│
├── app.js
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/toso2004/personal-blogging-api-platform.git
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file in the project root.

Example:

```env
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
```

### Start the server

```bash
npm start
```

The server will run on:

```
http://localhost:3002
```

---

## 📌 API Endpoints

### Authentication

| Method | Endpoint    | Description          |
| ------ | ----------- | -------------------- |
| POST   | `/register` | Register a new user  |
| POST   | `/login`    | Authenticate a user  |
| POST   | `/refresh`  | Refresh access token |
| POST   | `/logout`   | Log out a user       |

### Articles

| Method | Endpoint    | Description           |
| ------ | ----------- | --------------------- |
| GET    | `/articles` | Retrieve all articles |
| POST   | `/post`     | Create an article     |
| PUT    | `/edit`     | Update an article     |
| DELETE | `/delete`   | Delete an article     |

---

## 🎯 What I Learned

This project helped me gain practical experience with:

* Building REST APIs using Express.js
* PostgreSQL database integration
* Writing SQL queries
* Implementing JWT authentication
* Password hashing using bcrypt
* Structuring backend applications using controllers, services, middleware, and routes
* Environment variable management
* Handling asynchronous operations with async/await

---

## 🚧 Future Improvements

* Refresh token rotation improvements
* Pagination for article listings
* Article categories and tags filtering
* Comments and likes
* User profiles
* API documentation using Swagger/OpenAPI
* Automated testing
* Docker support
* Role-based authorization
* Input validation middleware

---

## 👨‍💻 Author

**Thuso**

GitHub: https://github.com/toso2004

---

## 📄 License

This project is intended for learning and portfolio purposes.
