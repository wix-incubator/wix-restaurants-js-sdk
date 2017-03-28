import _ from 'lodash';

class NockProtocolDriver {

    constructor({nock, url, version}) {
        this.nock = nock;
        this.url = url || 'https://api.wixrestaurants.com';
        this.version = version || 'v1.1';
    }

    start() {
    }

    reset() {
        this.nock.cleanAll();
    }

    stop() {
        this.nock.cleanAll();
    }

    addRule({request, delay, response, useRawResponse}) {

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

        this.nock(this.url)
            .post(`/${this.version}`)
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
