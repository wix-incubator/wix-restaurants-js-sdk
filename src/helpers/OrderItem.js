export default {

    /**
     * @return The total price of the item, including all variations.
     */
    getTotalPrice : function({orderItem}) {
        let price = orderItem.price;
        if (!price) price = 0;

        (orderItem.variationsChoices || []).forEach(choices => {
            (choices || []).forEach(choice => {
                price += this.getTotalPrice({orderItem:choice});
            });
        });

        const count = typeof(orderItem.count) !== 'undefined' ? orderItem.count : 1;
        return price * count;
    }
};
