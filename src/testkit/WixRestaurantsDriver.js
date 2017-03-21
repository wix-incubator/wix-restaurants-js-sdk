export default class WixRestaurantsDriver {
    constructor({ driver }) {
        this._driver = driver;
    }

    start() {
        this._driver.start();
    }

    stop() {
        this._driver.stop();
    }

    reset() {
        this._driver.reset();
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

                this._driver.addRule(params);
            },

            failWith: ({ code, description }) => {
                params.response = {error: code, errorMessage: description};
                params.error = true;

                this._driver.addRule(params);
            },

            failWithProtocolError: () => {
                params.response = '<html></html>';
                params.useRawResponse = true;

                this._driver.addRule(params);
            }
        };

        return _this;
    }
}
