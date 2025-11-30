const express = require('express');
const jwt = require('jsonwebtoken');

 function verifyUser(req, res, next){

    const authHeader = req.headers.authorization;

    
    if(!authHeader){
       res.status(401).json({
            success: false,
            message: "Not authorized. Missing token"
        }); 
    }

    const token = authHeader.split(" ")[1];
        
    try{
        const decoded = jwt.verify(token, "tupperware");
        req.user = decoded;
        next();
    }catch(e){
        res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        })
    }   
}

module.exports = { verifyUser } ;