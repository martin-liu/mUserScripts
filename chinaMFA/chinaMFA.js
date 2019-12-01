// ==UserScript==
// @name       China-MFA_Appointment_Script
// @namespace  http://martin-liu.github.io/
// @updateURL  https://raw.githubusercontent.com/martin-liu/mUserScripts/master/chinamfa/chinamfa.js
// @version    0.1
// @description  Auto fill for china MFA appointment
// @match      http*://ppt.mfa.gov.cn/*
// @copyright  2019+, Martin Liu
// ==/UserScript==

(function(){

  const defaultOptions = {

  };

  const window = unsafeWindow.top;
  const document = window.document;
  const $ = window.$;

  function createElement(html) {
    let wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    return wrapper.firstElementChild;
  }

  function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  async function wait(time=300) {
    return await new Promise(rs => setTimeout(rs, time));
  }

  async function waitUntil(func, times = 100) {
    if (times < 1) {
      console.error("Failed to wait until it works.");
      return;
    }

    if (func()) {
      console.log("Wait until success");
      return;
    } else {
      await wait();
      await waitUntil(func, times - 1);
    }
  }

  class Processer {
    async processOrg() {
      // 1.1. set country
      $("#countryName").click();
      await waitUntil(() => window.getComputedStyle($(".ui-dialog")[0]).display != 'none');
      selectCountry("020221","美国");

      // 1.2. set city
      await waitUntil(() => $("#cityName")[0].options.length > 1);
      $("#cityName").val("7E9BA0776C3C4924A1F0637DD113834C");
      $("#cityName").trigger("change");

      // 1.3. set org
      await waitUntil(() => $("#orgShortName")[0].options.length > 1);
      $("#orgShortName").val("USAA");

      // 1.4 submit
      // $("#submitBtn").click();

      // 2.1 set question and submit
      await waitUntil(() => $("#question")[0].options.length > 1);
      $("#question").val("B17AD00AC5CB4C649FAABB0F8F13CAF8");
      $("#answer").val("camry");
      $("#email").val("hflh1989@gmail.com");
      // $("#button01").click();
    }

    async processApplyInfo() {
      $("#lastNameCN").val("刘");
      $("#lastNameEN").val("LIU");
      // 简: 芈傲
      // 繁: 羋傲
      $("#firstNameCN").val("羋傲"); // 芈傲
      $("#firstNameEN").val("MIAO");
      $("#sex").val("2");
      $("#birthDate").val("2019-07-25");
      $("#birthPlaceName").val("美国");
      $("#birthPlace").val("020221");
      window.typeTextClick('00');
      $("#PubMessSubmit").click();
    }

    async processApplyInfo2() {
      $("#cnHomeAddress").val("湖北省监利县桥市镇桥市中学");
      $("#cnLinkman").val("刘甫清");
      $("#cnContactTel").val("13997586754");
      $("#foreignAddress").val("22614 Meridian Ave S, Bothell, WA, 98021");
      $("#foreignContactTel").val("4255242627");
      $("#workUnit").val("无");
      $("#workContactTel").val("无");
      $("#radio0").click();
      $("#radiofou").click();

      $("#radioForeignShi").click();
      $("#foreignNO").val("647001033");
      $("#caseMessage").val("在美国出生");

      $("#PubMessSubmit").click();
    }

    async processAttachInfo() {
      $("#nationalInput").val("汉族");
      $("#spouse").val("无");
      $("#spouseAddress").val("无");
      $("#spouseContactTel").val("无");
      $("#father").val("刘欢");
      $("#fatherAddress").val("22614 Meridian Ave S, Bothell, WA, 98021");
      $("#fatherContactTel").val("4255242627");
      $("#mother").val("褚璐");
      $("#motherAddress").val("22614 Meridian Ave S, Bothell, WA, 98021");
      $("#motherContactTel").val("4255242750");

      $("#PubMessSubmit").click();
    }

  }

  class ChinaMFA {
    constructor(options = defaultOptions) {
      this.options = options;
      this.state = {};
      let processor = new Processer();
      this.pageProcessorMap = {
        "选择驻外外交领事机构": processor.processOrg,
        "填写申请表": processor.processApplyInfo,
        "基本信息-2": processor.processApplyInfo2,
        "附表信息": processor.processAttachInfo,
      };
    }

    async start() {
      await this.initState();
      if ($('button.chinamfa-btn').length == 0) {
        this.prepareButton();
      }
    }

    async initState() {
      let titleEl = document.querySelector(".nav>.titlede>.titlede_hover");
      let title = titleEl ? titleEl.title : "";
      this.state.processFunc = this.pageProcessorMap[title] || (() => console.error("No processor function found for page " + title));
    }

    prepareButton() {
      var button = createElement('<button class="chinamfa-btn button-secondary-medium m5" style="position:fixed;right:270px;top:40px;z-index:99999;width:100px;height:100px;font-size:20px;color:red">666</button>');
      let index = 0;
      const trigger = this.state.processFunc;
      button.onclick = trigger;
      insertAfter(button, $('body')[0].children[0]);

      document.body.onkeypress = (e) => {
        if (e.altKey && e.which == 13) {
          trigger();
        }
      };
    };
  }

  let chinamfa = new ChinaMFA();
  chinamfa.start();

})();
