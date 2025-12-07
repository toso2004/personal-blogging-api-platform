const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookie = require('cookie-parser');

function verifyUser(req, res, next){

    const authHeader = req.headers.authorization;

    
    if(!authHeader){
       return res.status(401).json({
            success: false,
            message: "Not authorized. Missing token"
        }); 
    }

    const encoded = authHeader.split(" ")[1];
        
    try{
        const decoded = jwt.verify(encoded, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    }catch(e){
        res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        })
    }   
}

//Assigning refresh token in http-only cookie
function createCookie(req, res, next){

    try{
        const cookie = res.cookie("BlogCookie", refreshToken,
            {
                secure: true,
                httpOnly: true,
                expires: new Date(Date.now() + 900000)
            }
        );
        
        req.user = cookie;
        next();
    }catch{
        res.status(401).json({
            success: false,
            message: "Unathorized"
        })
    }
    
}

function verifyToken(req, res, next){


    try{
        const refreshToken = req.cookie.BlogCookie;
        refreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        req.user = refreshToken;
        next();
    }catch(e){
        res.status(e.statusCode || 500).json({
            succes: false,
            message: e.message
        });
    }
}



module.exports = { verifyUser, createCookie, verifyToken } ;