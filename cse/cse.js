// ==UserScript==
// @name         My Custom Search Engine
// @namespace    http://martin-liu.github.io/
// @updateURL  https://raw.githubusercontent.com/martin-liu/mUserScripts/master/cse/cse.js
// @version      0.1
// @description  Make google CSE display on page top
// @author       Martin Liu
// @match        http*://*/*
// @grant        none
// ==/UserScript==

var gcse = document.createElement("gcse:search");
document.body.insertBefore(gcse, document.body.children[0]);

(function() {
    var cx = '003827910988537502737:gw_ijpe0u38';
    var gcse = document.createElement('script');
    gcse.type = 'text/javascript';
    gcse.async = true;
    gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
        '//www.google.com/cse/cse.js?cx=' + cx;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(gcse, s);
})();
