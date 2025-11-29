const express = require('express');
const app = express();

app.use(express.json());

const articlesRoutes = require('./src/routes/routes.articles');
app.use('/', articlesRoutes);

const authRoutes = require('./src/routes/auth.routes');
app.use('/', authRoutes);



app.listen(3002,()=> console.log("Server started on port 3002"));