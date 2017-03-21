export default function createMenu() {
    let fixture = init();

    function init() {
        return {
            items: [],
            chargesV2: [],
        };
    }

    return {
        addChargeV2(charge) {
            fixture.chargesV2.push(charge);
            return this;
        },

        addItem(item) {
            fixture.items.push(item);
            return this;
        },

        val() {
            return fixture;
        }
    };
}
