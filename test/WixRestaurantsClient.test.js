import { expect }         from 'chai';
import { XMLHttpRequest } from 'xhr2';
import WixRestaurantsDriver     from './WixRestaurantsDriver';
import {WixRestaurantsClient}   from '../src/index.js';

describe('WixRestaurantsClient', () => {
    const port           = 8086;
    const wixRestaurantsClient = new WixRestaurantsClient({ XMLHttpRequest, apiUrl : `http://localhost:${port}/` });
    const driver         = new WixRestaurantsDriver({ port });

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
            }).returns({
                value : someValue
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
            }).errors({
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
                apiUrl : `http://localhost:${port}/`,
                XMLHttpRequest,
                timeout: 10
            });

            driver.requestFor({
                request : someRequest
            }).returns({
                value : someValue,
                delay : 100
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

        it ('gracefully fails when network is down', done => {
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

        it ('gracefully fails on protocol error', done => {
            driver.requestFor({
                request : someRequest
            }).protocolErrors();

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
