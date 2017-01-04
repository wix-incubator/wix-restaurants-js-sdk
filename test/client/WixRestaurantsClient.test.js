import { assert, expect }         from 'chai';
import { XMLHttpRequest } from 'xhr2';
import {WixRestaurantsClient} from '../../src/index';
import {WixRestaurantsDriver} from '../../src/testkit';
import _ from 'lodash';

global.XMLHttpRequest = XMLHttpRequest;

describe('WixRestaurantsClient', () => {
    const url = 'http://www.example.org';
    const version = 'v1.1';
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
        id: 'some-restaurant-id',
        locale: 'en_US',
        locales: ['en_US'],
        currency: 'USD'
    };
    const someMenu = {
        modified: 1478093212332,
        items: [{"id":"7285589409963911","restaurantId":"8830975305376234","title":{"en_US":"Carpaccio"},"description":{"en_US":"Thinly sliced beef with extra virgin olive oil, lemon, arugola, and shaved parmigiano reggiano."},"price":1000},{"id":"580639693308748","restaurantId":"8830975305376234","title":{"en_US":"Calamari Fritti"},"description":{"en_US":"Squid, lightly dusted in flour, deep fried, and served with fresh herbs, fried lemon, zucchini, and a spicy cucumber r?moulade."},"price":1000,"picture":"https://lh3.googleusercontent.com/RIMA3qJ43WTOMGr7kD1SCeXaamPyLUyPHLu0id3E_DQo-3lQkE89dZlm7qu6QzkaGjSfzwrhcmvK97ozsUgjyw","blobs":{"logo":{"id":"1696531050","url":"https://lh3.googleusercontent.com/RIMA3qJ43WTOMGr7kD1SCeXaamPyLUyPHLu0id3E_DQo-3lQkE89dZlm7qu6QzkaGjSfzwrhcmvK97ozsUgjyw"}}},{"id":"1364562365249646","restaurantId":"8830975305376234","title":{"en_US":"Bresaola Rughetta e Parmigiano"},"description":{"en_US":"Thinly sliced air dried aged beef prepared carpaccio style with\nextra virgin olive oil, lemon, arugola, and shavings of parmigiano reggiano."},"price":1000},{"id":"8254231576335078","restaurantId":"8830975305376234","title":{"en_US":"Insalata Tricolore"},"description":{"en_US":"Radicchio, belgian endive, and arugola with a balsamic vinaigrette."},"price":800,"picture":"https://lh3.googleusercontent.com/UTHe6DdXaQ0o26d7oleO9YWhCmSNl15_LunPX6H6PqsO__NriWvWAm6Auo8ugEPTEpM-WHKWQHCJ0aC0qUxQtg","blobs":{"logo":{"id":"2501963d-5ac3-4490-8677-b67b1d5fb0f4","url":"https://lh3.googleusercontent.com/UTHe6DdXaQ0o26d7oleO9YWhCmSNl15_LunPX6H6PqsO__NriWvWAm6Auo8ugEPTEpM-WHKWQHCJ0aC0qUxQtg"}}},{"id":"4538038090707527","restaurantId":"8830975305376234","title":{"en_US":"Caprese"},"description":{"en_US":"Salad of fresh tomatoes and housemade fresh mozzarella dressed with extra virgin olive oil and fresh basil."},"price":900,"picture":"https://lh3.googleusercontent.com/R4gbpwYBdIhANu3aPjzQdLx--kfffsfpUC8in1Z3w1ZP46x4y56AFJM_ffM4eMP4WMLQYGH6rIZ80mkioeNq2g","blobs":{"logo":{"id":"1708571042","url":"https://lh3.googleusercontent.com/R4gbpwYBdIhANu3aPjzQdLx--kfffsfpUC8in1Z3w1ZP46x4y56AFJM_ffM4eMP4WMLQYGH6rIZ80mkioeNq2g"}}},{"id":"4135591530877631","restaurantId":"8830975305376234","title":{"en_US":"Chopped Salad"},"description":{"en_US":"Our version with romaine, tomato, carrots, cucumber, radicchio, corn, cheddar cheese, palm hearts, and pancetta tossed in a three peppercorn parmigiano vinaigrette."},"price":900,"picture":"https://lh3.googleusercontent.com/lpAmMt8CnGUzVqWMkBrmLUEqLrv4VaqzoGMoqvUd1XBIPVlcMr-N2fwwudvnMIHUmuNGIUcW5fMOBOvIFTkd","blobs":{"logo":{"id":"1701251044","url":"https://lh3.googleusercontent.com/lpAmMt8CnGUzVqWMkBrmLUEqLrv4VaqzoGMoqvUd1XBIPVlcMr-N2fwwudvnMIHUmuNGIUcW5fMOBOvIFTkd"}}},{"id":"3840387583130477","restaurantId":"8830975305376234","title":{"en_US":"Salmone"},"description":{"en_US":"Salmon."},"price":2600,"picture":"https://lh3.googleusercontent.com/ppmCo58QaThDKFLPTzd2-CUTwpK10QtLq0M4FDvElYmvgr8tTcaWReCGGKiklnOuyQVi_zIcqGjR_t_Ri6upyQ","blobs":{"logo":{"id":"1708401044","url":"https://lh3.googleusercontent.com/ppmCo58QaThDKFLPTzd2-CUTwpK10QtLq0M4FDvElYmvgr8tTcaWReCGGKiklnOuyQVi_zIcqGjR_t_Ri6upyQ"}}},{"id":"2459507507152902","restaurantId":"8830975305376234","title":{"en_US":"Costata di Manzo"},"description":{"en_US":"Ribeye."},"price":3100,"picture":"https://lh3.googleusercontent.com/7E7X8g2GR6Hja-hgn1VwVgCM2beBlld6uw2ofsInN_YoxigPedie-yhnjyMZPy5s6dNTxW3W8ibOd6-Q5xTWhw","blobs":{"logo":{"id":"1697341043","url":"https://lh3.googleusercontent.com/7E7X8g2GR6Hja-hgn1VwVgCM2beBlld6uw2ofsInN_YoxigPedie-yhnjyMZPy5s6dNTxW3W8ibOd6-Q5xTWhw"}}},{"id":"1712127355705869","restaurantId":"8830975305376234","title":{"en_US":"Coke"},"variations":[{"title":{"en_US":"We offer the following sizes:"},"itemIds":["6011645467251806","8131262756128535"],"minNumAllowed":1,"maxNumAllowed":1,"prices":{"6011645467251806":199,"8131262756128535":299}}]},{"id":"6011645467251806","restaurantId":"8830975305376234","title":{"en_US":"Small (12 fl oz)"},"price":199},{"id":"8131262756128535","restaurantId":"8830975305376234","title":{"en_US":"Large (20 fl oz)"},"price":299},{"id":"8384777276263641","restaurantId":"8830975305376234","title":{"en_US":"Small"}},{"id":"4020579968451736","restaurantId":"8830975305376234","title":{"en_US":"Medium"}},{"id":"6709541687878791","restaurantId":"8830975305376234","title":{"en_US":"Large"}},{"id":"29258699-de0c-43a4-8c4c-1fdc53bdff02","restaurantId":"8830975305376234","title":{"en_US":"Orange juice"},"price":190,"picture":"https://media.wixapps.net/ggl-106739423631341017825/images/12364ef1372943fa8b543c06e001bde6~mv2/","blobs":{"logo":{"id":"fc9d9bbc-eee5-476a-8896-b1dc978e96e4","url":"https://media.wixapps.net/ggl-106739423631341017825/images/12364ef1372943fa8b543c06e001bde6~mv2/"}}}],
        sections: [{"id":"1","title":{"en_US":"Lunch menu"},"description":{"en_US":"Available daily, 12pm-3pm"},"children":[{"id":"8","title":{"en_US":"Appetizers"},"description":{"en_US":"Get busy with these dishes."},"itemIds":["7285589409963911","580639693308748","1364562365249646"]},{"id":"16.1432199531864","title":{"en_US":"Insalate"},"itemIds":["8254231576335078","4538038090707527","4135591530877631"]},{"id":"35.1432199717577","title":{"en_US":"Simply Grilled"},"description":{"en_US":"(served with fresh vegetables and starch)"},"itemIds":["3840387583130477","2459507507152902"]},{"id":"48.1432199818848","title":{"en_US":"Beverages"},"itemIds":["1712127355705869","29258699-de0c-43a4-8c4c-1fdc53bdff02"]}],"properties":{"com.wix.restaurants":"{\"systems\":[\"OLO\"]}"}}],
        chargesV2: []
    };
    const someRestaurantFull = {
        type: 'restaurant_full',
        restaurant: someRestaurant,
        menu: someMenu
    };
    const someError = {
        code: 'invalid_data',
        description: 'invalid data'
    };
    const allFields = null;

    const someNewOrder = {
        developerId: 'org.example',
        restaurantId: someRestaurant.id,
        locale: someRestaurant.locale,
        orderItems: [{
            itemId: '7285589409963911',
            price: 1000
        }],
        comment: 'I\'m allergic to nuts.',
        price: 1000,
        currency: someRestaurant.currency,
        contact: {
            firstName: 'John',
            lastName: 'Doe',
            phone: '+12024561111',
            email: 'johndoe@example.org'
        },
        delivery: {
            type: 'takeout'
        },
        payments: [{
            type: 'cash',
            amount: 1000
        }]
    };

    const now = new Date().getTime();
    const someOrder = _.extend(someNewOrder, {
        id: 'some-order-id',
        created: now,
        modified: now
    });

    // Applies to all requests, using getOrganization just for example
    describe('any method', () => {
        it ('gracefully fails on error', () => {
            driver.getOrganization({
                organizationId: someRestaurant.id,
                fields: allFields
            }).failWith(
                someError
            );

            return wixRestaurantsClient.getOrganization({
                organizationId: someRestaurant.id,
                fields: allFields
            }).then((/*organization*/) => {
                assert.fail(false, true, 'expected error');
            }, ({error}) => {
                expect(error).to.deep.equal(someError);
            });
        });

        it('gracefully fails on timeout', () => {
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

            return wixRestaurantsClientWithTimeout.getOrganization({
                organizationId: someRestaurant.id,
                fields: allFields
            }).then((/*organization*/) => {
                assert.fail(false, true, 'expected error');
            }, ({error}) => {
                expect(error.code).to.equal('timeout');
                expect(error.description).to.not.be.empty;
            });
        });

        it('gracefully fails when network is down', () => {
            const wixRestaurantsClientWithInvalidEndpointUrl = new WixRestaurantsClient({
                endpointUrl : invalidEndpointUrl
            });

            return wixRestaurantsClientWithInvalidEndpointUrl.getOrganization({
                organizationId: someRestaurant.id,
                fields: allFields
            }).then((/*organization*/) => {
                assert.fail(false, true, 'expected error');
            }, ({error}) => {
                expect(error.code).to.equal('network_down');
                expect(error.description).to.not.be.empty;
            });
        });

        it('gracefully fails on protocol error', () => {
            driver.getOrganization({
                organizationId: someRestaurant.id,
                fields: allFields
            }).failWithProtocolError();

            return wixRestaurantsClient.getOrganization({
                organizationId: someRestaurant.id,
                fields: allFields
            }).then((/*organization*/) => {
                assert.fail(false, true, 'expected error');
            }, ({error}) => {
                expect(error.code).to.equal('protocol');
                expect(error.description).to.not.be.empty;
            });
        });
    });

    describe('getOrganization', () => {
        it('returns the organization (business info only)', () => {
            driver.getOrganization({
                organizationId: someRestaurant.id,
                fields: allFields
            }).succeedWith({
                value: someRestaurant
            });

            return wixRestaurantsClient.getOrganization({
                organizationId: someRestaurant.id,
                fields: allFields
            }).then((organization) => {
                expect(organization).to.deep.equal(someRestaurant);
            });
        });
    });

    describe('getOrganizationFull', () => {
        it('returns the full organization info', () => {
            driver.getOrganizationFull({
                organizationId: someRestaurant.id,
                fields: allFields
            }).succeedWith({
                value: someRestaurantFull
            });

            return wixRestaurantsClient.getOrganizationFull({
                organizationId: someRestaurant.id,
                fields: allFields
            }).then((full) => {
                expect(full).to.deep.equal(someRestaurantFull);
            });
        });
    });

    describe('submitOrder', () => {
        it('submits the order as guest customer', () => {
            driver.submitOrder({
                order: someNewOrder
            }).succeedWith({
                value: someOrder
            });

            return wixRestaurantsClient.submitOrder({
                order: someNewOrder
            }).then((order) => {
                expect(order).to.deep.equal(someOrder);
            });
        });
    });
});
