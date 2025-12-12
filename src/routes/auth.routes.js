const express = require('express');
const router = express.Router();
const {registerController, loginController, logoutController} = require('../controller/auth.controller');
const jwt = require('jsonwebtoken');
const { verifyUser } = require('../middleware/auth.middleware');



router.post('/register', registerController);
router.post('/login', loginController);

router.post('/refresh', async (req, res) =>{
    try{
        const token = refresh.rows[0].token
        const checkToken = await db.query("SELECT * FROM auth_token WHERE token = $1", [token]);

        if(checkToken.rows.length === 1 && checkToken.rows[0].isActive === true){
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const accessToken = jwt.sign(
                {
                    user_id: getUser.rows[0].user_id, 
                    email: getUser.rows[0].email
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: "5m"}
            );

            //Rotate refresh token
            newRefreshToken = jwt.sign(
                {
                    email: getUser.rows[0].email
                },
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn: "30d"}
            );

            //Overwrite cookie with the new refresh token
            res.cookie("BlogCookie", newRefreshToken,
                {
                    secure: true,
                    httpOnly: true,
                    expires: new Date(Date.now() + 900000)
                }
            );

            //Update auth_token table with the new refresh token
            const results = await db.query(
                `UPDATE auth_token
                SET token = $1,
                    isActive = true,
                    updated_at = NOW()
                    RETURNING *
                    WHERE user_id = $2`,
                [newRefreshToken, token.rows[0].user_id]);
            
            return results.rows[0];

        }else{
            res.status(401).json({
                success: false,
                message: "User is not logged in"
            })
        }
    }catch{
        res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later"
        })
    }
})

router.post("/logout", verifyUser, logoutController);

module.exports = router;