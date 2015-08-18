(function () {
    /**
     * Startup Hall App
     */

    var firebaseRef = new Firebase("https://startuphall.firebaseio.com");
    App.registerGlobal('firebaseRef', firebaseRef);

    //App.auth();


    /**
     * Get all ORGs & store them in orgs
     */
    App.firebaseRef.child("organizations").on("value", function(snapshot) {
        var orgs = snapshot.val();
        App.set('organizations', orgs);
    });

    /**
     * Get all ORGs & store them in orgs
     */
    App.firebaseRef.child("organizations").on("value", function(snapshot) {
        var orgs = snapshot.val();
        App.set('organizations', orgs);
    });


    var page = "register";

    if (page === "register") {

    }

    $('#register_form').submit(function (e) {
        e.preventDefault();
        App.createAccount({
            name:      $('#register_form [name=name]').val(),
            email:     $('#register_form [name=email]').val(),
            password:  $('#register_form [name=password]').val(),
            password2: $('#register_form [name=password2]').val()
        }, function (authData) {
            console.log('registered, I think!');
            Messenger().post("Your account was created successfully.");

            // authData.uid
            // authData.password.email


        });
    });
    $('#login_form').submit(function (e) {
        e.preventDefault();
        App.auth({
            email:     $('#login_form [name=email]').val(),
            password:  $('#login_form [name=password]').val(),
        }, function () {
            console.log('authed, I think!');
            Messenger().post("Logged in successfully.");
        });
    });






})();