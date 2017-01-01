import nock from 'nock';
import _ from 'lodash';

class NockProtocolDriver {

    constructor({url, version}) {
        this.url = url || 'https://api.wixrestaurants.com';
        this.version = version || 'v1.1';
    }

    start() {
    }

    reset() {
        nock.cleanAll();
    }

    stop() {
        nock.cleanAll();
    }

    addRule({request, delay, response}) {

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
            } else {
                return [200, response];
            }
        };

        nock(this.url)
            .post('/' + this.version)
            .socketDelay(delay || 0)
            .delay(delay || 0)
            .times(-1)
            .reply((uri, body) => {
                if (shouldHandle(body)) {
                    return respond(body);
                }
            });
    }
}

export default NockProtocolDriver;
