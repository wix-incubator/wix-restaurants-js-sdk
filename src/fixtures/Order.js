export default function createOrder() {
    let fixture = init();

    function init() {
        return {};
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

        setCurrency(currency) {
            fixture.currency = currency;
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

        setReceived(received) {
            fixture.received = received;
            return this;
        },

        setOrderItems(orderItems) {
            fixture.orderItems = orderItems;
            return this;
        },

        setOrderCharges(orderCharges) {
            fixture.orderCharges = orderCharges;
            return this;
        },

        addCharge(chargeV2) {
            fixture.chargesV2 = fixture.chargesV2 || [];
            fixture.chargesV2.push(chargeV2);
            return this;
        },

        setDispatch(dispatch) {
            fixture.delivery = dispatch;
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

        addPayment(payment) {
            fixture.payments = fixture.payments || [];
            fixture.payments.push(payment);
            return this;
        },

        setComment(comment) {
            fixture.comment = comment;
            return this;
        },

        setDeveloperId(developerId) {
            fixture.developerId = developerId;
            return this;
        },

        setPlatform(platform) {
            fixture.platform = platform;
            return this;
        },

        setSource(source) {
            fixture.source = source;
            return this;
        },

        val() {
            return fixture;
        }
    };
}
