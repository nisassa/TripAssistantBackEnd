const User = require("../models/user")
const jwt = require("jsonwebtoken")

exports.verifyToken = (req, res, next) => {
    res.status(200).json({
        message : 'success',
        status: 'OK'
    })
}

exports.logIn = (req, res, next) => {

    const user  = new User({
        email: req.body.email,
        password: req.body.password
    })

    User.find({ email: req.body.email, isDeleted: false})
    .exec()
    .then( (users) => {
        if (users.length > 0) {
            if (user.validPassword(user.password, users[0].password) === true) {

                const token = jwt.sign(
                    { userId: users[0]._id }, 
                    process.env.jwt_private_key, 
                    { expiresIn: "700 days" }
                );

                res.status(200).json({
                    "status": "OK",
                    "message": "Success.",
                    "token": token,
                    "userId": users[0]._id
                });
                
            } else {

                res.status(301).json({
                    "status": "NOK",
                    "message": "Login failed - username or password is incorrect."
                });

            }
        } else {

            res.status(301).json({
                "status" : "NOK",
                "message": "Unable to find your account. Please register a new account.",
            });

        }
    }).catch( err => {

        res.status(500).json({ 
            "error": err,
            "status" : "NOK",
        });

    });   
}


exports.register = (req, res, next) => {

    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
    });

    user.password = user.generateHash(req.body.password);
    
    User.find({ email: user.email, isDeleted: false})
    
    .exec()
    .then( (doc) => {
        if (doc.length > 0) {

            res.status(301).json({
                "status": "NOK",
                "message": "This email address is already in use, please log in to your account or try againg with a different email address.",
            });

        } else {
            
            user.save().then().catch(err => console.log(err));
            const token = jwt.sign(
                { userId: user._id }, 
                process.env.jwt_private_key, 
                { expiresIn: "700 days" }
            );

            res.status(200).json({
                "status": "OK",
                "message" : 'New user created',
                "user": user,
                "userId": user._id,
                "token" : token
            });
        }
    })

    .catch( err => {
        res.status(300).json({ error: err});
    });
}