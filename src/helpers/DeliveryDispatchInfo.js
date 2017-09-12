import _ from 'lodash';
import pointInPolygon from 'point-in-polygon';
import * as availability from 'availability';

export const isActive = ({info}) => !info.inactive;

export const canMeetPrice = ({info, orderPrice}) => (info.minOrderPrice || 0) <= orderPrice;

export const doesDeliverToLatLng = ({info, latLng}) => pointInPolygon(normalizeLatLng(latLng), _.map(info.area, normalizeLatLng));

export const isAvailable = ({info, orderTime}) => {
    const iter = new availability.AvailabilityIterator({cal:orderTime.clone(), availability:info.availability || {}});
    return iter.hasNext() && iter.next().status === 'available';
};

export const canMeetDeliveryTime = ({info, orderTime, now}) => {
    const timeDiff = parseInt((orderTime.valueOf() - now.valueOf()) / 1000 / 60);
    return (timeDiff >= 0) && info.delayMins <= timeDiff;
};

export const filterAndSort = ({infos, filter = {}, sortBy}) => {
    const {orderPrice, latLng, orderTime, now} = filter;

    infos = _.filter(infos, info => info.type === 'delivery' && isActive({info}));

    if ((orderPrice) || (orderPrice === 0)) {
        infos = _.filter(infos, info => canMeetPrice({info, orderPrice}));
    }

    if (latLng) {
        infos = _.filter(infos, info => doesDeliverToLatLng({info, latLng}));
    }

    if (orderTime) {
        infos = _.filter(infos, info => isAvailable({info, orderTime}));
    }

    if (now && orderTime) {
        infos = _.filter(infos, info => canMeetDeliveryTime({info, orderTime, now}));
    }

    if (sortBy) {
        infos = _.sortBy(infos, sortBy);
    }

    return infos;
};

const normalizeLatLng = latLng => ([latLng.lat, latLng.lng]);
