import {expect} from 'chai';
import {helpers} from '../../src/index.js';
import {fixtures} from '../../src/index.js';

const Order = helpers.Order;

describe('helpers: Order', () => {
    describe('getOrderCharges', () => {
        it('returns the orderCharges according to the order', () => {

            const emptyCharges = Order.getOrderCharges({});
            expect(emptyCharges).to.be.empty;

            let chargesV2 = [];

            const dispatchType = 'takeout';
            const dispatchTime = new Date().getTime();

            const orderItems = [
                fixtures.OrderItem().setItemId('itemid').setPrice(1000).val()
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

            const orderCharges = Order.getOrderCharges({orderItems, dispatchType, dispatchTime, chargesV2});
            expect(orderCharges).to.deep.equal([
                {chargeId:'charge1', amount:-100},
                {chargeId:'charge3', amount:0},
                {chargeId:'charge4', amount:-0}, /* Apparently chai doesn't think 0 === -0 */
                {chargeId:'charge5', amount:-144},
                {chargeId:'charge6', amount:-180},
                {chargeId:'charge7', amount:-100},
            ]);
        });
    });

    describe('calculateTotalOrder', () => {
        it('calculates the total price of an order', () => {
            const orderCharges = [
                {amount:100}
            ];

            const orderItems = [
                fixtures.OrderItem().setPrice(30).val()
            ];

            const dispatchCharge = 10;

            const total = Order.calculateTotalOrder({orderItems, orderCharges, dispatchCharge});

            expect(total).to.equal(140);
        });
    });
});
