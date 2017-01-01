import { expect }         from 'chai';
import { XMLHttpRequest } from 'xhr2';
import {WixRestaurantsClient} from '../../src/index.js';
import {WixRestaurantsDriver} from '../../src/testkit';

describe('WixRestaurantsClient', () => {
    const host = '' + Math.random() + '.com';
    const version = '' + Math.random();
    const wixRestaurantsClient = new WixRestaurantsClient({XMLHttpRequest, apiUrl:`https://${host}/${version}`});
    const driver = new WixRestaurantsDriver({type:'nock', params:{url:`https://${host}`, version}});

    before(() => {
        driver.start();
    });

    after(() => {
        driver.stop();
    });

    beforeEach(() => {
        driver.reset();
    });

    describe('request', () => {
        const someRequest = { type : 'SOME_TYPE' };
        const someValue   = 'SOME_VALUE';

        it ('sends a request and returns the value on success', done => {
            driver.requestFor({
                request : someRequest
            }).succeedWith({
                response:{ value : someValue }
            });

            wixRestaurantsClient.request({
                request : someRequest,
                callback : response => {
                    expect(response.value).to.deep.equal(someValue);
                    done();
                }
            });
        });

        it ('gracefully fails when response indicates error', done => {
            const someCode        = 'SOME_CODE';
            const someDescription = 'SOME_DESCRIPTION';
            driver.requestFor({
                request : someRequest
            }).failWith({
                code : someCode,
                description : someDescription
            });

            wixRestaurantsClient.request({
                request : someRequest,
                callback : response => {
                    expect(response.error).to.equal(someCode);
                    expect(response.errorMessage).to.equal(someDescription);
                    done();
                }
            });
        });

        it ('gracefully fails on timeout', done => {
            const wixRestaurantsClientWithTimeout = new WixRestaurantsClient({
                apiUrl : `https://${host}/${version}`,
                XMLHttpRequest,
                timeout: 10
            });

            driver.requestFor({
                request : someRequest
            }).delayBy({
                ms:1000
            }).succeedWith({
                response: { value : someValue }
            });

            wixRestaurantsClientWithTimeout.request({
                request : someRequest,
                callback : response => {
                    expect(response.error).to.equal('timeout');
                    expect(response.errorMessage).to.not.be.empty;
                    done();
                }
            });
        });

        it('gracefully fails when network is down', done => {
            const invalidUrl = 'http://whatever.noexist';
            const wixRestaurantsClientWithInvalidEndpointUrl = new WixRestaurantsClient({
                XMLHttpRequest,
                apiUrl : invalidUrl
            });

            wixRestaurantsClientWithInvalidEndpointUrl.request({
                request : someRequest,
                callback : response => {
                    expect(response.error).to.equal('network_down');
                    expect(response.errorMessage).to.not.be.empty;
                    done();
                }
            });
        });

        it('gracefully fails on protocol error', done => {
            driver.requestFor({
                request : someRequest
            }).failWithProtocolError();

            wixRestaurantsClient.request({
                request : someRequest,
                callback : response => {
                    expect(response.error).to.equal('protocol');
                    expect(response.errorMessage).to.not.be.empty;
                    done();
                }
            });
        });
    });
});
