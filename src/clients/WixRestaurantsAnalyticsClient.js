import Q from 'q';
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
    lifetime: 'lifetime'
};

const parseSuccess = (response) => {
    if (response.data) {
        return Q.resolve(response.data);
    } else {
        return Q.reject({
            type: 'https://analytics.wixrestaurants.com/errors/protocol',
            title: 'Protocol error.',
            detail: 'Successful response was empty.'
        });
    }
};

const parseError = (error) => {
    if (error.response && error.response.data) {
        return Q.reject(error.response.data);
    } else {
        switch(error.code) {
        case 'ECONNABORTED':
            return Q.reject({
                type: 'https://analytics.wixrestaurants.com/errors/timeout',
                title: 'Request timed out.'
            });
        case 'ENOTFOUND': // fall through
        default:
            return Q.reject({
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

    restaurantOrderStats({accessToken, restaurantId, metric, period, timezone, since, until}) {
        return this._request({
            resource: `/restaurants/${restaurantId}/orders/stats`,
            params: {
                metric,
                period,
                time_zone: timezone,
                since,
                until
            },
            accessToken
        }).then(value => value.stats);
    }

    chainOrderStats({accessToken, chainId, metric, period, timezone, since, until}) {
        return this._request({
            resource: `/chains/${chainId}/orders/stats`,
            params: {
                metric,
                period,
                time_zone: timezone,
                since,
                until
            },
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
