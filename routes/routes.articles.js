const express = require('express');
const router = express.Router();
const articleController = require('../controller/article.controller')


router.get('/articles', articleController.get);

router.post('/post', articleController.create);

router.put('/edit/:id', articleController.update);

router.delete('/delete/:id', articleController.delete);

module.exports = router;