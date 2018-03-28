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
                fixtures.ChargeV2().id('charge4').deliveryTypes(['takeout']).mandatory().percentageDiscount({percentage:20000, itemIds:['itemid2']}).val(),
                fixtures.ChargeV2().id('charge5').deliveryTypes(['takeout']).percentageDiscount({percentage:20000, itemIds:['itemid'], chargeIds:['charge6', 'charge7']}).val(),
                fixtures.ChargeV2().id('charge6').percentageDiscount({percentage:20000, itemIds:['itemid'], chargeIds:['charge7']}).val(),
                fixtures.ChargeV2().id('charge7').percentageDiscount({percentage:10000}).val(),
                fixtures.ChargeV2().id('charge8').min(500000).percentageDiscount({percentage:10000}).val(),
                fixtures.ChargeV2().id('charge9').min(500000).percentageDiscount({percentage:10000}).mandatory().close().val(),
            ];

            const orderCharges = Order.getOrderCharges({orderItems, dispatchType, dispatchTime, chargesV2});
            expect(orderCharges).to.deep.equal([
                fixtures.OrderCharge().setChargeId('charge1').setAmount(-100).val(),
                fixtures.OrderCharge().setChargeId('charge3').setAmount(0).val(),
                fixtures.OrderCharge().setChargeId('charge4').setAmount(-0).val(), /* Apparently chai doesn't think 0 === -0 */
                fixtures.OrderCharge().setChargeId('charge5').setAmount(-144).val(),
                fixtures.OrderCharge().setChargeId('charge6').setAmount(-180).val(),
                fixtures.OrderCharge().setChargeId('charge7').setAmount(-100).val(),
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

    describe('sumTaxCharges', () => {
        it('calculates order\'s tax', () => {
            const chargesV2 = [
                fixtures.ChargeV2().id('charge1').tax(10).val(),
                fixtures.ChargeV2().id('charge2').tax(20).val(),
                fixtures.ChargeV2().id('charge3').percentageDiscount({percentage:10000}).val(),
                fixtures.ChargeV2().id('charge4').tax(20).close().val(),
            ];

            const orderCharges = [
                fixtures.OrderCharge().setChargeId('charge1').setAmount(1000).val(),
                fixtures.OrderCharge().setChargeId('charge2').setAmount(2000).val(),
                fixtures.OrderCharge().setChargeId('charge3').setAmount(5000).val(),
                fixtures.OrderCharge().setChargeId('charge4').setAmount(6000).val()
            ];

            const total = Order.sumTaxCharges({chargesV2, orderCharges});

            expect(total).to.equal(3000);
        });

        it('returns null if restaurant doesn\'t charge taxes', () => {
            const total = Order.sumTaxCharges({chargeV2: [], orderCharges: []});

            expect(total).to.equal(null);

            const chargesV2 = [
                fixtures.ChargeV2().id('charge1').tax(20).close().val()
            ];

            const orderCharges = [
                fixtures.OrderCharge().setChargeId('charge1').setAmount(1000).val()
            ];

            const total2 = Order.sumTaxCharges({chargesV2, orderCharges});

            expect(total2).to.equal(null);
        });
    });
});
