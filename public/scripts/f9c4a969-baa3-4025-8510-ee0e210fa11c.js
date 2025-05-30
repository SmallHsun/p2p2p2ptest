(function(win, doc) {
    var load = function(win, doc, scriptTagName, src, obj, objName, config) {
        if (win[objName])
            return;
        obj = win[objName] = function() {
            if (obj.callMethod) {
                obj.callMethod.apply(obj, arguments);
            } else {
                obj.queue.push(arguments);
            }
        };
        obj.config = config;
        obj.queue = [];
        var newScriptElement = doc.createElement(scriptTagName);
        var rootScriptElement = doc.getElementsByTagName(scriptTagName)[0];
        newScriptElement.async = true;
        newScriptElement.src = src;
        rootScriptElement.parentNode.insertBefore(newScriptElement, rootScriptElement);

        return obj;
    }

    var feedId = 'f9c4a969-baa3-4025-8510-ee0e210fa11c';
    var feed = win.rtq.feeds[feedId];
    feed.callMethods = [
        {
            name: 'ed',
            config: {
                pixels: [feedId],
                trackUrl: '//https://ecdmp.momoshop.com.tw',
            }
        },
    ];

    for (var idx = 0; idx < feed.callMethods.length; idx++) {
        if (feed.callMethods[idx].config.pixels.length > 0) {
            feed.callMethods[idx].callMethod = load(
                win,
                doc,
                'script',
                '//https://static-cdn.momoshop.com.tw/trackcode/' + feed.callMethods[idx].name + '.js',
                feed.callMethods[idx].name + 'q',
                feed.callMethods[idx].name + 'q',
                feed.callMethods[idx].config
            )
        }
    }

    feed.callMethod = function() {
        for (var idx = 0; idx < feed.callMethods.length; idx++) {
            if (feed.callMethods[idx].callMethod) {
                feed.callMethods[idx].callMethod(arguments);
            }
        }
    };

    var queue = feed.queue.slice();
    for (var idx = 0; idx < queue.length; idx++)
    feed.callMethod.apply(null, queue[idx]);
})(window, document);