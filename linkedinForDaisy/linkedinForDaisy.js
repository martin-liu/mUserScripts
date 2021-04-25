// ==UserScript==
// @name       Daisy-Linkedin_Connecting_Script
// @namespace  http://martin-liu.github.io/
// @updateURL  https://raw.githubusercontent.com/martin-liu/mUserScripts/master/linkedinForDaisy/linkedinForDaisy.js
// @version    1.0.0
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
      return [].filter.call($('.reusable-search__result-container .entity-result__actions button'), d => d.innerText=='Connect');
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
      if ($('.search-results-container').length > 0){
        this.state.inSearchPage = true;
      } else if (this.needClose()){
        this.state.needClose = true;
      }
    }

    prepareButton() {
      var button = createElement('<button class="daisying-btn artdeco-button artdeco-button--3 artdeco-button--primary" style="position:fixed;right:270px;top:62px;z-index:99999">666</button>');
      var autoButton = createElement('<button class="daisying-btn artdeco-button artdeco-button--3 artdeco-button--primary" style="position:fixed;right:150px;top:62px;z-index:99999">Auto 666</button>');
      let index = 0;
      const trigger = async () => {
        let connectList = this.getConnectList();
        if (index >= connectList.length){
          // Go to next page
          let nextButton = [].find.call($('.artdeco-pagination button'), d => d.innerText.trim()=='Next');
          if (!nextButton) {
            window.scrollBy(0, window.innerHeight);
          }
          if (nextButton){
            nextButton.click();

            // Go to next page and reset state
            index = 0;
            await wait(500);
            return true;
          } else {
            return false;
          }
        }
        var a = connectList[index++];
        if (a){
          // scroll down and wait for load
          let y = window.scrollY + a.getBoundingClientRect().top;
          window.scrollBy(0, y);
          await wait(300);

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

      autoButton.onclick = () => {
        setInterval(trigger, 3000);
      };
      insertAfter(autoButton, $('body')[0].children[0]);

      document.body.onkeypress = (e) => {
        if (e.altKey && e.which == 13) {
          trigger();
        }
      };
    };

    async doInvite (){
      await wait(300);

      const modalCls = '.artdeco-modal';
      let needEmail = $(`${modalCls} input#email`).length > 0;
      if (needEmail) {
        let cancelButton = [].find.call($(`${modalCls} button[name=cancel]`), d => d);
        if (cancelButton) {
          cancelButton.click();
          await wait(300);
        }
        return;
      }
      let noteButton = [].find.call($(`${modalCls} button`), d => d.innerText=='Add a note');
      if (noteButton) {
        noteButton.click();
        await wait(300);

        let textArea = $(`${modalCls} textarea#custom-message`);
        if (textArea.length) {
          textArea[0].value = this.options.inviteNote || this.default.inviteNote;

          let inviteButton = [].find.call($(`${modalCls} button`), d => d.innerText=='Send');
          if (inviteButton) {
            inviteButton.disabled = false;
            inviteButton.click();
          }
        }
      }
    };
  }

  let Daisying = new LinkedinConnect({
    name:'Daisy',
    inviteNote: `Hi there,I am Lead Recruiter of TuSimple(AI & Self-Drive, IPO@2021). Your background looks impressive and I’d like to connect with you for future job opportunities. Thank you!`
  });
  Daisying.execute();

})();
