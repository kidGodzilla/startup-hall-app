/**
 * Registration / Auth for Demo App
 */

(function () {

    App.registerGlobal('auth', function (data, callback) {

        var authData = App.firebaseRef.getAuth();

        if (authData) {
            console.log("Authenticated user with uid:", authData.uid);
            var userID = authData.uid;
            App.set('userID', authData.uid);
            App.set('userEmail', authData.password.email);
            if (callback && typeof(callback) === "function") callback(authData);
        } else {
            if (!data) {
                App.transitionTo('login');
            } else {
                App.firebaseRef.authWithPassword({ "email": data.email, "password": data.password
                }, function (error, authData) {
                    if (error) {
                        // Todo: Try login again
                        Messenger().post({
                            message: "Login Failed! " + error + ' <a href="#" onclick="App.resetPassword()">Reset Password</a>?',
                            type: 'error',
                            showCloseButton: true
                        });
                    } else {
                        console.log("Authenticated user with uid:", authData.uid);
                        //Messenger().post("Login Successful.");
                        var userID = authData.uid;
                        App.set('userID', authData.uid);
                        App.set('userEmail', authData.password.email);
                        if (callback && typeof(callback) === "function") callback(authData);
                    }
                });
            }
        }
    });

    App.registerGlobal('createAccount', function (data, callback) {

        var name      = data.name;
        var email     = data.email;
        var password  = data.password;
        var password2 = data.password2;


        if (password === password2) {
            App.firebaseRef.createUser({
                email: email,
                password: password
            }, function(error, userData) {
                if (error) {
                    switch (error.code) {
                        case "EMAIL_TAKEN":
                            console.log("The new user account cannot be created because the email is already in use.");
                            Messenger().post({
                                message: "The new user account cannot be created because the email is already in use.",
                                type: 'error',
                                showCloseButton: true
                            });
                            break;
                        case "INVALID_EMAIL":
                            console.log("The specified email is not a valid email.");
                            Messenger().post({
                                message: "The specified email is not a valid email.",
                                type: 'error',
                                showCloseButton: true
                            });
                            break;
                        default:
                            console.log("Error creating user:", error);
                            Messenger().post("Error creating user:", error);
                    }
                } else {
                    console.log("Successfully created user account with uid:", userData.uid);
                    userData.data = {};
                    userData.data.name = name;
                    userData.data.email = email;

                    if (callback && typeof(callback) === "function") callback(userData);
                }
            });
        } else {
            Messenger().post({
                message: "Error creating user: Password Mismatch",
                type: 'error',
                showCloseButton: true
            });
        }
    });

    App.registerGlobal('resetPassword', function () {

        vex.dialog.open({
            message: 'To reset your password, please enter your email address:',
            input: "<input name=\"email\" type=\"text\" placeholder=\"Email\" required />",
            buttons: [
                $.extend({}, vex.dialog.buttons.YES, {
                    text: 'Reset Password'
                }), $.extend({}, vex.dialog.buttons.NO, {
                    text: 'Back'
                })
            ],
            callback: function (data) {
                if (data === false) {
                    return true; // Cancelled
                }

                App.firebaseRef.resetPassword({
                    email: data.email
                }, function (error) {
                    if (error) {
                        switch (error.code) {
                            case "INVALID_USER":
                                Messenger().post({
                                    message: "The specified user account does not exist.",
                                    type: 'error',
                                    showCloseButton: true
                                });
                                break;
                            default:
                                Messenger().post({
                                    message: "Error resetting password: " + error,
                                    type: 'error',
                                    showCloseButton: true
                                });
                        }
                    } else {
                        Messenger().post("Your password has been reset. You should receive an email at the address provided.");
                    }
                });
            }
        });
    });

    App.registerGlobal('logout', function () {
        App.firebaseRef.unauth();
        App.transitionTo('login');
    });
})();

