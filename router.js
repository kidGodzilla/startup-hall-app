(function () {
    var previousPage, currentPage, debounce, transitioning;
    currentPage = "register";

    App.registerGlobal('transitionTo', function (route) {
            if (route !== currentPage && !debounce) {
                transitioning = 1;
                debounce = 1;
                App.unload(currentPage);
                App.load(route);
                previousPage = currentPage;
                currentPage = route;
                setTimeout(function() {
                    debounce = 0;
                    transitioning = 0;
                }, 500);
                //App.resetCountdown();
            }
        }
    );


// ################################################################################
// LOAD A ROUTE
// ################################################################################

    App.registerGlobal('load', function (route) {
        switch (route) {
            // Load Register form
            case "register":
                // Do stuff
                $("#auth, #register").show();
                break;
            // Load Login form
            case "login":
                // Do stuff
                $("#auth, #login").show();
                break;
            // Load password reset form
            case "reset-password":
                // Do stuff
                $("#auth, #reset_password").show();
                break;
            // Load member page
            case "member-index":
                // Do stuff
                $("#main, #member, #member_index").show();
                break;
            // Load receptionist page
            case "receptionist":
                // Do stuff
                $("#main, #receptionist").show();
                break;

        }
    });



// ################################################################################
// UNLOAD A ROUTE
// ################################################################################

    App.registerGlobal('unload', function (route) {
        switch (route) {
            // Unload register
            case "register":
                // Do stuff
                $("#auth, #register").hide();
                break;
            // Unload login
            case "login":
                // Do stuff
                $("#auth, #login").hide();
                break;
            // Unload password reset
            case "reset-password":
                // Do stuff
                $("#auth, #reset_password").hide();
                break;
            // Unload member page
            case "member-index":
                // Do stuff
                $("#main, #member, #member_index").hide();
                break;
            // Unload member page
            case "receptionist":
                // Do stuff
                $("#main, #receptionist").hide();
                break;

        }
    });



    /**
     * Go Back
     */

    App.registerGlobal('goBack', function () {
        transitionTo(previousPage);
    });
})();