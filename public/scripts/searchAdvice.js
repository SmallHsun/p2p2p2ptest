/**
 * 搜尋推薦後可依照ECM後臺設定產生的靜態檔(Tmax\servlets\jsp\stc\10\998\00\000\1099800000.html)變換顏色
 * @author tashuchiu
 */
momoj(function () {
  const $colorElement = momoj('#bt_0_244_01_e1');
  const colorCode = $colorElement.length ? $colorElement.text().trim() : null;//抓取靜態黨 hexCode
  if (colorCode) {
    const $ul = momoj('#bt_0_244_01_P1');
    if($ul.length){
      $ul.css('color', colorCode);
      $ul.find('a').css('color', colorCode);
    }
  }
});