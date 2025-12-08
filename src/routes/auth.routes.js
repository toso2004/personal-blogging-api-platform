const express = require('express');
const router = express.Router();
const {registerController, loginController} = require('../controller/auth.controller');
const jwt = require('jsonwebtoken');


router.post('/register', registerController);
router.post('/login', loginController);

router.post('/refresh', (req, res) =>{
    try{
        const refreshToken = req.cookies.BlogCookie;

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err){
                res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                })
            }else{
                const accessToken = jwt.sign(
                    {
                        user_id: getUser.rows[0].user_id, 
                        email: getUser.rows[0].email
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn: "10m"}
                );
                
                res.status(200).json({
                    success: true,
                    data: accessToken
                })
            }
        })
    }catch{
        res.status(500).json({
            success: false,
            message: "Something went wrong.Please try again later"
        })
    }
})

module.exports = router;