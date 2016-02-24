/**
 * Created by Taichi1 on 2/24/16.
 */


(function () {
    let React = require('react');
    let ReactDOM = require('react-dom');
    let injectTapEventPlugin = require('react-tap-event-plugin');


    var Master = require("./master.jsx");
    //Needed for React Developer Tools
    window.React = React;

    //Needed for onTouchTap
    //Can go away when react 1.0 release
    //Check this repo:
    //https://github.com/zilverline/react-tap-event-plugin
    injectTapEventPlugin();

    var main = (
        <Master>

        </Master>
    );

    // Render the main app react component into the app div.
    // For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
    ReactDOM.render(main
        , document.getElementById('app'));

})();
