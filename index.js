const express = require('express');
const app = express();

app.use(express.json());

const blog = require('./routes/routes.articles');
app.use('/', blog);



app.listen(3002,()=> console.log("Server started on port 3002"));