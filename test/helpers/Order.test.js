import {expect} from 'chai';
import {helpers} from '../../src/index.js';
import {fixtures} from '../../src/index.js';
import moment from 'moment-timezone';

const Order = helpers.Order;

describe('helpers: Order', () => {
    describe('getOrderCharges', () => {
        it('returns the orderCharges according to the order', () => {

            const emptyCharges = Order.getOrderCharges({});
            expect(emptyCharges).to.be.empty;

            let order = {};
            let chargesV2 = [];

            order.delivery = {
                type: 'takeout',
                time: moment()
            };

            order.orderItems = [
                fixtures.OrderItem().itemId('itemid').price(1000).val()
            ];

            chargesV2 = [
                fixtures.ChargeV2().id('charge1').percentageDiscount({percentage:10000}).val(),
                fixtures.ChargeV2().id('charge2').min(500000).percentageDiscount({percentage:10000}).val(),
                fixtures.ChargeV2().id('charge3').min(500000).percentageDiscount({percentage:10000}).mandatory().val(),
                fixtures.ChargeV2().id('charge4').deliveryTypes(['takeout']).percentageDiscount({percentage:20000, itemIds:['itemid2']}).val(),
                fixtures.ChargeV2().id('charge5').deliveryTypes(['takeout']).percentageDiscount({percentage:20000, itemIds:['itemid'], chargeIds:['charge6', 'charge7']}).val(),
                fixtures.ChargeV2().id('charge6').percentageDiscount({percentage:20000, itemIds:['itemid'], chargeIds:['charge7']}).val(),
                fixtures.ChargeV2().id('charge7').percentageDiscount({percentage:10000}).val(),
            ];

            const orderCharges = Order.getOrderCharges({order, chargesV2});
            expect(orderCharges).to.deep.equal([
                {chargeId:'charge1', amount:-100},
                {chargeId:'charge3', amount:0},
                {chargeId:'charge4', amount:-0}, /* Apparently chai doesn't thing 0 === -0 */
                {chargeId:'charge5', amount:-144},
                {chargeId:'charge6', amount:-180},
                {chargeId:'charge7', amount:-100},
            ]);

            order.delivery = {
                type: 'takeout',
                time: new Date().getTime()
            };
            const orderCharges2 = Order.getOrderCharges({order, chargesV2});
            expect(orderCharges2).to.deep.equal([
                {chargeId:'charge1', amount:-100},
                {chargeId:'charge3', amount:0},
                {chargeId:'charge4', amount:-0}, /* Apparently chai doesn't thing 0 === -0 */
                {chargeId:'charge5', amount:-144},
                {chargeId:'charge6', amount:-180},
                {chargeId:'charge7', amount:-100},
            ]);
        });
    });
});
