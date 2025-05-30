function StorageTool(key) {
  var storageKey = key;

  //set
  this.set = function (data) {
    if (isNotInit()) {
      return;
    }
    setStorage(data);
  }

  //get. return json object
  this.get = function () {
    if (isNotInit()) {
      return {};
    }
    return getStorage();
  }

  //get > do something > set
  this.process = function (funcMain) {
    if (isNotInit()) {
      return;
    }
    process(funcMain);
  }

  //parse json
  this.parseJSON = function (json) {
    return parseJSON(json);
  }

  //======== define function =================================
  //checker
  function isNotInit() {
    return !storageKey;
  }

  //取得 storage > 做點事 > 塞 storage
  function process(funcMain) {
    var jsonStorage = getStorage();
    typeof funcMain == 'function' && funcMain(jsonStorage);
    setStorage(jsonStorage);
  }

  //取得 storage
  function getStorage() {
    return parseJSON(localStorage.getItem(storageKey));
  }

  //塞 storage
  function setStorage(jsonData) {
    localStorage.setItem(storageKey, JSON.stringify(jsonData));
  }

  //轉JSON
  function parseJSON(str) {
    try {
      return JSON.parse(str || '');
    } catch (e) {
      return {};
    }
  }
}