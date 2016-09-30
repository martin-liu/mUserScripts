// ==UserScript==
// @name       Daisy-Linkedin_Connecting_Script
// @namespace  http://martin-liu.github.io/
// @updateURL  https://raw.githubusercontent.com/martin-liu/mUserScripts/master/linkedinForDaisy/linkedinForDaisy.js
// @version    0.1
// @description  Linkedin connecting script for Daisy Chu
// @match      http*://*.linkedin.com/*
// @copyright  2014+, Martin Liu
// ==/UserScript==
function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//code.jquery.com/jquery-2.1.1.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "(" + callback.toString() + ")(jQuery);";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}
addJQuery(function($){
    function LinkedinConnect(options){
        this.default={'inviteNote':"I'd like to add you to my professional network on LinkedIn."};
        this.options = options;
        this.state = {};

        this.execute = function(){
            this.initState();
            if (this.state.inSearchPage){
                this.prepareButton();
            } else if (this.state.inInvitePage){
                this.doInvite();
            } else if (this.state.needEmail || this.state.inSuccessPage){
                window.close();
            }
        };

        this.initState = function(){
            if ($('#results').length > 0){
                this.state.inSearchPage = true;
                this.state.resultsArea = $('#results');
                this.state.connectList = $('#results a.primary-action-button.label').filter(function(){
                    return this.text == 'Connect';
                });
            } else if (window.location.href.indexOf('/people/invite') > 0){
                if ($('#IF-reason-iweReconnect').length > 0){
                    this.state.inInvitePage = true;
                    this.state.friendRadio = $('#IF-reason-iweReconnect');
                    this.state.inviteNoteArea = $('#greeting-iweReconnect');
                    this.state.sumbitButton = $('input[name=iweReconnectSubmit]');
                } else {
                    this.state.needEmail = true;
                }
            } else if (window.location.href.indexOf('/people/pymk') > 0){
                this.state.inSuccessPage = true;
            }
        };

        this.prepareButton = function(){
            var button = $('<button class="primary-action label" style="float:right;margin:10px">请猛击！！</button>');
            button.on('click',function(obj){
                var index = 0;
                return function(){
                    if (index >= obj.state.connectList.length){
                        // Go to next page
                        var next = $('.pagination li.active+li>a');
                        if (next){
                            next[0].click();
                            // Go to next page and reload to clean data
                            window.location.reload();
                            return true;
                        } else {
                            alert("Hi" + obj.options.name + " , there's no results to process, please search another key word");
                            return false;
                        }
                    }
                    var a = obj.state.connectList[index++];
                    if (a){
                        a.href += '&hack=true';

                        link = $("<a href='" + a.href + "' target='_blank'></a>").get(0);

                        var e = document.createEvent('MouseEvents');

                        e.initEvent('click', true, true);
                        link.dispatchEvent(e);
                    }
                };
            }(this));
            button.insertBefore($('#body').children().first());
        };

        this.doInvite = function(){
            this.state.friendRadio.prop('checked',true);
            if (this.options.inviteNote){
                var value = this.state.inviteNoteArea.text();
                value.replace(this.default.inviteNote,this.options.inviteNote);
                this.state.inviteNoteArea.text(value);
            }
            this.state.sumbitButton.click();
        };
    }

    var Daisying = new LinkedinConnect({'name':'Daisy','inviteNote':"I'd like to add you to my professional network on LinkedIn."});
    Daisying.execute();
});
