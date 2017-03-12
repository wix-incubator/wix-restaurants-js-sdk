export default class WixRestaurantsDriver {

    /**
     * Type can be:
     *      'localNetwork' uses a network mock. the params should include [port].
     *      'nock' users nock. the params should include [url].
     */
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

            succeedWith: ({value}) => {
                params.response = {value};

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
