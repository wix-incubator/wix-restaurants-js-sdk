import { assert, expect } from 'chai';
import { clients, testkit } from '../../src/index';
import { NockNockable } from 'nockable';

// TODO: WIP, skipping tests
describe.skip('WixRestaurantsAnalyticsClient', () => {
    const nockable = new NockNockable({endpoint: 'https://analytics.wixrestaurants.com/v1'});
    const invalidBaseUrl = 'http://whatever.noexist/';
    const wixRestaurantsAnalyticsClient = new clients.WixRestaurantsAnalyticsClient({baseUrl: nockable.endpoint});
    const driver = new testkit.WixRestaurantsAnalyticsDriver({nockable});

    before(() => {
        return driver.start();
    });

    after(() => {
        return driver.stop();
    });

    beforeEach(() => {
        return driver.reset();
    });

    const someAccessToken = 'some-access-token';
    const someRestaurantId = 'some-restaurant-id';
    const someChainId = 'some-chain-id';
    const someMetric = clients.Metrics.price;
    const somePeriod = clients.Periods.month;
    const someTimezone = 'Asia/Jerusalem';
    const someSince = 0;
    const someUntil = 1231006505; // Saturday, January 3, 2009 6:15:05 PM (GMT)

    const someStats = [ { startTime: '1970-01-01', count: 0, total: 0 } ];

    // Applies to all requests, using restaurantOrderStats just for example
    describe('any method', () => {
        it ('gracefully fails on error', () => {
            const someError = {
                type: 'https://analytics.wixrestaurants.com/errors/some-error',
                title: 'Some title.'
            };

            driver.restaurantOrderStats({
                accessToken: someAccessToken,
                restaurantId: someRestaurantId,
                metric: someMetric,
                period: somePeriod,
                timezone: someTimezone,
                since: someSince,
                until: someUntil
            }).failWith(
                someError
            );

            return wixRestaurantsAnalyticsClient.restaurantOrderStats({
                accessToken: someAccessToken,
                restaurantId: someRestaurantId,
                metric: someMetric,
                period: somePeriod,
                timezone: someTimezone,
                since: someSince,
                until: someUntil
            }).then((/*stats*/) => {
                assert.fail(false, true, 'expected error');
            }, (error) => {
                expect(error).to.deep.equal(someError);
            });
        });

        it('gracefully fails on timeout', () => {
            const wixRestaurantsAnalyticsClientWithTimeout = new clients.WixRestaurantsAnalyticsClient({
                baseUrl: nockable.endpoint,
                timeout: 10
            });

            driver.restaurantOrderStats({
                accessToken: someAccessToken,
                restaurantId: someRestaurantId,
                metric: someMetric,
                period: somePeriod,
                timezone: someTimezone,
                since: someSince,
                until: someUntil
            }).delayBy({
                ms: 1000
            }).succeedWith({
                stats: someStats
            });

            return wixRestaurantsAnalyticsClientWithTimeout.restaurantOrderStats({
                accessToken: someAccessToken,
                restaurantId: someRestaurantId,
                metric: someMetric,
                period: somePeriod,
                timezone: someTimezone,
                since: someSince,
                until: someUntil
            }).then((/*stats*/) => {
                assert.fail(false, true, 'expected error');
            }, (error) => {
                expect(error.type).to.equal('https://analytics.wixrestaurants.com/errors/timeout');
                expect(error.title).to.not.be.empty;
            });
        });

        it('gracefully fails when network is down', () => {
            const wixRestaurantsAnalyticsClientWithInvalidBaseUrl = new clients.WixRestaurantsAnalyticsClient({
                baseUrl: invalidBaseUrl
            });

            return wixRestaurantsAnalyticsClientWithInvalidBaseUrl.restaurantOrderStats({
                accessToken: someAccessToken,
                restaurantId: someRestaurantId,
                metric: someMetric,
                period: somePeriod,
                timezone: someTimezone,
                since: someSince,
                until: someUntil
            }).then((/*stats*/) => {
                assert.fail(false, true, 'expected error');
            }, (error) => {
                expect(error.type).to.equal('https://analytics.wixrestaurants.com/errors/network');
                expect(error.title).to.not.be.empty;
            });
        });

        it('gracefully fails on protocol error', () => {
            driver.restaurantOrderStats({
                accessToken: someAccessToken,
                restaurantId: someRestaurantId,
                metric: someMetric,
                period: somePeriod,
                timezone: someTimezone,
                since: someSince,
                until: someUntil
            }).failWithProtocolError();

            return wixRestaurantsAnalyticsClient.restaurantOrderStats({
                accessToken: someAccessToken,
                restaurantId: someRestaurantId,
                metric: someMetric,
                period: somePeriod,
                timezone: someTimezone,
                since: someSince,
                until: someUntil
            }).then((/*stats*/) => {
                assert.fail(false, true, 'expected error');
            }, (error) => {
                expect(error.type).to.equal('https://analytics.wixrestaurants.com/errors/protocol');
                expect(error.title).to.not.be.empty;
            });
        });
    });

    describe('restaurantOrderStats', () => {
        it('returns the restaurant order stats', () => {
            driver.restaurantOrderStats({
                accessToken: someAccessToken,
                restaurantId: someRestaurantId,
                metric: someMetric,
                period: somePeriod,
                timezone: someTimezone,
                since: someSince,
                until: someUntil
            }).succeedWith({
                stats: someStats
            });

            return wixRestaurantsAnalyticsClient.restaurantOrderStats({
                accessToken: someAccessToken,
                restaurantId: someRestaurantId,
                metric: someMetric,
                period: somePeriod,
                timezone: someTimezone,
                since: someSince,
                until: someUntil
            }).then((stats) => {
                expect(stats).to.deep.equal(someStats);
            });
        });
    });

    describe('chainOrderStats', () => {
        it('returns the chain order stats', () => {
            driver.chainOrderStats({
                accessToken: someAccessToken,
                chainId: someChainId,
                metric: someMetric,
                period: somePeriod,
                timezone: someTimezone,
                since: someSince,
                until: someUntil
            }).succeedWith({
                stats: someStats
            });

            return wixRestaurantsAnalyticsClient.chainOrderStats({
                accessToken: someAccessToken,
                chainId: someChainId,
                metric: someMetric,
                period: somePeriod,
                timezone: someTimezone,
                since: someSince,
                until: someUntil
            }).then((stats) => {
                expect(stats).to.deep.equal(someStats);
            });
        });
    });
});
