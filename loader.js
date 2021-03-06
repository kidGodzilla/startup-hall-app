/**
 * LOAD-DEPENDENCIES.JS
 * A A naive dependency loader which loads scripts & stylesheets on page load.
 */
(function () {

    /**
     * Sets the protocol for loading scripts, when the option is available (useful for local development)
     * Options: "http://", "https://", "file://", and "//"
     */
    var protocol = window.location.protocol === "https:" ? "https://" : "http://";


    /**
     * Unique name for this instance of the script loader
     *
     * Prevents the loader from being called twice.
     * Change this if you use multiple instances of the script loader in your website,
     * or you want to distribute your package using this loader as an entry-point.
     */
    var loaderName = "asyncLoaderComplete";


    /**
     * Async script loader
     */
    function loadScriptAsync (resource) {
        var sNew = document.createElement("script");
        sNew.async = true;
        sNew.src = resource;
        var s0 = document.getElementsByTagName('script')[0];
        s0.parentNode.insertBefore(sNew, s0);
    }

    /**
     * Naive, synchronous script loader
     */
    function loadScript (resource) {
        document.write('<script src="' + resource + '"></script>');
    }

    /**
     * Stylesheet loader
     */
    function loadStylesheet (resource) {
        var head  = document.getElementsByTagName('head')[0];
        var link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = resource;
        link.media = 'all';
        head.appendChild(link);
    }

    /**
     * User-extendable dependency loader
     * To use, uncomment commonly-used libraries or add new scripts and stylesheets
     */
    if (!window[loaderName]) {

        /**************************************************************
         * COMMON JAVASCRIPT LIBRARIES
         * ************************************************************
         */

        /**
         * jQuery (v2.1.3)
         */
        if (!window.$) loadScript(protocol+ "cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js");

        /**
         * Firebase (v2.2.1)
         * A document database in the cloud
         */
        loadScript(protocol + "cdn.firebase.com/js/client/2.2.1/firebase.js");


        /**
         * Hubspot Messenger
         * A lightweight, beautiful notification library
         */
        loadStylesheet(protocol + "cdnjs.cloudflare.com/ajax/libs/messenger/1.4.0/css/messenger.css");
        loadStylesheet("css/messenger-theme-air.css");
        loadScript(protocol + "cdnjs.cloudflare.com/ajax/libs/messenger/1.4.0/js/messenger.min.js");
        document.write("<script>Messenger.options = { extraClasses: 'messenger-fixed messenger-on-top messenger-on-right', theme: 'air'};</script>");


        /**
         * Hubspot Vex
         * A lightweight, beautiful message window library, vex is a drop-in replacement for alert, confirm, and more.
         */
        loadStylesheet("css/vex.css");
        loadStylesheet("css/vex-theme-default.css");
        loadScript("js/vex.combined.min.js");
        document.write("<script>vex.defaultOptions.className = 'vex-theme-default';</script>");



        /**************************************************************
         * COMMON CSS LIBRARIES
         * ************************************************************
         */

        /**
         * Font-Awesome
         * A very useful icon pack
         */
        loadStylesheet(protocol + "cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css");



        /**************************************************************
         * BOOTSTRAP AND BOOTSWATCH THEMES
         * ************************************************************
         */



        /**
         * Bootstrap
         *
         * See: https://bootswatch.com/sandstone/
         */
        loadStylesheet("css/bootstrap.min.css");
        loadScript(protocol + "cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.4/js/bootstrap.min.js");

        loadStylesheet("css/meta-bootstrap.css");
        loadStylesheet("css/style.css");
        loadStylesheet("css/metabootstrap-admin.css");


        /**
         *
         */

        /**
         * Load Router
         */
        loadScript('core.js');


        // Once completed, set an identifier to true to avoid running the script loader twice
        window[loaderName] = true;
    }

})();
