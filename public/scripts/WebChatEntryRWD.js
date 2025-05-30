var locHostname = location.hostname;
var isMomocoOnline = /(www|m)\.momoshop\.com\.tw/.test(locHostname);
var momocoUrl = isMomocoOnline ? "//momoco.momoshop.com.tw" : "//momocouat.momoshop.com.tw";
var isMobileUat = /(muat[1]?[0-9]{1}|mqc\d{1})\.momoshop\.com\.tw/.test(locHostname);
var tempLoginUrl=isMobileUat? location.origin.replace("muat","momouat").replace("mqc","momoqc") : location.origin;
var LoginUrl = isMomocoOnline ? "//https://www.momoshop.com.tw/api/xiaoi/Login?preUrl=" : tempLoginUrl+"/api/xiaoi/Login?preUrl=";

if(/(momouati|muati)\.momoshop\.com\.tw/.test(locHostname)){ //Deprecated
  momocoUrl = "//momocorobotuat.momoshop.com.tw";
}
var CRMGatewayUrl = momocoUrl + "/WebChatMomo";

var EcpWebChatEntry =
{
  momocoUrl : momocoUrl,
  CRMGatewayUrl: CRMGatewayUrl,
  SmartAgentUrl:  "/index.html",
  LoginUrl: LoginUrl,//登入
  IconImgPreUrl: isMomocoOnline ? "//img1.momoshop.com.tw" : "",
  SmartAgentQueryString: "",
  Icon: "/img/momoco_1.png",
  Title: "數位客服",

    Icon_state: false,
    dvSmartAgentICON: null,
    dvSmartAgent: null,
    dvSmartAgentMainFrm: null,
    dvSABody: null,
    dvP4Url: null,
    ifMain: null,
    dvICON: null,
    ifLoaded: false,
    open: false,
    banneropen: true,
    dvP4Page: null,
    ifP4Url: null,
    resIsWorkTime: false,
    xhttp: null,
    isStorage: true,

    Initialize: function () {
        EcpWebChatEntry.SmartAgentQueryString = "?fromTitle=" + EcpWebChatEntry.getFromTitle() +
                                                "&fromDevice=web" +
                                                "&iMedia=1" +
                                                "&fromUrl=" + EcpWebChatEntry.getFromUrl() +
                                                "&serverSystemTypeOfWebPage=Robot"; //Robot or TextIVR
        if (EcpWebChatEntry.getParameterByName("tempToken") != "" && EcpWebChatEntry.getParameterByName("tempToken") != undefined && EcpWebChatEntry.getParameterByName("tempToken").length != 0) {
            EcpWebChatEntry.SmartAgentQueryString += "&tempToken=" + EcpWebChatEntry.getParameterByName("tempToken");
            EcpWebChatEntry.setCookie();
        }

        EcpWebChatEntry.CreateStyles();
        EcpWebChatEntry.CreateFrame();

        EcpWebChatEntry.dvSmartAgent = document.getElementById("dvSmartAgent");
        EcpWebChatEntry.dvSmartAgentMainFrm = document.getElementById("dvSmartAgentMainFrm");
        EcpWebChatEntry.ifMain = document.getElementById("ifMain");
        EcpWebChatEntry.dvSABody = document.getElementById("dvSABody");
        EcpWebChatEntry.dvSmartAgentICON = document.getElementById("dvSmartAgentICON");
        EcpWebChatEntry.dvICON = document.getElementById("dvICON");

        EcpWebChatEntry.dvP4Page = document.getElementById("dvP4Page");
        EcpWebChatEntry.dvP4Url = document.getElementById("dvP4Url");
        EcpWebChatEntry.ifP4Url = document.getElementById("ifP4Url");
        EcpWebChatEntry.dvP4Page.disabled = false;

        if (typeof localStorage === 'object') {
            try {
                localStorage.setItem('localStorage', 1);
                localStorage.removeItem('localStorage');
            } catch (e) {
                EcpWebChatEntry.isStorage = false;
            }
        }

        if (EcpWebChatEntry.isStorage == true) {
            if (window.sessionStorage.getItem("redata") == "true" && window.sessionStorage.getItem("openpanel") == "true") {
                EcpWebChatEntry.OpenPanel();
                window.sessionStorage.setItem("redata", "false");
            }
        }
        EcpWebChatEntry.dvSmartAgentICON.addEventListener("click", triggerXiaoi);

        document.getElementById("btnP4PageClose").addEventListener("click", function () {
            EcpWebChatEntry.CloseP4Page();
        });

        window.addEventListener('resize', function () {
            EcpWebChatEntry.Resize();
        });

    },

    CreateFrame: function () {
        var sPanelHtml = "<div id=\"dvSmartAgentICON\" title=\"" + EcpWebChatEntry.Title + "\">" +
                        "   <div id=\"dvICON\"><img id=\"imgICON\"/></div>" +
                        "   </div>" +
                        "   <div id=\"dvSmartAgentMainFrm\">" +
                        "   <div id=\"dvSABody\"><iframe id=\"ifMain\" src=\"\"></iframe></div>" +
                        "   </div>" ;

        var Panel = document.createElement("div");
        Panel.id = "dvSmartAgent";
        Panel.innerHTML = sPanelHtml;
        Panel.onmousewheel = function (event) { event.preventDefault(); };
        document.body.appendChild(Panel);

        var sP4PanelHtml = //"<div id=\"dvP4Page\">" +
                            "    <div id=\"dvP4PageTitle\"><span id=\"btnP4PageClose\">X</span>&nbsp;</div>" +
                            "    <div id=\"dvP4Url\"><iframe id=\"ifP4Url\" src=\"\"></iframe></div>";// +
        //"</div>";
        var P4Panel = document.createElement("div");
        P4Panel.id = "dvP4Page";
        P4Panel.innerHTML = sP4PanelHtml;
        P4Panel.onmousewheel = function (event) { event.preventDefault(); };
        document.body.appendChild(P4Panel);

    },

    CreateStyles: function () {
        var sStyles = "";
        Icon_state = EcpWebChatEntry.IconImgPreUrl + "/ecm/img/xiaoi/momoco_pc1.png?ver=20161206174501";

        var css = document.createElement('style');
        css.type = 'text/css';

        sStyles = " #dvSmartAgent {z-index: 99999;                                " +
                  "   position: fixed;                                            " +
                  "   top: 0px;                                                   " +
                  "   bottom: 0px;                                                " +
                  "   right: 0px;                                                 " +
                  " }                                                             " +
                  " #dvSmartAgentICON {z-index: 99998;                            " +
                  "   position: fixed;                                            " +
                  "   right: 0px;                                                 " +
                  "   bottom: 0px;                                                " +
                  "   cursor: pointer;                                            " +
                  " }                                                             " +
                  " #dvSmartAgentICON div {                                       " +
                  "   display: inline-block;                                      " +
                  " }                                                             " +
                  " #dvICON {width: 100%;                                         " +
                  "   background: transparent url(" + Icon_state + ") no-repeat;  " +
                  "   background-size: 100% auto;                                 " +
                  "   width: 110px;                                               " +
                  "   height: 110px;                                              " +
                  " }                                                             " +
                  " #dvSmartAgentICON .openICS {                                  " +
                  "   width: 110px;                                               " +
                  "   background: transparent url(" + Icon_state + ") no-repeat;  " +
                  "   background-size: 100% auto;                                 " +
                  "   height: 110px;                                              " +
                  " }                                                             " +
                  " #imgICON {                                                    " +
                  "   width: 100%;                                                " +
                  " }                                                             " +
                  " #dvSmartAgentMainFrm {                                        " +
                  "   position: absolute;                                         " +
                  "   background-color: azure;                                    " +
                  "   display: none;                                              " +
                  "   width: 100%;                                                " +
                  "   height: 600px;                                              " +
                  "   margin: 0px;                                                " +
                  "   border: 1px solid #B4B4B4;                                  " +
                  "   box-shadow: 2px 2px 10px #999999;                           " +
                  "   overflow: hidden;                                           " +
                  " }                                                             " +
                  " #dvSABody {                                                   " +
                  "   width: 100%;                                                " +
                  "   height: 100%;                                               " +
                  "   border: 0px;                                                " +
                  " }                                                             " +
                  " #ifMain {                                                     " +
                  "   width: 100%;                                                " +
                  "   height: 100%;                                               " +
                  "   border: 0px;                                                " +
                  " }                                                             " +
                  " #dvP4Page {                                                   " +
                  "   position: fixed;                                            " +
                  "   background-color: white;                                    " +
                  "   display: none;                                              " +
                  "   left: 0px;                                                  " +
                  "   top: 0px;                                                   " +
                  "   bottom: 0px;                                                " +
                  "   right: 388px;                                               " +
                  "   margin: 0px 0px 0px 0px;                                    " +
                  "   position: absolute;                                         " +
                  "   z-index: 9999;                                              " +
                  " }                                                             " +
                  " #ifP4Url {                                                    " +
                  "   border: 0px;                                                " +
                  "   display: block;                                             " +
                  "   width: 100%;                                                " +
                  "   height: 100%;                                               " +
                  "   margin: 0 auto;                                             " +
                  " }                                                             " +
                  " #dvP4PageTitle {                                              " +
                  "   display: block;                                             " +
                  "   color: black;                                               " +
                  "   background: white;                                          " +
                  "   width: 100%;                                                " +
                  "   height: 30px;                                               " +
                  "   text-align: right;                                          " +
                  "   font-size: 28px;                                            " +
                  "   font-family: Arial;                                         " +
                  " }                                                             " +
                  " #dvP4Url {                                                    " +
                  "   display: block;                                             " +
                  "   width: 100%;                                                " +
                  "   height: calc(100% - 30px);                                  " +
                  "   margin: 0 auto;                                             " +
                  " }                                                             " +
                  " #btnP4PageClose {                                             " +
                  "   color: black;                                               " +
                  "   cursor: pointer;                                            " +
                  " }                                                             ";

        if (css.styleSheet) {
          css.styleSheet.cssText = sStyles;
        } else {
          css.appendChild(document.createTextNode(sStyles));
        }

        document.getElementsByTagName("head")[0].appendChild(css);
    },

    OpenPanel: function () {
        if (EcpWebChatEntry.isStorage == true)
            window.sessionStorage.setItem("openpanel", "true");

        EcpWebChatEntry.dvSmartAgentMainFrm.style.width = window.innerWidth <= 512 ? window.innerWidth + "px" : "480px";

        EcpWebChatEntry.dvP4Page.disabled = window.innerWidth < 1024 ? true : false;

        EcpWebChatEntry.dvSmartAgentMainFrm.style.right = "120px";
        EcpWebChatEntry.dvSmartAgentMainFrm.style.bottom = "10px";


        EcpWebChatEntry.dvSmartAgent.style.display = "block";
        EcpWebChatEntry.dvSmartAgentMainFrm.style.display = "block";
        EcpWebChatEntry.dvICON.className += "openICS";

        EcpWebChatEntry.open = true;

        if (!EcpWebChatEntry.ifLoaded) {
            EcpWebChatEntry.ifMain.src = EcpWebChatEntry.CRMGatewayUrl + EcpWebChatEntry.SmartAgentUrl + EcpWebChatEntry.SmartAgentQueryString;
            EcpWebChatEntry.ifLoaded = true;
        }
    },

    ClosePanel: function () {
        if (EcpWebChatEntry.isStorage == true)
            window.sessionStorage.setItem("openpanel", "false");
        EcpWebChatEntry.dvSmartAgentMainFrm.style.display = "none";
        EcpWebChatEntry.dvSmartAgentICON.style.display = "block";
        EcpWebChatEntry.open = false;
        EcpWebChatEntry.dvICON.className = "";
        EcpWebChatEntry.CloseP4Page();

    },

    Resize: function () {
        EcpWebChatEntry.dvSmartAgentMainFrm.style.width = window.innerWidth <= 512 ? window.innerWidth + "px" : "480px";

        EcpWebChatEntry.dvP4Page.disabled = window.innerWidth < 1024 ? true : false;
        if (window.innerWidth < 1024) {
            EcpWebChatEntry.CloseP4Page();
        }
    },

    OpenP4Page: function (url) {
        EcpWebChatEntry.ifP4Url.src = url;
        EcpWebChatEntry.dvP4Page.style.display = "block";
    },

    CloseP4Page: function () {
        EcpWebChatEntry.ifP4Url.src = "";
        EcpWebChatEntry.dvP4Page.style.display = "none";
    },

    getFromTitle: function () {
        var fromTitle = "No Title";
        if (typeof (document.getElementsByTagName("title")[0]) !== 'undefined') {
            fromTitle = document.getElementsByTagName("title")[0].innerHTML;
        }
        return encodeURIComponent(fromTitle);
    },

    getFromUrl: function () {
        var url = location.href,
       protocol = location.protocol,
       hostname = location.hostname,
       pathname = location.pathname,
       search = location.search;
        if (search) {
            search = search.replace(/</g, "");
            search = search.replace(/%3C/g, "");
            search = search.replace(/>/g, "");
            search = search.replace(/%3E/g, "");
            search = search.replace(/'/g, "");
            search = search.replace(/%27/g, "");
            search = search.replace(/"/g, "");
            search = search.replace(/%22/g, "");
            search = search.replace(/\//g, "");
            return protocol + "//" + hostname + pathname + search;
        } else {
            return url;
        }
    },

    getParameterByName: function (name) {
        var script_name = "WebChatEntryRWD";
        var scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src.indexOf("/" + script_name) > -1)
                var url = scripts[i].src;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return "";
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },

    setCookie: function () {
        var st = "";
        var expires = new Date();
        expires.setTime(expires.getTime() + 20 * 60 * 1000);
        st = "TN=" + EcpWebChatEntry.getParameterByName("tempToken") + "; "
            //+ "expires=" + expires.toGMTString() + ";"
            + "domain=.momoshop.com.tw;path=/";
        document.cookie = st;
    },

    getCookie: function (name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    },

    StopChat: function () {
        // console.log("stopchat");
        if (EcpWebChatEntry.getCookie("TN") != undefined)
            document.cookie = " TN=undefined ; path=/;domain=.momoshop.com.tw ";
        if (EcpWebChatEntry.getCookie("CN") != undefined)
            document.cookie = " CN=undefined ; path=/;domain=.momoshop.com.tw ";
        if (EcpWebChatEntry.isStorage == true) {
            window.sessionStorage.setItem("redata", "false");
            window.sessionStorage.setItem("ologin", "false");
            window.sessionStorage.removeItem("MessageRecord");
        }
        stopChat();
    localStorage.setItem("logout","logout");
    localStorage.removeItem("logout");
    },

    toLoginPage: function () {
        if (EcpWebChatEntry.isStorage == true)
            window.sessionStorage.setItem("redata", "true");
        var url = EcpWebChatEntry.LoginUrl + window.location.href;
        window.location.href = url;
    }

};

function checkLoginStatus() {
    // console.log("loginRsult" + EcpWebChatEntry.getCookie("loginRsult"));
    if (EcpWebChatEntry.getCookie("loginRsult") == '1' || EcpWebChatEntry.getCookie("isTN1") != undefined) {
    //if (EcpWebChatEntry.getCookie("loginRsult") == '1') {
        if (EcpWebChatEntry.isStorage == true) {
            if (window.sessionStorage.getItem("ologin") == "false" && EcpWebChatEntry.getParameterByName("tempToken") != undefined && EcpWebChatEntry.getParameterByName("tempToken") != '') {
                window.sessionStorage.setItem("redata", "true");
            }
            window.sessionStorage.setItem("ologin", "true");
        }
    }
    else {
        document.cookie = " TN=undefined ; path=/;domain=.momoshop.com.tw ";
        document.cookie = " CN=undefined ; path=/;domain=.momoshop.com.tw ";
        document.cookie = " CM=undefined ; path=/;domain=.momoshop.com.tw ";
    }
}

var isWorkTimeToIcon = false;

function checkIsAgentWorkTimeToIcon() {
    var xhttp = new XMLHttpRequest();
    var resIsWorkTime = false;
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
                onlineUserCount = JSON.parse(xhttp.responseText).onlineUserCount;
                isWorkTimeToIcon = true;
                EcpWebChatEntry.Initialize();
            }
            else {
                //console.log ('xhttp.status' + xhttp.status);
                isWorkTimeToIcon = false;
                EcpWebChatEntry.Initialize();
            }
        }
    };
    xhttp.open("POST", location.protocol + EcpWebChatEntry.momocoUrl + "/gateway/openapi/web/online/user/countByTimer", true);
    xhttp.send(null);
};

