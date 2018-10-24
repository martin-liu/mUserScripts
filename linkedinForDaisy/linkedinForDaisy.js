// ==UserScript==
// @name       Daisy-Linkedin_Connecting_Script
// @namespace  http://martin-liu.github.io/
// @updateURL  https://raw.githubusercontent.com/martin-liu/mUserScripts/master/linkedinForDaisy/linkedinForDaisy.js
// @version    0.10
// @description  Linkedin connecting script for Daisy Chu
// @match      http*://*.linkedin.com/*
// @copyright  2014+, Martin Liu
// ==/UserScript==

(function(){
  const window = unsafeWindow.top;
  const document = window.document;
  const $ = document.querySelectorAll.bind(document);

  function createElement(html) {
    let wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    return wrapper.firstElementChild;
  }

  function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  async function wait(time) {
    return await new Promise(rs => setTimeout(rs, time));
  }

  class LinkedinConnect {
    constructor(options) {
      this.default = {'inviteNote':"I'd like to add you to my professional network on LinkedIn."};
      this.options = options;
      this.state = {};
    }

    getConnectList() {
      return [].filter.call($('.search-results .search-result__actions button'), d => d.innerText=='Connect');
    }

    pathContains(path) {
      if (!Array.isArray(path)) {
        path = [path];
      }
      let href = window.location.href;
      return path.some(d => href.indexOf(path) > 0);
    }

    needClose() {
      return this.pathContains(['/people/pymk', 'people/iweReconnectAction', 'people/contacts-search-invite-submit-reconnect']);
    }

    async execute() {
      await this.initState();
      if (this.state.inSearchPage){
        if ($('button.daisying-btn').length == 0) {
          this.prepareButton();
        }
      } else if (this.state.inInvitePage){
        this.doInvite();
      } else if (this.state.needEmail || this.state.needClose){
        window.close();
      }
    }

    async initState() {
      if ($('.search-results-page').length > 0){
        this.state.inSearchPage = true;
        this.state.resultsArea = $('.search-results');
      } else if (this.needClose()){
        this.state.needClose = true;
      }
    }

    prepareButton() {
      var button = createElement('<button class="daisying-btn button-secondary-medium m5" style="position:fixed;right:200px;top:40px;z-index:99999">666</button>');
      let index = 0;
      const trigger = async () => {
        let connectList = this.getConnectList();
        if (index >= connectList.length){
          // Go to next page
          let nextButton = [].find.call($('.artdeco-pagination button'), d => d.innerText.trim()=='Next');
          if (!nextButton) {
            if (window.Ember) {
              window.Ember.$(document).scrollTop(500);
              await wait(1000);
            }
          }
          if (nextButton){
            nextButton.click();

            // Go to next page and reload to clean data
            await wait(500);
            window.location.reload();
            return true;
          } else {
            alert("Hi " + this.options.name + " , there's no results to process, please search another key word");
            return false;
          }
        }
        var a = connectList[index++];
        if (a){
          if (window.Ember) {
            let y = window.scrollY + a.getBoundingClientRect().top;
            window.Ember.$(document).scrollTop(y);
            await wait(300);
          }
          if (a.click) {
            a.click();
            this.doInvite();
          } else {
            a.href += '&hack=true';

            let link = $("<a href='" + a.href + "' target='_blank'></a>").get(0);

            var e = document.createEvent('MouseEvents');

            e.initEvent('click', true, true);
            link.dispatchEvent(e);
          }
        }
        return true;
      };
      button.onclick = trigger;
      insertAfter(button, $('body')[0].children[0]);

      document.body.onkeypress = (e) => {
        if (e.altKey && e.which == 13) {
          trigger();
        }
      };
    };

    async doInvite (){
      await wait(300);

      let noteButton = [].find.call($('.modal button'), d => d.innerText=='Add a note');
      if (noteButton) {
        noteButton.click();
        await wait(300);

        let textArea = $('.modal textarea#custom-message');
        if (textArea.length) {
          textArea[0].value = this.options.inviteNote || this.default.inviteNote;

          let inviteButton = [].find.call($('.modal button'), d => d.innerText=='Send invitation');
          if (inviteButton) {
            inviteButton.click();
          }
        }
      }
    };
  }

  let Daisying = new LinkedinConnect({
    name:'Daisy',
    inviteNote: `Hi there, this is Technical Recruiter Daisy, I am looking for Tech Talents from Jr level to C level in AI/Big Data industry. I would like to connect you for future job opportunity. Thank you!`
  });
  Daisying.execute();

})();
