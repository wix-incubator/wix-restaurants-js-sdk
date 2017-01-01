export default function createOrderItem() {
    let fixture = init();

    function init() {
        return {};
    }

    return {
        itemId(itemId) {
            fixture.itemId = itemId;
            return this;
        },

        price(price) {
            fixture.price = price;
            return this;
        },

        count(count) {
            fixture.count = count;
            return this;
        },

        val() {
            return fixture;
        }
    };
}