function stopChat() {
  var chatId = sessionStorage.getItem("chatId");
  if(chatId != null && chatId != undefined && chatId != 'undefined' && chatId != 'null' && chatId.length == 36) {
    $.ajax({
        url: location.protocol + EcpWebChatEntry.momocoUrl + "/gateway/openapi/web/chat/stop",
        type: "POST",  
        data: JSON.stringify({ chatId: chatId }),
        success: function(ret) {
          sessionStorage.removeItem("chatId");
        }
    });
  }
};

checkLoginStatus();
checkIsAgentWorkTimeToIcon();

window.addEventListener('message', function (e) {
    var data = e.data;
    //console.log('getmessage: ' + data);
    var origin = location.protocol + EcpWebChatEntry.momocoUrl;
    if (e.origin == origin) {
        if (data == "doExitButtonClick") {
            EcpWebChatEntry.ClosePanel();
        } else if (data == "toLoginPage") {
            EcpWebChatEntry.toLoginPage();
        } else {
            sessionStorage.setItem("chatId", data);
        }
    }
}, false);

window.addEventListener('storage', function (e) {
  if (e.key=="logout")
    sessionStorage.removeItem("chatId");
}, false);
function showXiaoiNotWorking(){
  var _params={
    title:'數位客服公告',
    boxwidth:600,
    innerHtml:'<p>親愛的客戶，目前數位客服系統升級中，如需服務請【聯絡客服】留言，後續由客服人員協助，謝謝。</p>',
    id:'showXiaoiNotWorking',
    z_index:100000,
    hideCloseBtn: true,
    leftText:'聯絡客服',
    leftClick: function () {
      window.location.href = "//"+locHostname+"/mypage/MemberCenter.jsp?func=40&mmc_source=chatbot&mmc_platform=web&mmc_campaign=membercentre&mmc_content=customerservicemail&origin=xiaoi";
    },
    rightText:'結束'
  }
  floatingLayerBox(_params);
  floatingLayerBoxAlignCenter();
}

