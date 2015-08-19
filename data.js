(function () {
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
})();