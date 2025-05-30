var jsFileName = "GS00XeaMkLEMxQJpXwzo";
if (!/(www|m)\.momoshop\.com\.tw/.test(location.hostname)) {
  jsFileName = "gN8JZR30d3or1EbZ5Ien";
}

(function (w, d, dn, t) {
  w[dn] = w[dn] || [];
  w[dn].push({ eventType: 'init', value: t, dc: 'asia' });
  var f = d.getElementsByTagName('script')[0], c = d.createElement('script');
  c.async = true;
  c.src = `/* https://tags.creativecdn.com/${t}.js`; */
  // Attach an event listener to ensure the script is loaded before using rtbhEvents
  c.onload = function() {
      console.log('External script loaded successfully');
      // Call any functions that depend on the script being loaded here
  };
  f.parentNode.insertBefore(c, f);
})(window, document, 'rtbhEvents', jsFileName);


const rtbhEventsApi = {
  /**
   * @param {*} eventType home:首頁, sales:促銷頁面代碼, startorder:開始結帳
   * @param {*} id 
   */
  push: function (eventType, id) {
    rtbhEvents = window.rtbhEvents || [];
    rtbhEvents.push({ eventType: eventType }, { eventType: 'uid', id: id || 'unknown' });
  },
  /**
   * @param {*} categoryId 
   * @param {*} id
   */
  pushCategory: function (categoryId, id) {
    rtbhEvents = window.rtbhEvents || [];
    rtbhEvents.push({ eventType: 'category', categoryId: categoryId }, { eventType: 'uid', id: id || 'unknown' });
  },
  /**
   * 
   * @param {*} eventType offer:產品頁面代碼, wishlist:願望清單,basketadd:將產品加入購物車
   * @param {*} offerId
   * @param {*} id
   */
  pushOfferId: function (eventType, offerId, id) {
    rtbhEvents = window.rtbhEvents || [];
    rtbhEvents.push({ eventType: eventType, offerId: offerId }, { eventType: 'uid', id: id || 'unknown' });
  },
  /**
   * @param {*} eventType listing: 搜尋結果頁面代碼, basketstatus:購物車狀態代碼
   * @param {*} offerIds
   * @param {*} id
   */
  pushOfferIds: function (eventType, offerIds, id) {
    rtbhEvents = window.rtbhEvents || [];
    rtbhEvents.push({ eventType: eventType, offerIds: offerIds }, { eventType: 'uid', id: id || 'unknown' });
  },
  /**
   * @param {*} size 
   * @param {*} id 
   */
  pushProductSize: function (size, id) {
    rtbhEvents = window.rtbhEvents || [];
    rtbhEvents.push({ eventType: 'size', size: size }, { eventType: 'uid', id: id || 'unknown' });
  },
  /**
   * 
   * @param {*} value 訂單總價, 數字類型,最多取到小數點第二位
   * @param {*} orderId 訂單編號
   * @param {*} ids 商品編號陣列 例如:['2513681','2525675']
   * @param {*} attributed Booleab 設定為true當此筆訂單是歸因於RTB House；設定為false當此筆訂單是歸因给其他非屬於RTB House 之媒体
   * @param {*} id 會員識別id
   */
  pushOrderPurchase: function (value, orderId, ids, attributed, id) {
    rtbhEvents = window.rtbhEvents || [];
    rtbhEvents.push({
      eventType: 'conversion', conversionClass: 'order',
      conversionSubClass: 'purchase', conversionId: orderId,
      offerIds: ids, conversionValue: value, isAttributed: attributed || true
    },
      { eventType: 'uid', id: id || 'unknown' });
  }
}

