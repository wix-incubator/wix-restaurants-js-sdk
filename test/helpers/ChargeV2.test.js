import ChargeV2 from '../../src/helpers/ChargeV2.js';
import { expect } from 'chai';
import moment from 'moment';
import { fixtures } from '../../src/index.js';

describe('helpers: ChargesV2', () => {

    describe('isApplicable', () => {

        it('returns whether or not a charge is applicable based on delivery type, platform, minimum, and time', () => {
            const now = moment();

            const charge = fixtures.ChargeV2().
                deliveryTypes(['delivery']).
                platforms(['mobileweb', 'web']).
                deliveryTime(fixtures.Availability().addWeeklyFromDate({start:now.clone().subtract(1, 'hours'), end:now.clone().add(1, 'hours')}).val()).
                val();

            expect(ChargeV2.isApplicable({
                charge, orderItems:[], deliveryType:'delivery', deliveryTime:now, platform:'mobileweb'})).to.be.true;

            expect(ChargeV2.isApplicable({
                charge, orderItems:[], deliveryType:'takeout', deliveryTime:now, platform:'mobileweb'})).to.be.false;

            expect(ChargeV2.isApplicable({
                charge, orderItems:[], deliveryType:'delivery', deliveryTime:now.clone().add(3, 'hours'), platform:'mobileweb'})).to.be.false;

            const closedCharge = fixtures.ChargeV2().
                deliveryTypes(['delivery']).
                platforms(['mobileweb', 'web']).
                deliveryTime(fixtures.Availability().addWeeklyFromDate({start:now.clone().subtract(1, 'hours'), end:now.clone().add(1, 'hours')}).val()).
                close().
                val();

            expect(ChargeV2.isApplicable({
                charge:closedCharge, orderItems:[], deliveryType:'delivery', deliveryTime:now, platform:'mobileweb'})).to.be.false;

            const minCharge = fixtures.ChargeV2().
                deliveryTypes(['delivery']).
                platforms(['mobileweb', 'web']).
                deliveryTime(fixtures.Availability().addWeeklyFromDate({start:now.clone().subtract(1, 'hours'), end:now.clone().add(1, 'hours')}).val()).
                min(1000).
                val();

            expect(ChargeV2.isApplicable({
                charge:minCharge, orderItems:[], deliveryType:'delivery', deliveryTime:now, platform:'mobileweb'})).to.be.false;

            expect(ChargeV2.isApplicable({
                charge:minCharge, orderItems:[{price:1000}], deliveryType:'delivery', deliveryTime:now, platform:'mobileweb'})).to.be.true;
        });
    });

    describe('isDisplayable', () => {
        it('returns whether or not a charge should be displayed in the cart based on delivery type, platform, and time', () => {
            const now = moment();

            const charge = fixtures.ChargeV2().
                displayConditionDeliveryTypes(['delivery']).
                displayConditionPlatforms(['mobileweb', 'web']).
                displayConditionDeliveryTime(fixtures.Availability().addWeeklyFromDate({start:now.clone().subtract(1, 'hours'), end:now.clone().add(1, 'hours')}).val()).
                val();

            expect(ChargeV2.isDisplayable({
                charge, orderItems:[], deliveryType:'delivery', deliveryTime:now, platform:'mobileweb'})).to.be.true;

            expect(ChargeV2.isDisplayable({
                charge, orderItems:[], deliveryType:'takeout', deliveryTime:now, platform:'mobileweb'})).to.be.false;

            expect(ChargeV2.isDisplayable({
                charge, orderItems:[], deliveryType:'delivery', deliveryTime:now.clone().add(3, 'hours'), platform:'mobileweb'})).to.be.false;

            const closedCharge = fixtures.ChargeV2().
                displayConditionDeliveryTime(['delivery']).
                displayConditionPlatforms(['mobileweb', 'web']).
                displayConditionDeliveryTime(fixtures.Availability().addWeeklyFromDate({start:now.clone().subtract(1, 'hours'), end:now.clone().add(1, 'hours')}).val()).
                close().
                val();

            expect(ChargeV2.isDisplayable({
                charge:closedCharge, orderItems:[], deliveryType:'delivery', deliveryTime:now, platform:'mobileweb'})).to.be.false;

            const minCharge = fixtures.ChargeV2().
                displayConditionDeliveryTypes(['delivery']).
                displayConditionPlatforms(['mobileweb', 'web']).
                displayConditionDeliveryTime(fixtures.Availability().addWeeklyFromDate({start:now.clone().subtract(1, 'hours'), end:now.clone().add(1, 'hours')}).val()).
                displayConditionMin(1000).
                val();

            expect(ChargeV2.isDisplayable({
                charge:minCharge, orderItems:[], deliveryType:'delivery', deliveryTime:now, platform:'mobileweb'})).to.be.false;

            expect(ChargeV2.isDisplayable({
                charge:minCharge, orderItems:[{price:1000}], deliveryType:'delivery', deliveryTime:now, platform:'mobileweb'})).to.be.true;
        });
    });

    describe('calculateAmount', () => {
        it('Correctly calculates the total of a charge', () => {

            // Percentage
            const orderItems = [fixtures.OrderItem().setItemId('itemid').setPrice(1000).val()];
            const orderCharges = [{chargeId:'aaa', amount:-200}];

            const charge1 = fixtures.ChargeV2().id('charge1').percentageDiscount({percentage:10000}).val();
            expect(ChargeV2.calculateAmount({charge:charge1, orderItems, orderCharges})).to.equal(-100);

            const charge2 = fixtures.ChargeV2().id('charge2').percentageDiscount({percentage:10000, chargeIds:['aaa']}).val();
            expect(ChargeV2.calculateAmount({charge:charge2, orderItems, orderCharges})).to.equal(-80);

            const charge3 = fixtures.ChargeV2().id('charge3').tax({percentage: 5000}).val();
            expect(ChargeV2.calculateAmount({charge:charge3, orderItems, orderCharges})).to.equal(50);

            const charge4 = fixtures.ChargeV2().tip().val();
            expect(ChargeV2.calculateAmount({charge:charge4, tip:12345})).to.equal(12345);

            // Fixed
            const fixedOrderItems = [
                fixtures.OrderItem().setItemId('aaa').setPrice(1000).val(),
                fixtures.OrderItem().setItemId('ccc').setPrice(2000).val()
            ];
            const fixedCharge = fixtures.ChargeV2().id('charge').fixedDiscount({price:10, itemIds:['aaa', 'bbb', 'ccc']}).val();
            expect(ChargeV2.calculateAmount({charge:fixedCharge, orderItems:fixedOrderItems, orderCharges})).to.equal(-20);
        });
    });

});
