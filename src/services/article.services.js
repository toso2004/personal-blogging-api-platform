const db = require('../database/db');
const express = require('express');


const articleService = {
    getArticle: async ({search}) =>{
        let results;

        if(search){
            results = await db.query(
                `SELECT * FROM articles 
                WHERE title ILIKE $1 or 
                content ILIKE $1
                ORDER BY created_at DESC`, 
                [`%${search}%`]);
        }else{
            results = await db.query("SELECT * FROM articles ORDER BY created_at DESC");
        }
        return results.rows; // returns an array of all matching records from the dbS 
    },

    createArticle: async ({title, content, author, tags, user_id}) =>{

        const results = await db.query(`
            INSERT INTO articles(title, content, author, tags, user_id)
            VALUES($1, $2, $3, $4, $5) RETURNING *`, 
            [title, content, author, tags, user_id]);


        return results.rows[0];
    },

    editArticle: async ({title, content, author, tags, user_id}) =>{

        const checkArticle = await db.query("SELECT * FROM articles WHERE user_id = $1", [user_id]);
        if(checkArticle.rows.length === 0){
            const error = new Error('Article not found');
            error.statusCode = 404;
            throw error;
        }

        const results = await db.query(
            `UPDATE articles 
            SET  title = COALESCE ($1, title),
                content = COALESCE ($2, content),
                author = COALESCE ($3, author),
                tags = COALESCE ($4,tags),
                updated_at = NOW()
            WHERE user_id = $5
            RETURNING *`,
            [title, content, author, tags, user_id]);
        
        return results.rows[0];
    },

    deleteArticle: async ({user_id}) =>{
        
        const checkArticle = await db.query("SELECT * FROM articles WHERE user_id = $1", [user_id]);
            if(checkArticle.rows.length === 0){
                const error = new Error('Article not found');
                error.statusCode = 404;
                throw error;
            }

        const results = await db.query("DELETE FROM articles WHERE user_id = $1", [user_id]);
    }
}

module.exports = articleService;