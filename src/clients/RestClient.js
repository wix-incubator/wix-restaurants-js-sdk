import Q from 'q';
import axios from 'axios';
import qs from 'qs';

export const BaseUrls = {
    production: 'https://api.wixrestaurants.com/v2'
};

const baseErrorType = 'https://www.wixrestaurants.com/errors/';

const parseSuccess = (response) => {
    if (response.data) {
        return Q.resolve(response.data);
    } else {
        return Q.reject({
            type: `${baseErrorType}protocol`,
            title: 'Protocol error',
            detail: 'successful response was empty'
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
                type: `${baseErrorType}timeout`,
                title: 'Timeout',
                detail: 'request timed out'
            });
        case 'ENOTFOUND': // fall through
        default:
            return Q.reject({
                type: `${baseErrorType}network`,
                title: 'Network Down',
                detail: 'network is down'
            });
        }
    }
};

const normalizeQueryParamValue = value => Array.isArray(value) ? value.join(',') : value;

const normalizeQueryParams = (params) => {
    return Object.entries(params)
        .reduce((obj, [name, value]) => Object.assign(obj, {[name]: normalizeQueryParamValue(value)}), {});
};

export const createRestClient = ({ baseUrl = BaseUrls.production, timeout = 0 } = {}) => {
    return (path, method = 'get', params, auth) => {
        const headers = {
            Accept: 'application/json'
        };
        if (auth) {
            headers.Authorization = `${auth.type} ${auth.credentials}`;
        }

        const query = (method === 'get' && params) ? qs.stringify(normalizeQueryParams(params), { addQueryPrefix: true }) : '';
        const url = `${baseUrl}${path}${query}`;

        const request = {
            method,
            url,
            headers,
            timeout
        };
        if (method !== 'get' && params) {
            request.data = params;
        }

        return axios(request).then(parseSuccess, parseError);
    };
};
