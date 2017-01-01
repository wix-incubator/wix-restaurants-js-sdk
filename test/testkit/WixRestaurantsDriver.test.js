import {expect} from 'chai';
import {WixRestaurantsClient} from '../../src/index.js';
import {WixRestaurantsDriver} from '../../src/testkit';
import {XMLHttpRequest} from 'xhr2';
import _ from 'lodash';

describe('WixRestaurantsDriver', () => {

    function tests(driver, client) {

        before(() => {
            driver.start();
        });

        after(() => {
            driver.stop();
        });

        beforeEach(() => {
            driver.reset();
        });


        it('mocks a request with a successful return value', (done) => {

            const request = {type:'get_organization', organizationId:'1234'};
            const response = {timestamp:1234, value:{organization:{id:'1234'}}};

            driver.requestFor({request}).succeedWith({response});

            client.request({request, callback:(res) => {
                expect(res).to.deep.equal(response);
                done();
            }});
        });

        it('mocks a request (function) with a successful return (function) value', (done) => {

            const request = {type:'get_organization', organizationId:'4567'};
            const response = {timestamp:1234, value:{organization:{id:'4567'}}};

            driver.requestFor({request:(req) => _.isEqual(req, request)}).succeedWith({response:() => response});

            client.request({request, callback:(res) => {
                expect(res).to.deep.equal(response);
                done();
            }});
        });

        it('mocks a request with a successful return value (including delay)', (done) => {

            const request = {type:'get_organization', organizationId:'1234'};
            const response = {timestamp:1234, value:{organization:{id:'1234'}}};
            const ms = 200;

            driver.requestFor({request}).delayBy({ms}).succeedWith({response});

            const start = new Date().getTime();
            client.request({request, callback:(res) => {
                expect(new Date().getTime() - start).to.be.within(150, 250);
                expect(res).to.deep.equal(response);
                done();
            }});
        });

        it('mocks a request with a an error value', (done) => {

            const request = {type:'get_organization', organizationId:'1234'};
            const code = 'error_code';
            const description = 'description';

            driver.requestFor({request}).failWith({code, description});

            client.request({request, callback:(res) => {
                expect(res).to.deep.equal({error:code, errorMessage: description});
                done();
            }});
        });

        it('mocks a request with a a protocol error value', (done) => {

            const request = {type:'get_organization', organizationId:'1234'};

            driver.requestFor({request}).failWithProtocolError();

            client.request({request, callback:(res) => {
                expect(res).to.deep.equal({
                    error: 'protocol',
                    errorMessage: 'protocol error'
                });
                done();
            }});
        });
    }

    describe('[when type="nock"]', () => {
        const host = 'dsadsadas' + Math.random() + '.com';
        const version = '' + Math.random();

        const driver = new WixRestaurantsDriver({type:'nock', params:{url:`https://${host}`, version}});
        const client = new WixRestaurantsClient({XMLHttpRequest, apiUrl:`https://${host}/${version}`, timeout:1000});

        tests(driver, client);
    });

    describe('[when type="localNetwork"]', () => {
        const port = 8099;
        const url = 'http://localhost:8099';

        const driver = new WixRestaurantsDriver({type:'localNetwork', params:{port}});
        const client = new WixRestaurantsClient({XMLHttpRequest, apiUrl:url});

        tests(driver, client);
    });
});
