const express = require('express');
const ArticleService = require('../services/article.services');

const articleController = {
    get: async (req, res) =>{
        const { search } = req.query;

        try{
            const article = await ArticleService.getArticle({search});
            res.status(200).json({success: true, article});
        }catch(e){
            console.log(e.stack)
            res.status(500).json({success: false, message: e.message});
        }
        
    },

    create: async (req, res) =>{
        const { title, content } = req.body;
        try{
            if(!title && !content){
                res.status(400).json({success: false, message: e.message});
            }else{
                const postArticle = await ArticleService.createArticle(req.body);
                res.status(200).json({success: true, postArticle});
            }
        }catch(e){
            res.status(500).json({success: false, message: e.message});
        }
    },

    update: async (req, res) =>{
        const { id } = req.params;
        const { title, content, author, tags } = req.body;

        try{
            const updateArticle = await ArticleService.editArticle({
                id,
                title,
                content,
                author,
                tags
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
        const { id } = req.params;

        try{
            const delArticle = await ArticleService.deleteArticle(id);
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