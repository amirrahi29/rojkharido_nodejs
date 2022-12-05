const config = require('../config/config');
const jwt = require('jsonwebtoken');

const verifyToken = async (req,res,next)=>{

    const token = req.body.token || req.query.token || req.headers["authorization"];
    if(!token){
        res.status(200).send({success:false,msg:"Authorization token is required!"});
    }
    else{
        try {
            const decode = await jwt.verify(token,config.SECURE_JWT_TOKEN);
            req.user = decode;

        } catch (error) {
                    res.status(400).send({success:false,msg:error.message});
        }

        return next();
    }

}

module.exports = verifyToken;