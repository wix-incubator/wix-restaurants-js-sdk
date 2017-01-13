import {ConjunctiveTimeWindowsIterator, AvailabilityIterator} from 'availability';
import _ from 'lodash';

export default {

    /**
     * Returns:
     *      status, until, reason, comment, isPast, isEarly, isLate
     */
    olrAvailable:({cal, reservationTimeCal, restaurant}) => {

        const diff = reservationTimeCal.diff(cal);
        const futureDelayMins = _.get(restaurant, 'reservations.futureDelayMins', {});

        const isEarly = (() => {
            if (!futureDelayMins.min) return false;
            return (Math.ceil(diff/60000) < futureDelayMins.min);
        })();

        const isLate = (() => {
            if (!futureDelayMins.max) return false;
            return (Math.ceil(diff/60000) > futureDelayMins.max);
        })();

        const openTimes = _.get(restaurant, 'openTimes', {});
        const olrTimes = _.get(restaurant, 'reservations.availability', {});

        var it = new ConjunctiveTimeWindowsIterator({
            iterators: [openTimes, olrTimes].map(availability => new AvailabilityIterator({availability, cal})),
            cal: reservationTimeCal.clone()
        });

        return _.extend({}, it.next(), {isPast: diff < 0, isEarly, isLate});
    },
};
