import {CommonProtocolDriver} from './CommonProtocolDriver';
import NockProtocolDriver from './NockProtocolDriver';

export default class WixRestaurantsDriver {

    /**
     * Type can be:
     *      'common' uses a network mock. the params should include [port].
     *      'nock' users nock. the params should include [url].
     */
    constructor({ type, params }) {

        const drivers = {
            'localNetwork': CommonProtocolDriver,
            'nock': NockProtocolDriver
        };

        this._driver = new drivers[type](params);
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