function triggerXiaoi(momowaEventFlag){
  sendXiaoiMomowaEvent(momowaEventFlag);
  if(isWorkTimeToIcon) {
    if (EcpWebChatEntry.isStorage == true) {
      if (EcpWebChatEntry.getCookie("loginRsult") == '1')
        window.sessionStorage.setItem("ologin", "true");
      else
        window.sessionStorage.setItem("ologin", "false");
    }
    if (EcpWebChatEntry.open == false)
      EcpWebChatEntry.OpenPanel();
    else
      EcpWebChatEntry.ClosePanel();
  } else {
    showXiaoiNotWorking();
  }
}

function sendXiaoiMomowaEvent(momowaEventFlag){
  try{
    const pageUrl = new URL(location.href);
    const pageType = pageUrl.pathname;
    let momowaEventCategory = 'web_小i';
    let momowaEventLabel = '';
    
    if(pageType == '/main/Main.jsp'){
      momowaEventLabel = '首頁';
    
    }else if(pageType == '/mypage/MemberCenter.jsp'){
      if(momowaEventFlag == '1'){
        momowaEventLabel = '會員中心：數位客服';
      }else if(momowaEventFlag == '2'){
        momowaEventLabel = '訂單提問';
      }else{
        momowaEventLabel = '會員中心';
      }
    
    }else if((pageType == '/category/LgrpCategory.jsp' && pageUrl.search.indexOf('l_code=12')>-1)
          || (pageType == '/category/MgrpCategory.jsp' && pageUrl.search.indexOf('m_code=12')>-1)
          || (pageType == '/category/DgrpCategory.jsp' && pageUrl.search.indexOf('d_code=12')>-1)){
      momowaEventLabel = '保健';
    }
    
    let momowaSiteId = "shop";
    let ua = navigator.userAgent.toLowerCase();
    if(typeof isMobile == 'function' && isMobile(ua)){
      momowaSiteId = ua.indexOf("momoshop") >= 0 ? "" : "shopmobile"; // APP不推送
    }
    let noTrackmomowa = (momowaEventLabel=='' || momowaSiteId=='');
    
    if(!noTrackmomowa){
      if(!window.momowaCmds){
        (function() {
          var _mwa = document.createElement('script');
          _mwa.type = 'text/javascript';
          _mwa.async = true;
          _mwa.src = '//https://momowa.momoshop.com.tw/momowa/rc/js/momowa.js?t=20220322001';
          var _mwa_s = document.getElementsByTagName('script')[0]; 
          _mwa_s.parentNode.insertBefore(_mwa, _mwa_s);
        }());
      }
      window.momowaCmds = window.momowaCmds || [];
      momowaCmds.push(['setSiteId',momowaSiteId]);
      momowaCmds.push(['setTrackerUrl','//https://momowa.momoshop.com.tw/momowa/rc/RC.MMW']);
      momowaCmds.push(['trackAction', momowaEventCategory, 'Click', momowaEventLabel, '']);
    }
    
  }catch(e){}
}