import axios from 'axios';

export const BaseUrls = {
    production: 'https://analytics.wixrestaurants.com/v1'
};

export const Metrics = {
    price: 'price'
};

export const Periods = {
    day: 'day',
    week: 'week',
    month: 'month',
    year: 'year',
    lifetime: 'lifetime',
    hourOfWeek: 'hourOfWeek',
    monthOfYear: 'monthOfYear'
};

export const Platforms = {
    web: 'web',
    mobileweb: 'mobileweb',
    android: 'android',
    ios: 'ios',
    facebook: 'facebook',
    callcenter: 'callcenter',
    'kiosk.android': 'kiosk.android',
    'kiosk.ios': 'kiosk.ios',
    'com.messenger': 'com.messenger',
    'org.telegram': 'org.telegram',
    'com.slack': 'com.slack'
};

export const Statuses = {
    pending: 'pending',
    new: 'new',
    accepted: 'accepted',
    canceled: 'canceled'
};

const stringArray = arr => (!arr || !arr.length ? undefined : arr.join(','));

const parseSuccess = (response) => {
    if (response.data) {
        return Promise.resolve(response.data);
    } else {
        return Promise.reject({
            type: 'https://analytics.wixrestaurants.com/errors/protocol',
            title: 'Protocol error.',
            detail: 'Successful response was empty.'
        });
    }
};

const parseError = (error) => {
    if (error.response && error.response.data) {
        return Promise.reject(error.response.data);
    } else {
        switch(error.code) {
        case 'ECONNABORTED':
            return Promise.reject({
                type: 'https://analytics.wixrestaurants.com/errors/timeout',
                title: 'Request timed out.'
            });
        case 'ENOTFOUND': // fall through
        default:
            return Promise.reject({
                type: 'https://analytics.wixrestaurants.com/errors/network',
                title: 'Network is down.'
            });
        }
    }
};

export default class WixRestaurantsAnalyticsClient {
    constructor({ baseUrl = BaseUrls.production, timeout = 0 } = {}) {
        this._axios = axios.create({
            baseURL: baseUrl,
            timeout
        });
    }

    restaurantOrderStats({accessToken, restaurantId, metric, groupBy, timezone, since, until, statuses, platforms}) {
        const statusesStr = stringArray(statuses);
        const platformsStr = stringArray(platforms);

        return this._request({
            resource: `/restaurants/${restaurantId}/orders/stats`,
            params: Object.assign({}, {
                metric,
                group_by: groupBy,
                time_zone: timezone,
                since,
                until
            }, (statusesStr ? {statuses: statusesStr} : {}), (platformsStr ? {platforms: platformsStr} : {})),
            accessToken
        }).then(value => value.stats);
    }

    chainOrderStats({accessToken, chainId, metric, groupBy, timezone, since, until, statuses, platforms}) {
        const statusesStr = stringArray(statuses);
        const platformsStr = stringArray(platforms);

        return this._request({
            resource: `/chains/${chainId}/orders/stats`,
            params: Object.assign({}, {
                metric,
                group_by: groupBy,
                time_zone: timezone,
                since,
                until
            }, (statusesStr ? {statuses: statusesStr} : {}), (platformsStr ? {platforms: platformsStr} : {})),
            accessToken
        }).then(value => value.stats);
    }

    _request({resource, params, accessToken}) {
        return this._axios.get(resource, {
            params,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(parseSuccess, parseError);
    }
}
