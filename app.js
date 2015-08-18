(function () {
    /**
     * Startup Hall App
     */

    var firebaseRef = new Firebase("https://startuphall.firebaseio.com");
    App.registerGlobal('firebaseRef', firebaseRef);


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

    /**
     * Get memberNames
     */
    App.firebaseRef.child("memberNames").on("value", function(snapshot) {
        var memberNames = snapshot.val();
        var _array = [];

        // Normalize object
        for (var property in memberNames) {
            console.log(memberNames[property].name, memberNames[property].memberID);
            _array.push({
                name: memberNames[property].name,
                memberID: memberNames[property].memberID
            })
        }

        App.set('memberNames', _array);
    });


    $('#register_form').submit(function (e) {
        e.preventDefault();
        App.createAccount({
            name:      $('#register_form [name=name]').val(),
            email:     $('#register_form [name=email]').val(),
            password:  $('#register_form [name=password]').val(),
            password2: $('#register_form [name=password2]').val()
        }, function (userData) {
            console.log('registered, I think!');
            Messenger().post("Your account was created successfully.");

            // authData.uid
            // authData.password.email

            console.log(userData);
            var newPostRef = App.firebaseRef.child('members').push({
                name: userData.data.name,
                email: userData.data.email
            });

            var postID = newPostRef.key();

            var newPostRef = App.firebaseRef.child('memberNames').push({
                name: userData.data.name,
                memberID: postID
            });

            App.transitionTo('member-index');



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


    /**
     * Route to a location based on hash
     */
    function transitionOnHashchange () {
        if (window.location.hash === "#receptionist") {
            App.transitionTo('receptionist');
        }
        if (window.location.hash === "#register") {
            App.transitionTo('register');
        }
    }


    /**
     * Receptionist View
     */

    // Receptionist needs an object full of names
    // [{ "<name>": "<user-id>" }]



    function filteredEmployees(string) {
        var filtered = [];
        var employees = App.get('memberNames');

        $.each(employees, function() {
            if (this.name.toLowerCase().indexOf(string.toLowerCase()) > -1) {
                filtered.push(this);
            }
        });

        return filtered;
    }

    function findEmployee(name) {
        if (name.length) {
            var matches = filteredEmployees(name);
            renderMatchedEmployees(matches);
        }
    }

    function renderMatchedEmployees(matches) {
        console.log(matches);
        var result = '';
        $.each(matches, function() {
            result += '<p data-memberID="' + this.memberID + '">' + this.name + '</p>';
        });
        $('#receptionist .matches').html(result);
        $('#receptionist .matches p').off('click').bind('click', function() {
            var match = $(this).html();
            memberID = $(this).attr('data-memberID');
            matchName = match;
            $('#autocomplete').val('<' + match + '>');
            $('#receptionist .matches').html('');
            //checkMeetingIsSubmitable();

            console.log("Post this data: " + memberID);

        });
    }

    $('#autocomplete').on('input', function () {
        var str = $('#autocomplete').val();
        // console.log(str);
        findEmployee(str);
    });

    $('#send_message [name=visitorName]').on('input', function () {
        var str = $('#send_message [name=visitorName]').val();

        $('#send_message [name=message]').val(str + " is waiting for you in the lobby.");

    });



    /**
     * Try to authenticate, redirect to the member-index if successful
     */
    App.auth(null, function (authData) {

        // Initially dump users on the member index
        if (!window.location.hash) App.transitionTo('member-index');
    });


    /**
     * Handle hashchange events & initially route to a specific route on if a hash is applied
     */
    window.onhashchange = transitionOnHashchange;
    transitionOnHashchange();




})();