import { assert, expect }         from 'chai';
import { XMLHttpRequest } from 'xhr2';
import {WixRestaurantsClient} from '../../src/index';
import {WixRestaurantsDriver} from '../../src/testkit';

global.XMLHttpRequest = XMLHttpRequest;

describe('WixRestaurantsClient', () => {
    const url = 'http://www.example.org'
    const version = 'v1.1'
    const endpointUrl = `${url}/${version}`;
    const invalidEndpointUrl = 'http://whatever.noexist';
    const wixRestaurantsClient = new WixRestaurantsClient({endpointUrl});
    const driver = new WixRestaurantsDriver({
        type: 'nock',
        params: {
            url,
            version
        }
    });

    before(() => {
        driver.start();
    });

    after(() => {
        driver.stop();
    });

    beforeEach(() => {
        driver.reset();
    });
    
    const someRestaurant = {
        type: 'restaurant',
        id: 'some-restaurant-id'
    }
    const someError = {
        code: 'invalid_data',
        description: 'invalid data'
    }
    const allFields = null;
    
    // Applies to all requests, using getOrganization just for example
    describe('any method', () => {
        it ('gracefully fails on error', () => {
            driver.getOrganization({
                organizationId: someRestaurant.id,
                fields: allFields
            }).fails({
                error: someError
            });
            
            return wixRestaurantsClient.getOrganization({
                organizationId: someRestaurant.id,
                fields: allFields
            }).then((organization) => {
                assert.fail(false, true, 'expected error');
            }, (error) => {
                expect(error).to.deep.equal(someError)
            });
        });

        it.only ('gracefully fails on timeout', () => {
            const wixRestaurantsClientWithTimeout = new WixRestaurantsClient({
                endpointUrl,
                timeout: 10
            });

            driver.getOrganization({
                organizationId: someRestaurant.id,
                fields: allFields
            }).delayBy({
                ms: 1000
            }).succeedWith({
                value: someRestaurant
            });
            
            return wixRestaurantsClient.getOrganization({
                organizationId: someRestaurant.id,
                fields: allFields
            }).then((organization) => {
                assert.fail(false, true, 'expected error');
            }, (error) => {
                expect(error.code).to.equal('timeout');
                expect(error.description).to.not.be.empty;
            });
        });

        it('gracefully fails when network is down', () => {
            const wixRestaurantsClientWithInvalidEndpointUrl = new WixRestaurantsClient({
                endpointUrl : invalidEndpointUrl
            });
            
            return wixRestaurantsClient.getOrganization({
                organizationId: someRestaurant.id,
                fields: allFields
            }).then((organization) => {
                assert.fail(false, true, 'expected error');
            }, (error) => {
                expect(error.code).to.equal('network_down');
                expect(error.description).to.not.be.empty;
            });
        });

        it('gracefully fails on protocol error', () => {
            driver.getOrganization({
                organizationId: someRestaurant.id,
                fields: allFields
            }).failsWithProtocolError();
            
            return wixRestaurantsClient.getOrganization({
                organizationId: someRestaurant.id,
                fields: allFields
            }).then((organization) => {
                assert.fail(false, true, 'expected error');
            }, (error) => {
                expect(error.code).to.equal('protocol');
                expect(error.description).to.not.be.empty;
            });
        });
    });
    
    describe('getOrganization', () => {
        it ('successfully returns the organization', () => {
            driver.getOrganization({
                organizationId: someRestaurant.id,
                fields: allFields
            }).returns({
                value: someRestaurant
            });

            return wixRestaurantsClient.getOrganization({
                organizationId: someRestaurant.id,
                fields: allFields
            }).then((organization) => {
                expect(organization).to.deep.equal(someRestaurant);
            })
        });
    });
});
