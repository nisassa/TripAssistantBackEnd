const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.post("/register", (req, res, next) => {

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
            res.status(200).json({
                "status": "OK",
                "message" : 'New user created',
                "user": user
            });
        }
    })
    .catch( err => {
        res.status(300).json({ error: err});
    });
});

router.post("/login", (req, res, next) => {
    const user  = new User({
        email: req.body.email,
        password: req.body.password
    })
    User.find({ email: req.body.email, isDeleted: false})
    .exec()
    .then( (doc) => {
        if (doc.length > 0) {
            if (user.validPassword(user.password, doc[0].password) === true) {
                res.status(200).json({
                    "status": "OK",
                    "message": "Success.",
                    "token": doc[0]._id,
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
});

// router.post("/fetch/:productID", (req, res, next) => {
//     const MyId = req.params.productID;
//     res.status(200).json({
//         message : 'success',
//         id: MyId
//     })
// });

module.exports = router;