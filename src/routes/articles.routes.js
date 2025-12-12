const express = require('express');
const router = express.Router();
const articleController = require('../controller/article.controller');
const { verifyUser } = require('../middleware/auth.middleware');

router.get('/articles', articleController.get);

router.post('/post/', verifyUser, articleController.create);

router.put('/edit', verifyUser, articleController.update);

router.delete('/delete', verifyUser, articleController.delete);

module.exports = router;