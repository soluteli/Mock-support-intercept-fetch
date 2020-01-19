/* global console, require, chai, describe, before, it */
// fetch 请求（fetch HTTP Request）
var expect = chai.expect
var Mock, _

describe('Fetch', function() {
    before(function(done) {
        require(['mock', 'underscore'], function() {
            Mock = arguments[0]
            _ = arguments[1]
            expect(Mock).to.not.equal(undefined)
            expect(_).to.not.equal(undefined)
            done()
        })
    })

    function stringify(json) {
        return JSON.stringify(json /*, null, 4*/ )
    }

    describe('fetch()', function() {
        it('', function(done) {
            var that = this
            var url = Math.random()
            fetch(url)
                .then(d => {
                    that.test.title += url + ' => ' + stringify(d)
                    expect(404).to.be.equal(d.status)
                })
                .catch(e => console.log(e))
                .finally(_ => done())
        })
    })

    describe('Mock.mock( rurl, template )', function() {
        it('', function(done) {
            var that = this
            var url = 'rurl_template.json'

            Mock.mock(/rurl_template.json/, {
                'list|1-10': [{
                    'id|+1': 1,
                    'email': '@EMAIL'
                }]
            })

            Mock.setup({
                // timeout: 100,
                timeout: '10-50',
            })

            fetch(url)
                .then(d => d.json())
                .then(d => {
                    that.test.title += url + ' => ' + stringify(d)
                    expect(d).to.have.property('list')
                        .that.be.an('array').with.length.within(1, 10)
                    _.each(d.list, function(item, index, list) {
                        if (index > 0) expect(item.id).to.be.equal(list[index - 1].id + 1)
                    })
                })
                .catch(e => console.log(e))
                .finally(_ => done())
        })
    })

    describe('Mock.mock( rurl, function(options) )', function() {
        it('', function(done) {
            var that = this
            var url = 'rurl_function.json'

            Mock.mock(/rurl_function\.json/, function(options) {
                expect(options).to.not.equal(undefined)
                expect(options.url).to.be.equal(url)
                expect(options.type).to.be.equal('GET')
                expect(options.body).to.be.equal(undefined)
                return Mock.mock({
                    'list|1-10': [{
                        'id|+1': 1,
                        'email': '@EMAIL'
                    }]
                })
            })

            fetch(url)
                .then(d => d.json())
                .then(d => {
                    that.test.title += url + ' => ' + stringify(d)
                    expect(d).to.have.property('list')
                        .that.be.an('array').with.length.within(1, 10)
                    _.each(d.list, function(item, index, list) {
                        if (index > 0) expect(item.id).to.be.equal(list[index - 1].id + 1)
                    })
                })
                .catch(e => console.log(e))
                .finally(_ => done())
        })
    })

    describe('Mock.mock( rurl, function(options) ) + GET + data', function() {
        it('', function(done) {
            var that = this
            var url = 'rurl_function.json'

            Mock.mock(/rurl_function\.json/, function(options) {
                expect(options).to.not.equal(undefined)
                expect(options.url).to.be.equal(url + '?foo=1')
                expect(options.type).to.be.equal('GET')
                expect(options.body).to.be.equal(undefined)
                return Mock.mock({
                    'list|1-10': [{
                        'id|+1': 1,
                        'email': '@EMAIL'
                    }]
                })
            })

            fetch(url + '?foo=1')
                .then(d => d.json())
                .then(d => {
                    that.test.title += url + ' => ' + stringify(d)
                    expect(d).to.have.property('list')
                        .that.be.an('array').with.length.within(1, 10)
                    _.each(d.list, function(item, index, list) {
                        if (index > 0) expect(item.id).to.be.equal(list[index - 1].id + 1)
                    })
                })
                .catch(e => console.log(e))
                .finally(_ => done())
        })
    })

    describe('Mock.mock( rurl, function(options) ) + POST + data', function() {
        it('', function(done) {
            var that = this
            var url = 'rurl_function.json'

            Mock.mock(/rurl_function\.json/, function(options) {
                expect(options).to.not.equal(undefined)
                expect(options.url).to.be.equal(url)
                expect(options.type).to.be.equal('POST')
                expect(options.body).to.deep.equal(stringify({ foo: 1 }))
                return Mock.mock({
                    'list|1-10': [{
                        'id|+1': 1,
                        'email': '@EMAIL'
                    }]
                })
            })

            fetch(url, {
                method: 'POST',
                body: stringify({ foo: 1 })
            })
                .then(d => d.json())
                .then(d => {
                    that.test.title += url + ' => ' + stringify(d)
                    expect(d).to.have.property('list')
                        .that.be.an('array').with.length.within(1, 10)
                    _.each(d.list, function(item, index, list) {
                        if (index > 0) expect(item.id).to.be.equal(list[index - 1].id + 1)
                    })
                })
                .catch(e => console.log(e))
                .finally(_ => done())
        })
    })

    describe('Mock.mock( rurl, rtype, template )', function() {
        it('', function(done) {
            var that = this
            var url = 'rurl_rtype_template.json'
            var count = 0

            Mock.mock(/rurl_rtype_template\.json/, 'get', {
                'list|1-10': [{
                    'id|+1': 1,
                    'email': '@EMAIL',
                    type: 'get'
                }]
            })
            Mock.mock(/rurl_rtype_template\.json/, 'post', {
                'list|1-10': [{
                    'id|+1': 1,
                    'email': '@EMAIL',
                    type: 'post'
                }]
            })

            fetch(url, {
                method: 'GET'
            })
                .then(d => d.json())
                .then(d => {
                    that.test.title += url + ' => ' + stringify(d)
                    expect(d).to.have.property('list')
                        .that.be.an('array').with.length.within(1, 10)
                    _.each(d.list, function(item, index, list) {
                        if (index > 0) expect(item.id).to.be.equal(list[index - 1].id + 1)
                    })
                    success()
                })
                .catch(e => console.log(e))
                .finally(_ => complete())

            fetch(url, {
                method: 'POST',
                body: stringify({ foo: 1 })
            })
                .then(d => d.json())
                .then(d => {
                    that.test.title += url + ' => ' + stringify(d)
                    expect(d).to.have.property('list')
                        .that.be.an('array').with.length.within(1, 10)
                    _.each(d.list, function(item, index, list) {
                        if (index > 0) expect(item.id).to.be.equal(list[index - 1].id + 1)
                    })
                    success()
                })
                .catch(e => console.log(e))
                .finally(_ => complete())

            function success( /*data*/ ) {
                count++
            }

            function complete() {
                if (count === 2) done()
            }
        })
    })

    describe('Mock.mock( rurl, rtype, function(options) )', function() {
        it('', function(done) {
            var that = this
            var url = 'rurl_rtype_function.json'
            var count = 0

            Mock.mock(/rurl_rtype_function\.json/, /get/, function(options) {
                expect(options).to.not.equal(undefined)
                expect(options.url).to.be.equal(url)
                expect(options.type).to.be.equal('GET')
                expect(options.body).to.be.equal(undefined)
                return {
                    type: options.type.toLowerCase()
                }
            })
            Mock.mock(/rurl_rtype_function\.json/, /post|put/, function(options) {
                expect(options).to.not.equal(undefined)
                expect(options.url).to.be.equal(url)
                expect(['POST', 'PUT']).to.include(options.type)
                expect(options.body).to.be.equal(undefined)
                return {
                    type: options.type.toLowerCase()
                }
            })

            fetch(url, {
                method: 'GET'
            })
                .then(d => {
                    return d.json()
                })
                .then(d => {
                    that.test.title += 'GET ' + url + ' => ' + stringify(data)
                    expect(d).to.have.property('type', 'get')
                    success()
                })
                .catch(e => console.log(e))
                .finally(_ => complete())

            fetch(url, {
                method: 'POST'
            })
                .then(d => d.json())
                .then(d => {
                    that.test.title += 'POST ' + url + ' => ' + stringify(data)
                    expect(d).to.have.property('type', 'post')
                    success()
                })
                .catch(e => console.log(e))
                .finally(_ => complete())

            fetch(url, {
                method: 'PUT'
            })
                .then(d => d.json())
                .then(d => {
                    that.test.title += 'PUT ' + url + ' => ' + stringify(data)
                    expect(d).to.have.property('type', 'put')
                    success()
                })
                .catch(e => console.log(e))
                .finally(_ => complete())

            function success( /*data*/ ) {
                count++
            }

            function complete() {
                if (count === 3) done()
            }

        })
    })
    describe('Mock.mock( rurl, rtype, function(options) ) + data', function() {
        it('', function(done) {
            var that = this
            var url = 'rurl_rtype_function.json'
            var count = 0

            Mock.mock(/rurl_rtype_function\.json/, /get/, function(options) {
                expect(options).to.not.equal(undefined)
                expect(options.url).to.be.equal(url + '?foo=1')
                expect(options.type).to.be.equal('GET')
                expect(options.body).to.be.equal(undefined)
                return {
                    type: options.type.toLowerCase()
                }
            })
            Mock.mock(/rurl_rtype_function\.json/, /post|put/, function(options) {
                expect(options).to.not.equal(undefined)
                expect(options.url).to.be.equal(url)
                expect(['POST', 'PUT']).to.include(options.type)
                expect(options.body).to.deep.equal(stringify({ foo: 1 }))
                return {
                    type: options.type.toLowerCase()
                }
            })

            fetch(url + '?foo=1', {
                method: 'GET'
            })
                .then(d => d.json())
                .then(d => {
                    that.test.title += 'GET ' + url + ' => ' + stringify(data)
                    expect(d).to.have.property('type', 'get')
                    success()
                })
                .catch(e => console.log(e))
                .finally(_ => complete())

            fetch(url, {
                method: 'POST',
                body: stringify({ foo: 1 })
            })
                .then(d => d.json())
                .then(d => {
                    that.test.title += 'POST ' + url + ' => ' + stringify(data)
                    expect(d).to.have.property('type', 'post')
                    success()
                })
                .catch(e => console.log(e))
                .finally(_ => complete())

            fetch(url, {
                method: 'PUT',
                body: stringify({ foo: 1 })
            })
                .then(d => d.json())
                .then(d => {
                    that.test.title += 'PUT ' + url + ' => ' + stringify(data)
                    expect(d).to.have.property('type', 'put')
                    success()
                })
                .catch(e => console.log(e))
                .finally(_ => complete())

            function success( /*data*/ ) {
                count++
            }

            function complete() {
                if (count === 3) done()
            }

        })
    })
})
