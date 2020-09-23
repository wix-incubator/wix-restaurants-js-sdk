import axios from 'axios';
import qs from 'qs';

const baseErrorType = 'https://www.wixrestaurants.com/errors/';

const parseSuccess = (response) => {
    // some requests return empty response
    return Promise.resolve(response.data);
};

const parseError = (error) => {
    if (error.response && error.response.data) {
        return Promise.reject(error.response.data);
    } else {
        switch(error.code) {
        case 'ECONNABORTED':
            return Promise.reject({
                type: `${baseErrorType}timeout`,
                title: 'Timeout',
                detail: 'request timed out'
            });
        case 'ENOTFOUND': // fall through
        default:
            return Promise.reject({
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

export const createRestClient = ({ baseUrl = 'https://api.wixrestaurants.com/v2', timeout = 0 } = {}) => {
    return (path, method = 'get', params, auth) => {
        const headers = {
            Accept: 'application/json'
        };
        if (auth) {
            if (typeof(auth) === 'string') {
                headers.Authorization = `Bearer ${auth}`;
            } else {
                headers.Authorization = `${auth.type} ${auth.credentials}`;
            }
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
