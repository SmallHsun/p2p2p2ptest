//產出特徵碼
if(typeof momoj != "undefined"){
  if (momoj().cookie('isBI') != "1") {
    if(typeof Fingerprint2 == "undefined"){
      getFingerPrtint(1);
    }else{
      genBid("001");
    }
    function genBid(type){
      var fp = new Fingerprint2();
      fp.get(function(result, components) {
        setBid(result,type);
      });
    }
    function getFingerPrtint(count){
      if(count > 0 && count <3){
        var _postData={
          url : momoj.getJsCssPath({org:'/ecm/js/fingerprint2.js?t=20201119001'}),
          dataType : "script",
          cache : true,
          success : function(){genBid("000");},
          error:function(){getFingerPrtint(count+1);}
        };
        if(count == 2){
          _postData.url = '//image.momoshop.com.tw/ecm/js/fingerprint2.js?t=20201119001';
          _postData.success = function(){genBid("002");},
          _postData.error = function(){
            setBid("","003");
          };
        }
        momoj.ajax(_postData);
      }
    }
    function setBid(result,type){
      momoj.ajaxTool({
        async : false,
        data : {
          flag : 6005,
          fingerId : result,
          type : type
        }
      });
    }
  }
  momoj(function() {
    if(momoj().cookie('MNSOFlag') =="1"){
      var ssoRtn = momoj.ajaxTool({
        async : false,
        data : {
          flag : 6010
        }
      });
      if(ssoRtn){
        if(ssoRtn.resultCode == '200'){
          for(var i=0;i<ssoRtn.iframeLink.length;i++){
            if(ssoRtn.iframeLink[i].length>0){
              var logOutStr ="<iframe src='"+ ssoRtn.iframeLink[i] +"' width='1' height='1' style='visibility: hidden; display: block'></iframe>";
              var dvssoLogOut = momoj('<div style="display:none"></div>').append(logOutStr);
              momoj("body").append(dvssoLogOut);
            }
          }
          if(typeof account !== "undefined"){
            account.removeStorage();
          }
        }
      }
    }
    if(momoj().cookie('loginRsult') =="1"){
      let actswitch = getLoginVersion();
      if(actswitch==2){
        try {
          let info = localStorage.getItem('STORAGEINFO');
          let version = localStorage.getItem('VERSION');
          if(info === null  || version === null){
            loadNewLoginJS({"callback": function(){
              if(typeof account !== "undefined"){
                account.syncLocalStorage(chkSyncInfo)
              }
            }});
          }
        } catch (error) {
        }
        
      }
    }
  });
}
