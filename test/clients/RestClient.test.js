import { expect } from 'chai';
import { clients, testkit } from '../../src/index';
import { NockNockable } from 'nockable';

describe('RestClient', () => {
    const someQuery = '?some=query';
    const somePath = '/somePath';
    const somePathWithQuery = `${somePath}${someQuery}`;
    const nockable = new NockNockable({endpoint: 'https://api.wixrestaurants.com/v2'});
    const restClient = new clients.createRestClient({baseUrl: nockable.endpoint});
    const someResponse = 'someResponse';
    const someAccessToken = 'someAccessToken';
    const someParams = {some: 'params'};
    let driver;

    function beforeAndAfter() {
        before(() => {
            return driver.start();
        });

        after(() => {
            return driver.stop();
        });

        beforeEach(() => {
            return driver.reset();
        });
    }

    function test() {
        describe('GET', () => {
            it('should succeed with query - no auth', async () => {
                driver.on(somePathWithQuery, 'get', null)
                    .succeedWith(someResponse);

                const result = await restClient(somePathWithQuery, 'get', null);
                expect(result).to.equal(someResponse);
            });

            it('should succeed with query - with auth', async () => {
                driver.on(somePathWithQuery, 'get', null, {
                    type: 'Bearer',
                    credentials: someAccessToken,
                }).succeedWith(someResponse);

                const result = await restClient(somePathWithQuery, 'get', null, {
                    type: 'Bearer',
                    credentials: someAccessToken,
                });
                expect(result).to.equal(someResponse);
            });

            it('should succeed with params - no auth', async () => {
                driver.on(somePathWithQuery, 'get', null)
                    .succeedWith(someResponse);

                const result = await restClient(somePath, 'get', {some: 'query'});
                expect(result).to.equal(someResponse);
            });

            it('should succeed with params - with auth', async () => {
                driver.on(somePathWithQuery, 'get', null, {
                    type: 'Bearer',
                    credentials: someAccessToken,
                }).succeedWith(someResponse);

                const result = await restClient(somePath, 'get', {some: 'query'}, {
                    type: 'Bearer',
                    credentials: someAccessToken,
                });
                expect(result).to.equal(someResponse);
            });
        });

        describe('POST', () => {
            it('should succeed with no params - no auth', async () => {
                driver.on(somePath, 'post', null)
                    .succeedWith(someResponse);

                const result = await restClient(somePath, 'post', null);
                expect(result).to.equal(someResponse);
            });

            it('should succeed with no params - with auth', async () => {
                driver.on(somePath, 'post', null, {
                    type: 'Bearer',
                    credentials: someAccessToken,
                }).succeedWith(someResponse);

                const result = await restClient(somePath, 'post', null, {
                    type: 'Bearer',
                    credentials: someAccessToken,
                });
                expect(result).to.equal(someResponse);
            });

            it('should succeed with params - no auth', async () => {
                driver.on(somePath, 'post', someParams)
                    .succeedWith(someResponse);

                const result = await restClient(somePath, 'post', someParams);
                expect(result).to.equal(someResponse);
            });

            it('should succeed with params - with auth', async () => {
                driver.on(somePath, 'post', someParams, {
                    type: 'Bearer',
                    credentials: someAccessToken,
                }).succeedWith(someResponse);

                const result = await restClient(somePath, 'post', someParams, {
                    type: 'Bearer',
                    credentials: someAccessToken,
                });
                expect(result).to.equal(someResponse);
            });
        });
    }

    describe('node environment', () => {
        driver = new testkit.RestClientDriver({ nockable, environment: 'browser' });
        beforeAndAfter();
        test();
    });

    describe('browser environment', () => {
        driver = new testkit.RestClientDriver({ nockable, environment: 'node' });
        beforeAndAfter();
        test();
    });
});
