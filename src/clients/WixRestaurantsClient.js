import axios from 'axios';

export const Endpoints = {
    production: 'https://api.wixrestaurants.com/v1.1'
};

const parseSuccess = (response) => {
    if (response.data) {
        if (response.data.error) {
            return Promise.reject({
                error: {
                    code: response.data.error,
                    description: response.data.errorMessage
                }
            });
        } else if (response.data.value) {
            return Promise.resolve(response.data.value);
        } else {
            return Promise.reject({
                error: {
                    code: 'protocol',
                    description: 'protocol error'
                }
            });
        }
    } else {
        return Promise.reject({
            error: {
                code: 'protocol',
                description: 'protocol error'
            }
        });
    }
};

const parseError = (error) => {
    if (error.response) {
        return Promise.reject({
            error: {
                code: 'protocol',
                description: 'protocol error'
            }
        });
    } else {
        switch(error.code) {
        case 'ECONNABORTED':
            return Promise.reject({
                error: {
                    code: 'timeout',
                    description: 'request timed out'
                }
            });
        case 'ENOTFOUND': // fall through
        default:
            return Promise.reject({
                error: {
                    code: 'network_down',
                    description: 'network is down'
                }
            });
        }
    }
};

export default class WixRestaurantsClient {
    constructor({ endpointUrl = Endpoints.production, timeout = 0 } = {}) {
        this._endpointUrl = endpointUrl;
        this._axios = axios.create({
            timeout,
            headers: {
                'content-type': 'application/json'
            }
        });
    }

    getOrganization({organizationId, fields = null}) {
        return this._request({
            type: 'get_organization',
            organizationId,
            fields
        });
    }

    getOrganizationFull({organizationId, fields = null}) {
        return this._request({
            type: 'get_organization_full',
            organizationId,
            fields
        });
    }

    setOrganization({organization, accessToken}) {
        return this._request({
            type: 'set_organization',
            organization,
            accessToken
        });
    }

    submitOrder({accessToken = null, order}) {
        return this._request({
            type: 'submit_order',
            accessToken,
            order
        }).then(orderConfirmation => orderConfirmation.order);
    }

    getRole({accessToken, organizationId}) {
        return this._request({
            type: 'get_role',
            accessToken,
            organizationId
        });
    }

    _request(request = {}) {
        return this._axios.post(this._endpointUrl, request).then(parseSuccess, parseError);
    }
}
