const insertAdvertiserId = 1626118;

window._tfa = window._tfa || [];
window._tfa.push({ notify: 'event', name: 'page_view', id: insertAdvertiserId });
!function (t, f, a, x) {
  if (!document.getElementById(x)) {
    t.async = 1; t.src = a; t.id = x; f.parentNode.insertBefore(t, f);
  }
}(document.createElement('script'),
  document.getElementsByTagName('script')[0],
  `//cdn.taboola.com/libtrc/unip/${insertAdvertiserId}/tfa.js`,
  'tb_tfa_script');

const taboolaEvents = {
  /**
   * 
   * @param {*} productIds array of string ['sku1','sku2']
   */
  addToCart: function (productIds) {
    window._tfa.push({
      id: insertAdvertiserId, notify: 'ecevent',
      name: 'ADD_TO_CART', productIds: productIds
    });
  },
  /**
   * 
   * @param {*} productIds array of string ['sku1','sku2']
   */
  removeFromCart: function (productIds) {
    window._tfa.push({
      id: insertAdvertiserId, notify: 'ecevent',
      name: 'REMOVE_FROM_CART', productIds: productIds
    });
  },
  /**
   * 
   * @param {*} productIds array of string ['sku1','sku2']
   */
  addToWishList: function (productIds) {
    window._tfa.push({
      id: insertAdvertiserId, notify: 'ecevent',
      name: 'ADD_TO_WISH_LIST', productIds: productIds
    });
  },
  /**
   * 
   * @param {*} productIds array of string ['sku1','sku2']
   */
  removeFromWishList: function (productIds) {
    window._tfa.push({
      id: insertAdvertiserId, notify: 'ecevent',
      name: 'REMOVE_FROM_WISH_LIST', productIds: productIds
    });
  },
  /**
   * 
   * @param {*} productIds array of string ['sku1']
   */
  productView: function (productIds) {
    window._tfa.push({
      id: insertAdvertiserId, notify: 'ecevent',
      name: 'PRODUCT_VIEW', productIds: productIds
    });
  },
  /**
   * 
   * @param
   * productIds array of string ['sku1','sku2'] 
   * category String, categoryId String
   */
  categoryView: function ({ productIds, category, categoryId }) {
    window._tfa.push({
      id: insertAdvertiserId, notify: 'ecevent',
      name: 'CATEGORY_VIEW', productIds, category, categoryId
    });
  },
  homePageVisit: function () {
    window._tfa.push({
      id: insertAdvertiserId, notify: 'ecevent',
      name: 'HOME_PAGE_VISIT'
    });
  },
  /**
   * 
   * @param
   * productIds array of string ['sku1','sku2'] 
   * searchTerm 搜尋關鍵字
   */
  search: function ({ productIds, searchTerm }) {
    window._tfa.push({
      id: insertAdvertiserId, notify: 'ecevent',
      name: 'SEARCH', productIds, searchTerm
    });
  },
  /**
   * 
   * @param {*} 
   * orderId: 'order123',
   * currency: 'TWD',
   * value: 130,
   * cartDetails: [
      {productId: 'sku1', quantity: 3, price: 22.45},
      {productId: 'sku2', quantity: 4, price: 15.76}
      ]
   */
  purchase: function ({ orderId, currency, value, cartDetails }) {
    window._tfa.push({
      id: insertAdvertiserId, notify: 'ecevent',
      name: 'PURCHASE', orderId, currency, value, cartDetails
    });
  }
}

momoj(document).ready(function () {
  if (typeof window._tfa !== 'object') {
    return false;
  }

  const getCategoryData = () => {
    const categoryPathElements = document.querySelectorAll('.pathArea li');
    const getCategoryCode = element => element?.querySelector('a')?.getAttribute('cn') || '';
    const getCategoryName = element => element instanceof Element ? element?.querySelector('a').textContent.replace(/>/g, '').replace(/\s/g, '') : '';
    const categoryData = {
      code: getCategoryCode(categoryPathElements[0]),
      name: getCategoryName(categoryPathElements[0]),
    }
    return categoryData;
  }

  /**
 * 獲取搜尋結果頁 商品 ( .prdListArea > ul > li > a ) 資料
 * @param {Number} goodsAmount 商品資料筆數
 * @returns {Array<GoodsInfo>} 商品資訊列表
 * 
 */
  const getGoodsInfoList = () => {
    let result = [];
    const goodsElements = Array.from(document.querySelectorAll('.prdListArea > ul > li > a'));
    if (goodsElements.length === 0) return []
    const urlParams = new URLSearchParams(window.location.search);
    let currentPage = 1;
    if (typeof _currentPage !== 'undefined') {
      currentPage = _currentPage;
    }
    if (typeof curPage !== 'undefined') {
      currentPage = curPage;
    }
    if (urlParams.get('page') !== null) {
      currentPage = urlParams.get('page');
    }
    currentPage = Number(currentPage);

    //只取前3筆
    if (currentPage === 1) {
      result = goodsElements.slice(0, 3).reduce((goodsInfoList, element) => {
        goodsInfoList.push(element.getAttribute('goodscode') || '')
        return goodsInfoList;
      }, [])
    } else {
      result = []
    }

    return result
  }
  //小網
  if (location.pathname === '/main.momo') {
    taboolaEvents.homePageVisit();
  } else if (location.pathname === '/goods.momo') {
    taboolaEvents.productView([goodsInfo.id]);
  } else if (location.pathname === '/category.momo' || location.pathname === '/cateGoods.momo') {
    const categoryData = getCategoryData();
    const productIds = getGoodsInfoList();
    taboolaEvents.categoryView({ productIds, categoryId: categoryData.code, category: categoryData.name });
  }

  //大網
  const getCategoryGoods = function () {
    let result = [];
    const goodsElements = Array.from(document.querySelectorAll(`.TabContentD ul li:not([style*="display: none"]) a`));
    if (goodsElements.length === 0) return []
    result = goodsElements.slice(0, 3).reduce((goodsInfoList, element) => {
      if(element.getAttribute('href')) {
        const href = element.getAttribute('href').split('?')[1];
        const iCode = new URLSearchParams(href).get('i_code');
        goodsInfoList.push(iCode || '')
      }
      return goodsInfoList;
    }, [])
    return result
  }
  if (location.pathname === '/main/Main.jsp') {
    taboolaEvents.homePageVisit();
  } else if (location.pathname === '/goods/GoodsDetail.jsp') {
    const urlParams = new URLSearchParams(window.location.search);
    const product_id = urlParams.get('i_code');
    taboolaEvents.productView([product_id]);
  } else if (location.pathname === '/category/LgrpCategory.jsp') {
    const urlParams = new URLSearchParams(window.location.search);
    const l_code = urlParams.get('l_code');
    momoj(window).on("load", function () {
      const name = momoj("input.toothName").val();
      const productIds = getCategoryGoods();
      taboolaEvents.categoryView({ productIds, categoryId: l_code, category: name });
    })
  } else if (location.pathname === '/category/MgrpCategory.jsp') {
    const urlParams = new URLSearchParams(window.location.search);
    const m_code = urlParams.get('m_code');
    momoj(window).on("load", function () {
      const name = momoj("input#tempMName").val();
      const productIds = getCategoryGoods();
      taboolaEvents.categoryView({ productIds, categoryId: m_code, category: name });
    })
  }
})
