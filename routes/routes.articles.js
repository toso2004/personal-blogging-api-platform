const express = require('express');
const router = express.Router();
const db = require('../database/db');

//later make it so that the routes file only handles routes instead of the logic

router.get('/', async (req, res) =>{
    const {search} = req.body;

    let results;

    try{
        if(search){
            results = await db.query(
                `SELECT * FROM articles 
                WHERE title ILIKE $1 or 
                content ILIKE $1"
                ORDER BY created_at DESC`, 
                `%${[search]}%`);  
        }else{
            results = await db.query("SELECT * FROM articles ORDER BY created_at DESC");
        }

        res.status(200).json({success: true, data: results.rows});

    }catch(error){
        console.log(error.stack);

        res.status(404).json({success: false, message: "Article was not found"});
    }
});

router.post('/articles', async (req, res) =>{
    const {title, content, author, tags} = req.body;

    let results;

    try{
       if(!title && !content){
            res.status(400).json({success: false, message: "Article must have a title and content"});
        }else{
            results = await db.query(
                `INSERT INTO articles(title, content, author, tags) 
                VALUES($1, $2, $3, $4) RETURNING *`, 
                [title, content, author, tags]);
        }

        res.status(200).json({success: true, data: results.rows[0]}); 

    }catch(error){
        console.log(error.stack);

        res.status(500).json({success: false, message: "There was a problem saving your article. Please try again later."});
    }
});

router.put('/edit/:id', async (req, res)=>{
    const { id } = req.params;
    const {title, content, author, tags} = req.body;
    let results;

    try{
        const checkArticle = await db.query("SELECT * FROM articles WHERE id = $1", [id]);
        if(checkArticle.rows.length === 0){
            return res.status(404).json({
                success: false,
                message: "Article not found"
            });
        }else{
            results = await db.query(
                `UPDATE articles 
                SET  title = COALESCE ($1, title),
                    content = COALESCE ($2, content),
                    author = COALESCE ($3, author),
                    tags = COALESCE ($4,tags),
                    updated_at = COALESCE (NOW())
                WHERE id = $5
                RETURNING *`,
            [title, content, author, tags, id]);
        }
        res.status(200).json({success: true, data: results.rows[0]});

    }catch(error){
        console.log(error.stack);

        res.status(500).json({success: false, message: "Sorry could not update the article. Please try again later"});
    }
});

router.delete('/delete/:id', async (req, res) =>{
    const { id } = req.params;
    let results;

    try{
        const checkArticle = await db.query("SELECT * FROM articles WHERE id = $1", [id]);
        if(checkArticle.rows.length === 0){
            return res.status(404).json({
                success: false,
                message: "Article not found"
            });
        }else{
            results = await db.query("DELETE FROM articles WHERE id = $1", [id]);
        }

        res.status(200).json({success: true, message: "Article deleted successfully"});

    }catch(error){
        console.log(error.stack);

        res.status(500).json({success: false, message: "Something went wrong. Please try again later."});
    }
});

module.exports = router;