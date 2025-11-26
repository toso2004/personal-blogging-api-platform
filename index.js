const express = require('express');
const app = express();

app.use(express.json());

const articlesRoutes = require('./routes/routes.articles');
app.use('/', articlesRoutes);



app.listen(3002,()=> console.log("Server started on port 3002"));