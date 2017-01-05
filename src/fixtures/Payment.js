export default function createPayment() {
    let fixture = {};

    return {
        setAmount(amount) {
            fixture.amount = amount;
            return this;
        },

        setCash() {
            fixture.type = 'cash';
            return this;
        },

        setCreditCard(card) {
            fixture.type = 'credit';
            fixture.card = card;
            return this;
        },

        val() {
            return fixture;
        }
    };
}

