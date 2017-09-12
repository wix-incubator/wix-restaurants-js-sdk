import * as DeliveryDispatchInfo from '../../src/helpers/DeliveryDispatchInfo.js';
import { expect } from 'chai';
import { fixtures } from '../../src/index.js';
import moment from 'moment-timezone';

describe('helpers: DeliveryDispatchInfo', () => {

    const area1 = [{ lat:10, lng:10 }, { lat:10, lng:20 }, { lat:20, lng:20 }, { lat:20, lng:10 }];
    const area2 = [{ lat:30, lng:30 }, { lat:30, lng:40 }, { lat:40, lng:40 }, { lat:40, lng:30 }];
    const avil1 = fixtures.Availability().addWeeklyFromMinuteOfWeek({start:0, end: 60}).val();
    const avil2 = fixtures.Availability().addWeeklyFromMinuteOfWeek({start:60, end: 120}).val();

    describe('isActive', () => {
        it('returns wether or not a dispatch info is active', () => {
            expect(DeliveryDispatchInfo.isActive({
                info: fixtures.DeliveryDispatchInfo().setInactive(true).val()
            })).to.be.false;
            expect(DeliveryDispatchInfo.isActive({
                info: fixtures.DeliveryDispatchInfo().setInactive(false).val()
            })).to.be.true;
            expect(DeliveryDispatchInfo.isActive({
                info: fixtures.DeliveryDispatchInfo().val()
            })).to.be.true;
        });
    });

    describe('canMeetPrice', () => {
        it('returns wether or not an order price can meet the delivery infos min order definition', () => {
            expect(DeliveryDispatchInfo.canMeetPrice({
                info: fixtures.DeliveryDispatchInfo().setMinOrderPrice(1000).val(),
                orderPrice: 100
            })).to.be.false;
            expect(DeliveryDispatchInfo.canMeetPrice({
                info: fixtures.DeliveryDispatchInfo().setMinOrderPrice(1000).val(),
                orderPrice: 1000
            })).to.be.true;
            expect(DeliveryDispatchInfo.canMeetPrice({
                info: fixtures.DeliveryDispatchInfo().setMinOrderPrice(1000).val(),
                orderPrice: 1001
            })).to.be.true;
            expect(DeliveryDispatchInfo.canMeetPrice({
                info: fixtures.DeliveryDispatchInfo().val(),
                orderPrice: 100
            })).to.be.true;
        });
    });

    describe('doesDeliverToLatLng', () => {
        it('returns wether or not a latLng is in the info\'s delivery area', () => {
            expect(DeliveryDispatchInfo.doesDeliverToLatLng({
                info: fixtures.DeliveryDispatchInfo().setArea(area1).val(),
                latLng: {lat:15, lng: 15}
            })).to.be.true;
            expect(DeliveryDispatchInfo.doesDeliverToLatLng({
                info: fixtures.DeliveryDispatchInfo().setArea(area2).val(),
                latLng: {lat:15, lng: 15}
            })).to.be.false;
        });
    });

    describe('isAvailable', () => {
        it('returns wether or not a delivery area is available at a certain time', () => {
            expect(DeliveryDispatchInfo.isAvailable({
                info: fixtures.DeliveryDispatchInfo().setAvailability(avil1).val(),
                orderTime: moment.tz(1504990800000, 'Asia/Jerusalem') // Sunday midnight
            })).to.be.true;
            expect(DeliveryDispatchInfo.isAvailable({
                info: fixtures.DeliveryDispatchInfo().setAvailability(avil2).val(),
                orderTime: moment.tz(1504990800000, 'Asia/Jerusalem') // Sunday midnight
            })).to.be.false;
        });
    });

    describe('canMeetDeliveryTime', () => {
        it('returns wether or not an order time meets the required time it will take to delivery to an info', () => {

            const someTime = moment.tz(new Date().getTime(), 'Asia/Jerusalem');
            const someTimePlus20Mins = someTime.clone().add(20, 'm');
            const someTimePlus20MinsAndAFewMoreSecs = someTime.clone().add(20 * 60 + 20, 's');

            expect(DeliveryDispatchInfo.canMeetDeliveryTime({
                info: fixtures.DeliveryDispatchInfo().setDelayMins(10).val(),
                orderTime: someTimePlus20Mins,
                now: someTime
            })).to.be.true;
            expect(DeliveryDispatchInfo.canMeetDeliveryTime({
                info: fixtures.DeliveryDispatchInfo().setDelayMins(20).val(),
                orderTime: someTimePlus20Mins,
                now: someTime
            })).to.be.true;
            expect(DeliveryDispatchInfo.canMeetDeliveryTime({
                info: fixtures.DeliveryDispatchInfo().setDelayMins(30).val(),
                orderTime: someTimePlus20Mins,
                now: someTime
            })).to.be.false;
            expect(DeliveryDispatchInfo.canMeetDeliveryTime({
                info: fixtures.DeliveryDispatchInfo().setDelayMins(21).val(),
                orderTime: someTimePlus20MinsAndAFewMoreSecs,
                now: someTime
            })).to.be.false;
            expect(DeliveryDispatchInfo.canMeetDeliveryTime({
                info: fixtures.DeliveryDispatchInfo().setDelayMins(20).val(),
                orderTime: someTimePlus20MinsAndAFewMoreSecs,
                now: someTime
            })).to.be.true;
        });
    });

    describe('filterAndSort', () => {

        it('sort by minOrderPrice without filtering', () => {
            const infos = [
                fixtures.DeliveryDispatchInfo().setMinOrderPrice(5000).val(),
                fixtures.DeliveryDispatchInfo().setMinOrderPrice(1000).val()
            ];

            expect(DeliveryDispatchInfo.filterAndSort({infos, sortBy: 'minOrderPrice'})).to.deep.equal([
                fixtures.DeliveryDispatchInfo().setMinOrderPrice(1000).val(),
                fixtures.DeliveryDispatchInfo().setMinOrderPrice(5000).val()
            ]);
        });

        it('sort by charge without filtering', () => {
            const infos = [
                fixtures.DeliveryDispatchInfo().setCharge(5000).val(),
                fixtures.DeliveryDispatchInfo().setCharge(1000).val()
            ];

            expect(DeliveryDispatchInfo.filterAndSort({infos, sortBy: 'charge'})).to.deep.equal([
                fixtures.DeliveryDispatchInfo().setCharge(1000).val(),
                fixtures.DeliveryDispatchInfo().setCharge(5000).val()
            ]);
        });

        it('sort by delayMins without filtering', () => {
            const infos = [
                fixtures.DeliveryDispatchInfo().setDelayMins(5000).val(),
                fixtures.DeliveryDispatchInfo().setDelayMins(1000).val()
            ];

            expect(DeliveryDispatchInfo.filterAndSort({infos, sortBy: 'delayMins'})).to.deep.equal([
                fixtures.DeliveryDispatchInfo().setDelayMins(1000).val(),
                fixtures.DeliveryDispatchInfo().setDelayMins(5000).val()
            ]);
        });

        it('filters by various filter parameters', () => {
            const valid = fixtures.DeliveryDispatchInfo().setMinOrderPrice(1000).setInactive(false).setArea(area1).setAvailability(avil1).setDelayMins(10).val();

            const infos = [
                valid,
                fixtures.DeliveryDispatchInfo().setMinOrderPrice(5000).setInactive(false).setArea(area1).setAvailability(avil1).setDelayMins(10).val(),
                fixtures.DeliveryDispatchInfo().setMinOrderPrice(1000).setInactive(false).setArea(area2).setAvailability(avil1).setDelayMins(10).val(),
                fixtures.DeliveryDispatchInfo().setMinOrderPrice(1000).setInactive(false).setArea(area1).setAvailability(avil2).setDelayMins(10).val(),
                fixtures.DeliveryDispatchInfo().setMinOrderPrice(1000).setInactive(true).setArea(area1).setAvailability(avil1).setDelayMins(10).val(),
                fixtures.DeliveryDispatchInfo().setMinOrderPrice(1000).setInactive(false).setArea(area1).setAvailability(avil1).setDelayMins(30).val()
            ];

            const orderTime = moment.tz(1504990800000, 'Asia/Jerusalem'); // Sunday midnight
            const now = moment.tz(1504990800000 - 20 * 60 * 1000, 'Asia/Jerusalem'); // 20 minutes before Sunday midnight

            expect(DeliveryDispatchInfo.filterAndSort({
                infos,
                filter:{
                    orderPrice: 2000,
                    latLng:{lat: 15, lng:15 },
                    orderTime,
                    now
                }
            })).to.deep.equal([
                valid
            ]);
        });
    });
});
