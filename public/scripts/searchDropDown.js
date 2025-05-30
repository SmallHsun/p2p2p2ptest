momoj(document).ready(() => {
                     
  momoj(".btn-secondary").on("click", function() {
    if (momoj(".dropdown-menu").hasClass("hide")) {
      momoj(".dropdown-menu").removeClass("hide");
    } else {
      momoj(".dropdown-menu").addClass("hide");
    }

    if (momoj(".btn-secondary").hasClass("icon-rotate")) {
      momoj(".btn-secondary").removeClass("icon-rotate");
    } else {
      momoj(".btn-secondary").addClass("icon-rotate");
    }
  });

  momoj(".dropdown-item").on("click", function() {
    momoj(".dropdown-item").removeClass("select");
    momoj(this).addClass("select");
    var btnSecondaryText ='';
    if(momoj(this).text() == "搜全站商品"){
      btnSecondaryText = momoj(this).text();
      momoj("#keyword").attr("switchconstriction" , false);
      momoj("#keyword").attr("placeholder" , "請輸入關鍵字或品號");
    }else{
      btnSecondaryText ="搜館內商品";
      momoj("#keyword").attr("switchconstriction" , true);
      var originalCateName = momoj('#originalCateName').val()||'';
      momoj("#keyword").attr("placeholder" , originalCateName);
    }
    momoj(".btn-secondary").text(btnSecondaryText);
    momoj(".dropdown-menu").addClass("hide");

    if (momoj(".btn-secondary").hasClass("icon-rotate")) {
      momoj(".btn-secondary").removeClass("icon-rotate");
    } else {
      momoj(".btn-secondary").addClass("icon-rotate");
    }
  });

  momoj("#keyword").on("keyup", function() {
    var isconstriction = momoj("#keyword").attr("isconstriction");
    if(isconstriction == 'true'){
      if(momoj("#keyword").val() == "") {
        momoj(".dropdown").removeClass("hide");
      } else {
        momoj(".dropdown").addClass("hide");
        momoj(".dropdown-menu").addClass("hide");
        momoj(".btn-secondary").removeClass("icon-rotate");
      }
    }
  });

  momoj(document).on("scroll", function(){
    momoj(".dropdown-menu").addClass("hide");
    momoj(".btn-secondary").removeClass("icon-rotate");
  })

});