import Restaurant from '../../src/helpers/Restaurant.js';
import { expect } from 'chai';
import moment from 'moment';
import { fixtures } from '../../src/index.js';

const tz = 'Asia/Jerusalem';
const openAlways = fixtures.Availability().val();
const openSun8AmUntilSun8Pm = fixtures.Availability().addWeeklyFromMinuteOfWeek({start: 8 * 60, end: 20 * 60}).val();
const exceptionForever = fixtures.Availability().addException({ start:null, end:null, availabile: 'unavailable', reason: 'closed', comment: 'comment' }).val();

describe('helpers: Restaurant', () => {

    describe('olrAvailable', () => {

        it('returns always open if no minimum time, restaurant is open 24/7, reservations are open 24/7', () => {

            const cal = moment.tz([2010, 12-1, 12, 0, 0, 0, 0], tz);
            const reservationTimeCal = moment.tz([2010, 12-1, 12, 4, 0, 0, 0], tz);

            const reservations = fixtures.ReservationsInfo().
                setAvailability({availability: openAlways}).
                val();

            const restaurant = fixtures.Restaurant().
                setOpenTimes({type: 'olr', availability: openAlways}).
                setReservations({reservations}).
                val();

            expect(Restaurant.olrAvailable({cal, reservationTimeCal, restaurant}).status).to.equal('available');
            expect(Restaurant.olrAvailable({cal, reservationTimeCal, restaurant}).until).to.be.null;
        });

        it('returns closed if no minimum time, restaurant is open 24/7, reservations are open during specific times', () => {

            const cal = moment.tz([2010, 12-1, 12, 0, 0, 0, 0], tz);
            const reservationTimeCalClosed = moment.tz([2010, 12-1, 12, 4, 0, 0, 0], tz);
            const reservationTimeCalOpen = moment.tz([2010, 12-1, 12, 9, 0, 0, 0], tz);

            const reservations = fixtures.ReservationsInfo().
                setAvailability({availability: openSun8AmUntilSun8Pm}).
                val();

            const restaurant = fixtures.Restaurant().
                setOpenTimes({type: 'olr', availability: openAlways}).
                setReservations({reservations}).
                val();

            expect(Restaurant.olrAvailable({cal, reservationTimeCal: reservationTimeCalClosed, restaurant}).status).to.equal('unavailable');
            expect(Restaurant.olrAvailable({cal, reservationTimeCal: reservationTimeCalClosed, restaurant}).until).to.equal(1292133600000);
            expect(Restaurant.olrAvailable({cal, reservationTimeCal: reservationTimeCalOpen, restaurant}).status).to.equal('available');
            expect(Restaurant.olrAvailable({cal, reservationTimeCal: reservationTimeCalOpen, restaurant}).until).to.equal(1292176800000);
        });

        it('returns closed if no minimum time, restaurant is open during specific times, reservations are open during opening times', () => {
            const cal = moment.tz([2010, 12-1, 12, 0, 0, 0, 0], tz);
            const reservationTimeCalClosed = moment.tz([2010, 12-1, 12, 4, 0, 0, 0], tz);
            const reservationTimeCalOpen = moment.tz([2010, 12-1, 12, 9, 0, 0, 0], tz);

            const reservations = fixtures.ReservationsInfo().
                setAvailability({availability: openAlways}).
                val();

            const restaurant = fixtures.Restaurant().
                setOpenTimes({type: 'olr', availability: openSun8AmUntilSun8Pm}).
                setReservations({reservations}).
                val();

            expect(Restaurant.olrAvailable({cal, reservationTimeCal: reservationTimeCalClosed, restaurant}).status).to.equal('unavailable');
            expect(Restaurant.olrAvailable({cal, reservationTimeCal: reservationTimeCalClosed, restaurant}).until).to.equal(1292133600000);
            expect(Restaurant.olrAvailable({cal, reservationTimeCal: reservationTimeCalOpen, restaurant}).status).to.equal('available');
            expect(Restaurant.olrAvailable({cal, reservationTimeCal: reservationTimeCalOpen, restaurant}).until).to.equal(1292176800000);
        });

        it('returns closed forever if there\'s an exception forever', () => {
            const cal = moment.tz([2010, 12-1, 12, 0, 0, 0, 0], tz);
            const reservationTimeCalClosed = moment.tz([2010, 12-1, 12, 4, 0, 0, 0], tz);

            const reservations = fixtures.ReservationsInfo().
                setAvailability({availability: exceptionForever}).
                val();

            const restaurant = fixtures.Restaurant().
                setOpenTimes({type: 'olr', availability: openAlways}).
                setReservations({reservations}).
                val();

            expect(Restaurant.olrAvailable({cal, reservationTimeCal: reservationTimeCalClosed, restaurant}).status).to.equal('unavailable');
            expect(Restaurant.olrAvailable({cal, reservationTimeCal: reservationTimeCalClosed, restaurant}).until).to.equal(null);
            expect(Restaurant.olrAvailable({cal, reservationTimeCal: reservationTimeCalClosed, restaurant}).reason).to.equal('closed');
            expect(Restaurant.olrAvailable({cal, reservationTimeCal: reservationTimeCalClosed, restaurant}).comment).to.equal('comment');
        });

        it('returns error of time in the past, if reservation time is in the past', () => {
            const cal = moment.tz([2010, 12-1, 12, 0, 0, 0, 0], tz);
            const reservationPast = moment.tz([2010, 12-1, 11, 4, 0, 0, 0], tz);
            const reservationFuture = moment.tz([2010, 12-1, 12, 4, 0, 0, 0], tz);

            const reservations = fixtures.ReservationsInfo().
                setAvailability({availability: openAlways}).
                val();

            const restaurant = fixtures.Restaurant().
                setOpenTimes({type: 'olr', availability: openAlways}).
                setReservations({reservations}).
                val();

            expect(Restaurant.olrAvailable({cal, reservationTimeCal: reservationPast, restaurant}).isPast).to.be.true;
            expect(Restaurant.olrAvailable({cal, reservationTimeCal: reservationFuture, restaurant}).isPast).to.be.false;
        });

        it('returns too early/too late if ordering time doesn\' fit minimum or maximum', () => {
            const cal = moment.tz([2010, 12-1, 12, 0, 0, 0, 0], tz);
            const reservationEarly = moment.tz([2010, 12-1, 12, 1, 0, 0, 0], tz);
            const reservationOK = moment.tz([2010, 12-1, 12, 3, 0, 0, 0], tz);
            const reservationLate = moment.tz([2010, 12-1, 12, 5, 0, 0, 0], tz);

            const reservations = fixtures.ReservationsInfo().
                setAvailability({availability: openAlways}).
                setFutureDelayMins({min:120, max:240}).
                val();

            const restaurant = fixtures.Restaurant().
                setOpenTimes({type: 'olr', availability: openAlways}).
                setReservations({reservations}).
                val();

            expect(Restaurant.olrAvailable({cal, reservationTimeCal: reservationEarly, restaurant}).isEarly).to.be.true;
            expect(Restaurant.olrAvailable({cal, reservationTimeCal: reservationEarly, restaurant}).isLate).to.be.false;
            expect(Restaurant.olrAvailable({cal, reservationTimeCal: reservationOK, restaurant}).isLate).to.be.false;
            expect(Restaurant.olrAvailable({cal, reservationTimeCal: reservationOK, restaurant}).isEarly).to.be.false;
            expect(Restaurant.olrAvailable({cal, reservationTimeCal: reservationLate, restaurant}).isLate).to.be.true;
            expect(Restaurant.olrAvailable({cal, reservationTimeCal: reservationLate, restaurant}).isEarly).to.be.false;
        });

        it('returns closed when restaurant open 24/7, reservations are closed', () => {
            const cal = moment.tz([2010, 12-1, 12, 0, 0, 0, 0], tz);
            const reservationTimeCalClosed = moment.tz([2010, 12-1, 12, 4, 0, 0, 0], tz);

            const reservations = fixtures.ReservationsInfo()
                .setAvailability({availability: {exceptions: [{available: false, reason: "closed"}]}})
                .setFutureDelayMins({min: 0, max: 60 * 24 * 60})
                .val();

            const restaurant = fixtures.Restaurant()
                .setOpenTimes({type: 'olr', availability: openAlways})
                .setReservations({reservations})
                .val();

            expect(Restaurant.olrAvailable({cal, reservationTimeCal: reservationTimeCalClosed, restaurant}).status).to.equal('unavailable');
            expect(Restaurant.olrAvailable({cal, reservationTimeCal: reservationTimeCalClosed, restaurant}).until).to.equal(null);
        });

        it('returns closed when restaurant is open during specific times, reservations are closed', () => {
            const cal = moment.tz([2010, 12-1, 12, 0, 0, 0, 0], tz);
            const reservationTimeCalClosed = moment.tz([2010, 12-1, 12, 4, 0, 0, 0], tz);

            const reservations = fixtures.ReservationsInfo()
                .setAvailability({availability: {exceptions: [{available: false, reason: "closed"}]}})
                .setFutureDelayMins({min: 0, max: 60 * 24 * 60})
                .val();

            const restaurant = fixtures.Restaurant()
                .setOpenTimes({type: 'olr', availability: openSun8AmUntilSun8Pm})
                .setReservations({reservations})
                .val();

            const result = Restaurant.olrAvailable({cal, reservationTimeCal: reservationTimeCalClosed, restaurant});

            expect(result.status).to.equal('unavailable');
            expect(result.until).to.equal(null);
        });
    });
});
