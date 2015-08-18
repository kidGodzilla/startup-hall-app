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
        }, function (authData) {
            console.log('authed, I think!', authData);
            Messenger().post("Logged in successfully.");
            App.transitionTo('member-index');

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
        var result = '';
        $.each(matches, function() {
            result += '<p class="cursor-pointer" data-memberID="' + this.memberID + '">' + this.name + '</p>';
        });
        $('#receptionist .matches').html(result);
        $('#receptionist .matches p').off('click').bind('click', function() {
            var match = $(this).html();
            var memberID = $(this).attr('data-memberID');
            App.set('memberId', memberID);

            var matchName = match;
            $('#autocomplete').val('<' + match + '>');
            $('#receptionist .matches').html('');
            //checkMeetingIsSubmitable();

            console.log("Post this data: " + memberID);
        });
    }

    $('#autocomplete').on('input', function () {
        var str = $('#autocomplete').val();
        findEmployee(str);
    });

    $('#send_message [name=visitorName]').on('input', function () {
        var str = $('#send_message [name=visitorName]').val();
        $('#send_message [name=message]').val(str + " is waiting for you in the lobby.");
    });

    $('#send_message').submit(function () {

    })
    $('#send_message').submit(function (e) {
        e.preventDefault();

        // Do stuff
        var memberId = App.get('memberId');
        var guestName = $('#send_message [name=visitorName]').val();
        var message = $('#send_message [name=message]').val();

        console.log(memberId, guestName, message);

        $.post('http://res.qq.my/notify', {memberId: memberId, guestName: guestName, message: message});
        //$.post('http://yeti.metabootstrap.com/sendAnEmail', {memberId: memberId, guestName: guestName, message: message});

        Messenger().post("Your message was sent!");

        // Reset Form
        $('#send_message #autocomplete').val('');
        $('#send_message [name=visitorName]').val('');
        $('#send_message [name=message]').val('');

        // Goto index
        App.transitionTo('member-index');
    });



    /**
     * Try to authenticate, redirect to the member-index if successful
     */
    App.auth(null, function (authData) {

        // Initially dump users on the member index
        if (!window.location.hash) App.transitionTo('member-index');

        console.log(authData.uid);

        var uid = authData.uid.replace(/[a-zA-Z0-9]]/g,'');

        // Show more options if this is a receptionist
        App.firebaseRef.child("memberRoles/"+uid).on("value", function(snapshot) {
            var data = snapshot.val();

            if (data && data === "receptionist") {
                $('#contact_member_link').show();
            }
        });

    });


    /**
     * Handle hashchange events & initially route to a specific route on if a hash is applied
     */
    window.onhashchange = transitionOnHashchange;
    transitionOnHashchange();


})();