export default function createOrderItem() {
    let fixture = init();

    function init() {
        return {};
    }

    return {
        setItemId(itemId) {
            fixture.itemId = itemId;
            return this;
        },

        setPrice(price) {
            fixture.price = price;
            return this;
        },

        setCount(count) {
            fixture.count = count;
            return this;
        },

        val() {
            return fixture;
        }
    };
}

