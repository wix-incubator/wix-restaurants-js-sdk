import _ from 'lodash';

export default class WixRestaurantsDriver {
    constructor({ nockable }) {
        this._nockable = nockable;
    }

    start() {
        return this._nockable.start();
    }

    stop() {
        return this._nockable.stop();
    }

    reset() {
        return this._nockable.reset();
    }

    getOrganization({ organizationId, fields = null }) {
        return this._aRequestFor({
            request: {
                type: 'get_organization',
                organizationId,
                fields
            }
        });
    }

    getOrganizationFull({ organizationId, fields = null }) {
        return this._aRequestFor({
            request: {
                type: 'get_organization_full',
                organizationId,
                fields
            }
        });
    }

    setOrganization({ organization, accessToken }) {
        return this._aRequestFor({
            request: {
                type: 'set_organization',
                organization,
                accessToken
            }
        });
    }

    submitOrder({ accessToken = null, order }) {
        return this._aRequestFor({
            request: {
                type: 'submit_order',
                accessToken,
                order
            }
        });
    }

    getRole({ accessToken, organizationId }) {
        return this._aRequestFor({
            request: {
                type: 'get_role',
                accessToken,
                organizationId
            }
        });
    }

    _aRequestFor({ request }) {
        const params = {
            resource : '/',
            request
        };

        const _this = {
            delayBy: ({ms}) => {
                params.delay = ms;
                return _this;
            },

            succeedWith: (response) => {
                // response can be an object with {value:...}, or a function
                params.response = response;

                this._addRule(params);
            },

            failWith: ({ code, description }) => {
                params.response = {error: code, errorMessage: description};
                params.error = true;

                this._addRule(params);
            },

            failWithProtocolError: () => {
                params.response = '<html></html>';
                params.useRawResponse = true;

                this._addRule(params);
            }
        };

        return _this;
    }

    _addRule({request, delay = 0, response, useRawResponse}) {
        const shouldHandle = (body) => {
            if (typeof(request) === 'function') {
                return request(body);
            } else {
                return _.isEqual(request, body);
            }
        };

        const respond = (body) => {
            if (typeof(response) === 'function') {
                return response(body);
            } if (useRawResponse) {
                return [200, response];
            } else {
                return [200, JSON.stringify(response)];
            }
        };

        this._nockable.nock.post('')
            .socketDelay(delay)
            .delay(delay)
            .times(-1)
            .reply((uri, body) => {
                if (shouldHandle(body)) {
                    return respond(body);
                }
            });
    }
}
