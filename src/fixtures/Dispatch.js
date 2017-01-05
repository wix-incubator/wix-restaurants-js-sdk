export default function createDispatch() {
    let fixture = {};

    return {
        setAsap() {
            delete fixture.timeGuarantee;
            delete fixture.time;
            return this;
        },

        setFutureOrder() {
            fixture.timeGuarantee = 'about';
            return this;
        },

        setDispatchTime(timestamp) {
            fixture.time = timestamp;
            return this;
        },

        setPickup() {
            fixture.type = 'takeout';
            fixture.address = null;
            return this;
        },

        setDelivery(address) {
            fixture.type = 'delivery';
            fixture.address = address;
            return this;
        },

        val() {
            return fixture;
        }
    };
}


