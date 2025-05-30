/** 寬版浮層for購物車(點擊黑透明背景不會關閉浮層) **/
function openfloatingLayerBox4shopcart(params) {
  var _params=momoj.extend({
    title:'',
    boxwidth:1000,
    innerHtml:'',
    id:'floatingLayerBox'
  },params);

  viewHeiht = momoj(window).height();
  momoj("body").append("<div id='"+_params.id+"' class='floatingLayerBox' style='width:" + _params.boxwidth + "px; box-shadow:2px 2px 2px rgba(0,0,0,0.3); overflow:hidden; position:fixed; top:50%; left:0px; bottom:0px; right:0px; margin:auto; z-index:3'><style>.floatingLayerBox .title .closeBtn::before, .floatingLayerBox .title .closeBtn::after {background-color:#818181; width:24px; height:2px; content:''; margin:-1px 0px 0px -12px; position:absolute; top:50%; left:50%; transform:rotate(45deg); transition:all 200ms ease-out 0s}.floatingLayerBox .title .closeBtn::after {transform:rotate(-45deg)}.floatingLayerBox .title .closeBtn:hover::before {transform:rotate(-45deg)}.floatingLayerBox .title .closeBtn:hover::after {transform:rotate(45deg)}</style><div class='title' style='background-color:#E7E7E7; height:48px; font:bold 16px/48px Helvetica; color:#000000; padding:0px 10px'><b></b><a class='closeBtn' style='width:18px; height:18px; position:absolute; top:15px; right:15px; cursor:pointer'></a></div><div class='innerArea' style='background-color:#FFFFFF; padding:10px 20px'></div></div>");
  momoj(".floatingLayerBox .innerArea").html(_params.innerHtml);
  momoj(".floatingLayerBox .title b").html(_params.title);
  momoj("body").append("<div id='MoMoLM' style='background-color:rgba(0,0,0,0.3); width:100%; height:100%; position:fixed; top:0px; left:0px; z-index:2'></div>");
  /** 當浮層改變高度時，為了讓浮層固定在正中央，所以當浮層有被點擊時，就去改變浮層style裡的高度 **/
  /*momoj("body").delegate(".floatingLayerBox","click",function(){
    momoj(".floatingLayerBox").css({"height":(momoj(".floatingLayerBox .innerArea").innerHeight() + momoj(".floatingLayerBox .title").height())});
  });
  */
  /** 點擊浮層的[關閉] **/
  momoj("body").delegate(".floatingLayerBox .closeBtn","click",function(){
    momoj("#MoMoLM, .floatingLayerBox").remove();
  })
}

/**
* title 浮層名稱
* boxwidth 寬度
* innerHtml 顯示內容
* id 浮層ID
**/
function openfloatingLayerBox3(title,boxwidth,innerHtml,id) {
	viewHeiht = momoj(window).height();
	momoj("body").append("<div id='"+id+"' class='floatingLayerBox' style='width:" + boxwidth + "px; height:600px; box-shadow:2px 2px 2px rgba(0,0,0,0.3); overflow:hidden; position:fixed; top:0px; left:0px; bottom:0px; right:0px; margin:auto; z-index:7'><div class='title' style='background-color:#E7E7E7; height:48px; font:bold 16px/48px Helvetica; color:#000000; padding:0px 10px'><b></b><style>.floatingLayerBox .title span {color:#3366ff; cursor:pointer; float:right; font:13px/50px Helvetica;}.floatingLayerBox .title span a {margin:0 5px 0 0} .floatingLayerBox .title span .closeBtn {margin:0 0 0 5px}</style><span><a onclick='mayLike_categoryConfirm();' class='okBtn'>確定</a>|<a class='closeBtn'>取消</a></span></div><div class='innerArea' style='background-color:#FFFFFF; padding:10px 20px'></div></div>");
	momoj(".floatingLayerBox .innerArea").html(innerHtml);
	momoj(".floatingLayerBox .title b").text(title);
	momoj("body").append("<div id='MoMoLM' style='background-color:rgba(0,0,0,0.3); width:100%; height:100%; position:fixed; top:0px; left:0px; z-index:2'></div>");
	/** 當浮層改變高度時，為了讓浮層固定在正中央，所以當浮層有被點擊時，就去改變浮層style裡的高度 **/
	momoj("body").delegate(".floatingLayerBox","click",function(){
		momoj(".floatingLayerBox").css({"height":(momoj(".floatingLayerBox .innerArea").innerHeight() + momoj(".floatingLayerBox .title").height())});
	});
	/** 關閉浮層與黑透明背景 **/
	momoj("body").delegate("#MoMoLM, .floatingLayerBox .closeBtn","click",function(){
		momoj("#MoMoLM, .floatingLayerBox").remove();
	});
  	/** 此行很重要，讓浮層固定在視窗的正中央(而且一定要在最後執行)... **/
	momoj(".floatingLayerBox").css({"height":(momoj(".floatingLayerBox .innerArea").innerHeight() + momoj(".floatingLayerBox .title").height()), "top":"0px"});
	if (document.documentElement.clientHeight < momoj(".floatingLayerBox").height()) {
		momoj(".floatingLayerBox").css({"height":viewHeiht, "width":(momoj(".floatingLayerBox").width()+17)});
		momoj(".floatingLayerBox .innerArea").css({"height":(viewHeiht - momoj(".floatingLayerBox .title").height() - 20), "overflow-y":"auto"});
	}
}