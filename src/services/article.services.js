const db = require('../database/db');

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

    createArticle: async ({title, content, author, tags}) =>{
        const results = await db.query(
                `INSERT INTO articles(title, content, author, tags) 
                VALUES($1, $2, $3, $4) RETURNING *`, 
                [title, content, author, tags]);
        
        return results.rows[0];
    },

    editArticle: async ({id, title, content, author, tags}) =>{

        const checkArticle = await db.query("SELECT * FROM articles WHERE id = $1", [id]);
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
            WHERE id = $5
            RETURNING *`,
            [title, content, author, tags, id]);
        
        return results.rows[0];
    },

    deleteArticle: async ({id}) =>{
        
        const checkArticle = await db.query("SELECT * FROM articles WHERE id = $1", [id]);
            if(checkArticle.rows.length === 0){
                const error = new Error('Article not found');
                error.statusCode = 404;
                throw error;
            }

        const results = await db.query("DELETE FROM articles WHERE id = $1", [id]);
    }
}

module.exports = articleService;