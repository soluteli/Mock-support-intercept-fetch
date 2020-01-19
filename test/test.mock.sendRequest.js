/* global console, require, chai, describe, before, it */
// fetch 请求（fetch HTTP Request）
var expect = chai.expect
var Mock, _

describe('sendRequest', function() {
    before(function(done) {
        require(['mock', 'underscore'], function() {
            Mock = arguments[0]
            Mock.sendRequest = true;
            _ = arguments[1]
            expect(Mock).to.not.equal(undefined)
            expect(_).to.not.equal(undefined)
            done()
        })
    })

    function stringify(json) {
        return JSON.stringify(json /*, null, 4*/)
    }

    describe('Mock.mock( rurl, template ) sendRequest', function() {
        it('', function(done) {
            var that = this
            var url = 'rurl_template.json'

            Mock.mock(/rurl_template.json/, {
                'list|1-10': [
                    {
                        'id|+1': 1,
                        email: '@EMAIL'
                    }
                ]
            })

            Mock.setup({
                // timeout: 100,
                timeout: '10-50'
            })

            fetch(url)
                .then(d => d.json())
                .then(d => {
                    that.test.title += url + ' => ' + stringify(d)
                    expect(d)
                        .to.have.property('list')
                        .that.be.an('array')
                        .with.length.within(1, 10)
                    _.each(d.list, function(item, index, list) {
                        if (index > 0)
                            expect(item.id).to.be.equal(list[index - 1].id + 1)
                    })
                })
                .catch(e => console.log(e))
                .finally(_ => done())
        })
    })

    describe('Mock.mock( rurl, template ) sendRequest', function() {
        it('', function(done) {
            var that = this
            var url = 'rurl_template.json'

            Mock.mock(/rurl_template.json/, {
                'list|1-10': [
                    {
                        'id|+1': 1,
                        email: '@EMAIL'
                    }
                ]
            })

            Mock.setup({
                // timeout: 100,
                timeout: '10-50'
            })
            $.ajax({
                url: url,
                dataType: 'json'
            })
                .done(function(data /*, textStatus, jqXHR*/) {
                    that.test.title += url + ' => ' + stringify(data)
                    expect(data)
                        .to.have.property('list')
                        .that.be.an('array')
                        .with.length.within(1, 10)
                    _.each(data.list, function(item, index, list) {
                        if (index > 0)
                            expect(item.id).to.be.equal(list[index - 1].id + 1)
                    })
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR, textStatus, errorThrown)
                })
                .always(function() {
                    done()
                })
        })
    })
})
