const express = require('express');
const router = express.Router();
const articleController = require('../controller/article.controller');
const user = require('../middleware/auth.middleware');

router.get('/articles', articleController.get);

router.post('/post/', user.verifyUser, articleController.create);

router.put('/edit', user.verifyUser, articleController.update);

router.delete('/delete', user.verifyUser, articleController.delete);

module.exports = router;