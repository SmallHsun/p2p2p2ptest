(function(){
  /**
   * string format
   * 例:
   * alert( 'key:[{0}],value:[{1}]'.f('name','Super Man') );
   * 結果 - key:[name],value:[Super Man]
   * @return format 結果
   * @author ddchien 2012.10.25
   */
  String.prototype.format = String.prototype.f = function () {
    var txt = this;
    for(var i=0;i<arguments.length;i++) {
      var exp = new RegExp('\\{' + (i) + '\\}','gm');
      txt = txt.replace(exp,arguments[i]);
    }
    return txt;
  };
})();