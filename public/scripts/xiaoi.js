(function($) {
	var token = "";
	var domainType = momoj().getDomainType();
	var showXiaoi = momoj().showXiaoi(domainType);
	if(showXiaoi) {
		if(domainType == "mWeb") {//小網
			var xiaoRtn = momoj.ajaxTool({data:{flag:"getXiaoiToken"}});
//			console.log("m.momo xiaoi token=="+xiaoRtn.rtnData);
			token = xiaoRtn.rtnData;
			
			momoj().importXiaoiWebChatJs(domainType, token);
		} else if(domainType == "bWeb") {//大網
			var xiaoRtn = momoj.ajaxTool({data:{flag:6004}});
//			console.log("www.momo xiao token333=="+xiaoRtn.rtnData.rtnData);
			token = xiaoRtn.rtnData.rtnData;
			
			momoj().importXiaoiWebChatJs(domainType, token);
		}
	}
	
})(jQuery);
