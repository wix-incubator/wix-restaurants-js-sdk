export default function createOrdersInfo() {
    const fixture = init();

    function init() {
        return {
            availabilities: {}
        };
    }

    return {
        setAvailability({availability}) {
            fixture.availability = availability;
            return this;
        },
        setFutureDelayMins({min, max}) {
            fixture.future = fixture.future || {};
            fixture.future.delayMins = {min, max};
            return this;
        },
        disableFutureOrders() {
            fixture.future = fixture.future || {};
            fixture.future.disabled = true;
            return this;
        },
        enableFutureOrders() {
            fixture.future = fixture.future || {};
            delete fixture.future.disabled;
            return this;
        },
        disableAsapOrders() {
            fixture.asap = fixture.asap || {};
            fixture.asap.disabled = true;
            return this;
        },
        enableAsapOrders() {
            fixture.asap = fixture.asap || {};
            delete fixture.asap.disabled;
            return this;
        },
        setAsapPreOrderMins(mins) {
            fixture.asap = fixture.asap || {};
            fixture.asap.preOrderMins = mins;
            return this;
        },
        val() {
            return fixture;
        }
    };
}
