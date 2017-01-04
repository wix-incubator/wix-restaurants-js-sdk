import Q from 'q';

export const Endpoints = {
    production: 'https://api.wixrestaurants.com/v1.1'
};

export default class WixRestaurantsClient {
    constructor({ endpointUrl = Endpoints.production, timeout = 0 } = {}) {
        this._endpointUrl = endpointUrl;
        this._timeout = timeout;
    }

    getOrganization({organizationId, fields = null}) {
        return this._request({
            request: {
                type: 'get_organization',
                organizationId,
                fields
            }
        });
    }

    getOrganizationFull({organizationId, fields = null}) {
        return this._request({
            request: {
                type: 'get_organization_full',
                organizationId,
                fields
            }
        });
    }

    submitOrder({accessToken = null, order}) {
        return this._request({
            request: {
                type: 'submit_order',
                accessToken,
                order
            }
        }).then(orderConfirmation => orderConfirmation.order);
    }

    _request({request = {}}) {
        const deferred = Q.defer();
        const xhr = new XMLHttpRequest();

        xhr.ontimeout = () => {
            deferred.reject({
                error: {
                    code: 'timeout',
                    description: 'request timed out'
                }
            });
        };

        xhr.onerror = () => {
            deferred.reject({
                error: {
                    code: 'network_down',
                    description: 'network is down'
                }
            });
        };

        xhr.onload = () => {
            let response = null;
            try {
                response = JSON.parse(xhr.responseText);
            } catch (e) {
                deferred.reject({
                    error: {
                        code: 'protocol',
                        description: 'protocol error'
                    }
                });
                return;
            }

            if (response.error) {
                deferred.reject({
                    error: {
                        code: response.error,
                        description: response.errorMessage
                    }
                });
            } else {
                deferred.resolve(response.value);
            }
        };

        xhr.open('POST', this._endpointUrl, true);
        xhr.timeout = this._timeout;
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(request));

        return deferred.promise;
    }
}
