// ==UserScript==
// @name       Google search result URL filter
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  This script replace the url of google search result to the real url
// @match      https://www.google.com.hk/search*
// @copyright  2012+, You
// ==/UserScript==


[].forEach.call(
    // Get containers of the links
    document.getElementsByClassName('r'), function(e){
        // Get link element
        var link = e.firstChild;
        var url = link.href;
        link.addEventListener('click', function(e){
            link.href = url;
        });
});
