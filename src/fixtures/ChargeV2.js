import _ from 'lodash';

export default function createCharge() {
    let fixture = init();

    function init() {
        return {
            id:Math.random(),
            type:'discount',
            mandatory:false,
            operator: {},
            condition: {
                type: 'and',
                conditions: [
                    {type: 'true'},
                    {type: 'true'},
                    {type: 'true'},
                    {type: 'true'},
                    {type: 'true'}
                ],
            },
            displayCondition: {
                type: 'and',
                conditions: [
                    {type: 'true'},
                    {type: 'true'},
                    {type: 'true'},
                    {type: 'true'},
                    {type: 'true'}
                ],
            },
        };
    }

    return {

        id(_id) {
            fixture.id = _id;
            return this;
        },

        title(val) {
            fixture.title = {'en_US':val};
            return this;
        },

        description(val) {
            fixture.title = {'en_US':val};
            return this;
        },

        percentageDiscount({percentage, itemIds, chargeIds}) {
            fixture.type = 'discount';
            fixture.operator = {
                type: 'multiply',
                numerators: [
                    {type: 'sum_prices',
                        items: itemIds ? {type:'include', ids:itemIds} : {type: 'exclude', ids: []},
                        charges: chargeIds ? {type:'include', ids:chargeIds} : null
                    },
                    {type: 'value', value: percentage},
                ],
                denominators: [
                    {type: 'value', value: -100000},
                ],
            };

            return this;
        },

        fixedDiscount({price, itemIds}) {
            fixture.type = 'discount';
            fixture.operator = {
                type:'multiply',
                numerators: [
                    {type: 'count_items', items: itemIds ? {type:'include', ids:itemIds} : {type: 'exclude', ids: []}},
                    {type: 'value','value':price}
                ],
                denominators:[
                    {type:'value','value':-1}
                ]
            };

            return this;
        },

        tax({percentage, itemIds, chargeIds}) {
            this.percentageDiscount({percentage, itemIds, chargeIds});
            fixture.type = 'tax';
            fixture.operator.denominators[0].value *= -1;

            return this;
        },

        tip() {
            fixture.type = 'tip';
            return this;
        },

        deliveryTypes(types) {
            if (types) {
                fixture.condition.conditions[1] = {
                    type: 'or', conditions: _.map(types, t => ({type: 'order_delivery_type', deliveryType: t}))
                };
            } else {
                fixture.condition.conditions[1] = {type:'true'};
            }
            return this;
        },

        platforms(platform) {
            if (platform) {
                fixture.condition.conditions[2] = {
                    type: 'or', conditions: _.map(platform, t => ({type: 'order_platform', platform: t}))
                };
            } else {
                fixture.condition.conditions[2] = {type:'true'};
            }
            return this;
        },

        min(min) {
            if (min) {
                fixture.condition.conditions[3] = {type: 'order_items_price', min};
            } else {
                fixture.condition.conditions[3] = {type: 'true'};
            }
            return this;
        },

        deliveryTime(availability) {
            if (availability) {
                fixture.condition.conditions[4] = {type: 'order_delivery_time', availability};
            } else {
                fixture.condition.conditions[4] = {type: 'true'};
            }
            return this;
        },

        displayConditionDeliveryTypes(types) {
            if (types) {
                fixture.displayCondition.conditions[1] = {
                    type: 'or', conditions: _.map(types, t => ({type: 'order_delivery_type', deliveryType: t}))
                };
            } else {
                fixture.displayCondition.conditions[1] = {type:'true'};
            }
            return this;
        },

        displayConditionPlatforms(platform) {
            if (platform) {
                fixture.displayCondition.conditions[2] = {
                    type: 'or', conditions: _.map(platform, t => ({type: 'order_platform', platform: t}))
                };
            } else {
                fixture.displayCondition.conditions[2] = {type:'true'};
            }
            return this;
        },

        displayConditionMin(min) {
            if (min) {
                fixture.displayCondition.conditions[3] = {type: 'order_items_price', min: 123};
            } else {
                fixture.displayCondition.conditions[3] = {type: 'true'};
            }
            return this;
        },

        displayConditionDeliveryTime(availability) {
            if (availability) {
                fixture.displayCondition.conditions[4] = {type: 'order_delivery_time', availability};
            } else {
                fixture.displayCondition.conditions[4] = {type: 'true'};
            }
            return this;
        },

        close() {
            fixture.state = 'closed';
            return this;
        },

        mandatory() {
            fixture.mandatory = true;
            return this;
        },

        val() {
            return fixture;
        }
    };
}
