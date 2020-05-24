const User = require('../../models/User/User');
const UserSession = require('../../models/User/UserSession');

module.exports = (app) => {

    app.post('/api/user/signup', function (req, res, next) {
        const { body } = req;
        let {
            firstName,
            surname,
            email,
            password
        } = body;

        if (!firstName) {
            return res.send({
                success: false,
                message: 'Error: First name cannot be blank.'
            });
        }
        if (!surname) {
            return res.send({
                success: false,
                message: 'Error: Surname cannot be blank.'
            });
        }
        if (!email) {
            return res.send({
                success: false,
                message: 'Error: Email cannot be blank.'
            });
        }
        if (!password) {
            return res.send({
                success: false,
                message: 'Error: Password cannot be blank.'
            });
        }

        email = email.toLowerCase();

        User.find({
            email: email
        }, (error, prevUser) => {
            if (error) {
                return res.send({
                    success: false,
                    message: 'Error: Server error.'
                });
            } else if (prevUser.length > 0) {
                return res.send({
                    success: false,
                    message: 'Error: An account was already created with this email address.'
                });
            } else {
                // save user
                const newUser = new User();
                newUser.firstName = firstName;
                newUser.surname = surname;
                newUser.email = email;
                newUser.password = newUser.generateHash(password);

                newUser.save((err, user) => {
                    if (err) {
                        return res.send({
                            success: false,
                            message: 'Error: Server error.'
                        });
                    }
                    return res.send({
                        success: true,
                        message: 'New user created.'
                    })
                });
            }
        });
    });

    app.post('/api/user/signin', function (req, res, next) {
        const { body } = req;
        let {
            email,
            password
        } = body;

        email = email.toLowerCase();
        if (!email) {
            return res.send({
                success: false,
                message: 'Error: Email cannot be blank.'
            });
        }
        if (!password) {
            return res.send({
                success: false,
                message: 'Error: Password cannot be blank.'
            });
        }

        User.find({
            email:email
        }, (error, users) => {
            if (error) {
                return res.send({
                    success: false,
                    message: 'Error: server error.'
                });
            }
            if (users.length != 1) {
                return res.send({
                    success: false,
                    message: 'Error: invalid.'
                });
            }
            let user = users[0];
            if (!user.validPassword(password, user.password)) {
                return res.send({
                    success: false,
                    message: 'Error: the username and password do not match.'
                });
            }
            // Otherwise create the user session
            let Session = new UserSession();
            Session.userId = user._id;
            Session.save((error, doc) => {
                if (error) {
                    return res.send({
                        success: false,
                        message: 'Error: server error.'
                    });
                }

                return res.send({
                    success: true,
                    message: "valid log in",
                    token: doc.id
                });
            });
        });
    });

    app.get('/api/user/verify', function (req, res, next) {
        const { query } = req;
        const { token } = query;

        // Verify user token
        UserSession.find({
            _id:token,
            isDeleted:false
        }, (err, sessions) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error.'
                });
            }
            if (sessions.length != 1) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid.'
                });
            }

            return res.send({
                success: true,
                message: 'Success.'
            });
        });
    });

    app.get('/api/user/logout', function (req, res, next) {
        const { query } = req;
        const { token } = query;

        // Verify user token
        UserSession.findOneAndUpdate({
            _id:token,
            isDeleted:false
        }, {
            $set: {
                isDeleted: true
            }
        }, null, (err, sessions) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error.'
                });
            }

            return res.send({
                success: true,
                message: 'Success.'
            });
        });
    });
}
