export default function createOrderCharge() {
    let fixture = init();

    function init() {
        return {};
    }

    return {
        setChargeId(chargeId) {
            fixture.chargeId = chargeId;
            return this;
        },

        setAmount(amount) {
            fixture.amount = amount;
            return this;
        },

        val() {
            return fixture;
        }
    };
}
