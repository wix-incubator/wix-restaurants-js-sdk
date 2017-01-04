export default function createOrder() {
    let fixture = init();

    function init() {
        return {
            delivery: {},
        };
    }

    function deleteFutureOrderGuarantee() {
        if (fixture.delivery.timeGuarantee === "about")
            delete fixture.delivery.timeGuarantee;
    }

    return {
        setRestaurantId(id) {
            fixture.restaurantId = id;
            return this;
        },

        setLocale(locale) {
            fixture.locale = locale;
            return this;
        },

        setContact(contact) {
            fixture.contact = contact;
            return this;
        },

        setPrice(price) {
            fixture.price = price;
            return this;
        },

        setFutureOrder() {
            fixture.delivery.timeGuarantee = "about";
            return this;
        },

        setAsap(received) {
            deleteFutureOrderGuarantee();

            if (received !== undefined && received !== null)
                fixture.received = received;

            return this;
        },

        addOrderItem(orderItem) {
            fixture.orderItems = fixture.orderItems || [];
            fixture.orderItems.push(orderItem);
            return this;
        },

        addCharge(chargeV2) {
            fixture.chargesV2 = fixture.chargesV2 || [];
            fixture.chargesV2.push(chargeV2);
            return this;
        },

        setDelivery() {
            fixture.delivery.type = 'delivery';
            return this;
        },

        setPickup() {
            fixture.delivery.type = 'takeout';
            return this;
        },

        setPreorder(submitAt) {
            fixture.submitAt = submitAt;
            return this;
        },

        setSubmitted(submitted) {
            fixture.submitted = submitted;
            return this;
        },

        setCreated(timestamp) {
            fixture.created = timestamp;
            return this;
        },

        setDeliveryTime(timestamp) {
            fixture.delivery.time = timestamp;
            return this;
        },

        setPlatform(platform) {
            fixture.platform = platform;
            return this;
        },

        addCashPayment(amount) {
            fixture.payments = fixture.payments || [];
            fixture.payments.push({type:'cash', amount});
            return this;
        },

        val() {
            return fixture;
        }
    };
}
