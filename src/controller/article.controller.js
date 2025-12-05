const express = require('express');
const ArticleService = require('../services/article.services');

const articleController = {
    get: async (req, res) =>{
        const { search } = req.query;

        try{
            const article = await ArticleService.getArticle({search});
            if(article.length === 0){
                res.status(404).json({success: false, message: "Article not found"});
            }else{
                res.status(200).json({success: true, article});
            }
            
        }catch(e){
            console.log(e.stack)
            res.status(500).json({success: false, message: e.message});
        }
        
    },

    create: async (req, res) =>{
        const { title, content, author, tags} = req.body;
        const user_id = req.user.user_id;

        try{
            if(!title || !content){
                res.status(400).json({success: false, message: "To create an article you need both the title and content of the article"});
            }else{
                const postArticle = await ArticleService.createArticle({
                    title,
                    content,
                    author,
                    tags,
                    user_id
                });
                res.status(200).json({success: true, postArticle});
            }   
        }catch(e){
            res.status(500).json({success: false, message: "Something went wrong.Please try again later"});

            console.log(e)
        }
    },

    update: async (req, res) =>{
        const { title, content, author, tags } = req.body;
        const { user_id } = req.user;

        try{
            const updateArticle = await ArticleService.editArticle({
                title,
                content,
                author,
                tags,
                user_id
            });

            res.status(200).json({
                success: true,
                updateArticle
            });
        }catch(e){
            res.status(e.statusCode || 500).json({
                success: false,
                message: e.message
            })
        }
    },

    delete: async (req, res) =>{
    
        const { user_id } = req.user;

        try{
            const delArticle = await ArticleService.deleteArticle({user_id});
            res.status(200).json({
                success: true,
                delArticle
            });
        }catch(e){
            res.status(e.statusCode || 500).json({
                success: false,
                message: e.message
            })
        }
    }
}   

module.exports = articleController;