/* global window, Promise, Response*/

var Util = require('../util')

// 备份原生 fetch
window._fetch = window.fetch

/*
    MockFetch

    https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
*/
function MockFetch(resource, init) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Request
    var tempResource = Util.isObject(resource)
        ? resource
        : { method: 'GET', url: resource }
    var tempReq = Object.assign({}, tempResource, init)
    tempReq.type = tempReq.method

    // 查找与请求参数匹配的数据模板
    var item = find(tempReq)

    // 如果未找到匹配的数据模板，则采用原生 fetch 发送请求。
    if (!item) {
        return window._fetch(resource, init)
    }

    // 找到了匹配的数据模板，拦截 fetch 请求
    return Promise.resolve(
        new Response(JSON.stringify(convert(item, tempReq)), {
            status: MockFetch.UNSENT,
            statusText: ''
        })
    )
}

// 查找与请求参数匹配的数据模板：URL，Type
function find(options) {
    for (var sUrlType in MockFetch.Mock._mocked) {
        var item = MockFetch.Mock._mocked[sUrlType]
        if (
            (!item.rurl || match(item.rurl, options.url)) &&
            (!item.rtype || match(item.rtype, options.type.toLowerCase()))
        ) {
            // console.log('[mock]', options.url, '>', item.rurl)
            return item
        }
    }

    function match(expected, actual) {
        if (Util.type(expected) === 'string') {
            return expected === actual
        }
        if (Util.type(expected) === 'regexp') {
            return expected.test(actual)
        }
    }
}

// 数据模板 ＝> 响应数据
function convert(item, options) {
    return Util.isFunction(item.template)
        ? item.template(options)
        : MockFetch.Mock.mock(item.template)
}

module.exports = MockFetch
