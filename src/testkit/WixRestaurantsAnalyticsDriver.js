export default class WixRestaurantsAnalyticsDriver {
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

    restaurantOrderStats({ accessToken, restaurantId, metric, groupBy, timezone, since, until }) {
        return this._aRequestFor({
            resource: `/restaurants/${restaurantId}/orders/stats`,
            query: {
                metric,
                group_by: groupBy,
                time_zone: timezone,
                since,
                until
            },
            accessToken
        });
    }

    chainOrderStats({ accessToken, chainId, metric, groupBy, timezone, since, until }) {
        return this._aRequestFor({
            resource: `/chains/${chainId}/orders/stats`,
            query: {
                metric,
                group_by: groupBy,
                time_zone: timezone,
                since,
                until
            },
            accessToken
        });
    }

    _aRequestFor({ resource, query, accessToken }) {
        const params = { resource, query, accessToken };

        const _this = {
            delayBy: ({ms}) => {
                params.delay = ms;
                return _this;
            },

            succeedWith: (response) => {
                // response can be an object with {value:...}, or a function
                params.status = 200;
                params.response = response;

                this._addRule(params);
            },

            failWith: (error) => {
                params.status = 400;
                params.response = error;

                this._addRule(params);
            },

            failWithProtocolError: () => {
                params.status = 200;
                params.response = '<html></html>';

                this._addRule(params);
            }
        };

        return _this;
    }

    _addRule({resource, query, accessToken, delay = 0, status, response}) {
        this._nockable.nock.get(resource)
            .matchHeader('Authorization', `Bearer ${accessToken}`)
            .query(query)
            .delayConnection(delay)
            .times(-1)
            .reply(status, response);
    }
}
