export default class RestClientDriver {
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

    on(path, method = 'get', params, auth) {

        const _nockParams = {path, method};

        _nockParams.headers = {
            Accept: 'application/json'
        };

        if (auth) {
            if (typeof(auth) === 'string') {
                _nockParams.headers.Authorization = `Bearer ${auth}`;
            } else {
                _nockParams.headers.Authorization = `${auth.type} ${auth.credentials}`;
            }
        }

        if (method === 'get' && params) {
            _nockParams.query = params;
        }

        if (method !== 'get' && params) {
            _nockParams.data = params;
        }

        const _this = {
            delayBy: ({ms}) => {
                _nockParams.delay = ms;
                return _this;
            },

            succeedWith: (response) => {
                _nockParams.response = response;

                this._addRule(_nockParams);
            },

            failWith: ({ type, title, status, detail }) => {
                _nockParams.response = {type, title, status, detail};
                _nockParams.status = status;

                this._addRule(_nockParams);
            },

            failWithProtocolError: () => {
                _nockParams.response = '<html></html>';

                this._addRule(_nockParams);
            }
        };

        return _this;
    }

    _addRule({path, method, query, headers, data, delay = 0, status = 200, response}) {
        let _nock = this._nockable.nock;
        _.each(headers, (value, key) => {
            _nock = _nock.matchHeader(key, value);
        });
        _nock = _nock[method](path, data);
        _nock = _nock.query(query);
        _nock = _nock.delayConnection(delay);
        _nock = _nock.times(-1);
        _nock.reply(status, response);
    }
}
