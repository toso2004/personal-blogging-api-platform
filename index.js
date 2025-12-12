const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

const articlesRoutes = require('./src/routes/articles.routes');
app.use('/', articlesRoutes);

const authRoutes = require('./src/routes/auth.routes');
app.use('/', authRoutes);



app.listen(3002,()=> console.log("Server started on port 3002"));