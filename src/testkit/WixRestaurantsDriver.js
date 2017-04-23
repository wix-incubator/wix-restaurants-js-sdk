import url from 'url';

export default class WixRestaurantsDriver {
    constructor({ nockable }) {
        this._nockable = nockable;

        const urlParts = url.parse(nockable.endpoint);
        this._hostname = `${urlParts.protocol}//${urlParts.host}`;
        if (urlParts.pathname[urlParts.pathname.length-1] !== '/') {
            this._basePath = urlParts.pathname;
        } else {
            this._basePath = urlParts.pathname.substr(0, urlParts.pathname.length-1);
        }
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

                this._addRule(params);
            }
        };

        return _this;
    }

    _addRule({request, delay = 0, response}) {
        this._nockable.nock.post(this._basePath, request)
            .delayConnection(delay)
            .times(-1)
            .reply(200, response);
    }
}
