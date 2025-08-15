import express from 'express';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import { jwtSecretKey, sessionSecretKey } from './config/config.js';
import { authUserRouter } from './router/auth_users.js';
import { generalUserRoute } from './router/general.js';

const app = express();

app.use(express.json());

app.use("/customer",session({secret:sessionSecretKey,resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if (req.session.authorization) {
        const token = req.session.authorization.accessToken;
        jwt.verify(token, jwtSecretKey, (err, user) => {
        if (!err) {
            req.user = user;
            return next();
        }
        return res.status(403).json({ message: "Invalid token" });
        });
    } else {
        return res.status(403).json({ message: "Not logged in" });
    }
});
 
const PORT =5000;

app.use("/customer", authUserRouter);
app.use("/", generalUserRoute);

app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));
