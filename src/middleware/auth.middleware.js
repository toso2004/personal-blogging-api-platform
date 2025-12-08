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

module.exports = { verifyUser} ;