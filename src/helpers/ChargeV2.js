import OrderItemHelper from './OrderItem.js';
import * as availability from 'availability';
import _ from 'lodash';

const CONDITIONS = {
    'true': function() {
        return true;
    },
    'false': function() {
        return false;
    },
    'not': function(params) {
        var condition = params.condition;
        return !checkCondition(_.extend(params, {condition:condition.condition}));
    },
    'and': function(params) {
        var condition = params.condition;
        return _.every(condition.conditions, function(_condition) {
            return checkCondition(_.extend(params, {condition:_condition}));
        });
    },
    'or': function(params) {
        var condition = params.condition;
        return _.some(condition.conditions, function(_condition) {
            return checkCondition(_.extend(params, {condition:_condition}));
        });
    },
    'order_delivery_time': function(params) {
        var condition = params.condition;
        var deliveryTime = params.deliveryTime;

        var util = new availability.AvailabilityIterator({cal:deliveryTime, availability:condition.availability || {}});
        if (!util.hasNext()) {
            return false;
        }

        var status = util.next();
        return !(status.status === 'unavailable');
    },
    'order_delivery_type': function(params) {
        var condition = params.condition;
        var deliveryType = params.deliveryType;

        return condition.deliveryType === deliveryType;
    },
    'order_items_price': function(params) {
        var condition = params.condition;
        var orderItems = params.orderItems;

        var totalApplicableItems = 0;
        _.each(orderItems, function(orderItem) {
            totalApplicableItems += OrderItemHelper.getTotalPrice({orderItem});
        });

        if ((condition.min) && (totalApplicableItems < condition.min)) return false;
        if ((condition.max) && (totalApplicableItems > condition.max)) return false;

        return true;
    },
    'order_platform': function(params) {
        var condition = params.condition;
        var platform = params.platform;

        return platform === condition.platform;
    },
    'order_source': function(params) {
        var condition = params.condition;
        var source = params.source;

        return source === condition.source;
    },
    'user_charge_usage': function() {
        throw new Error('user_charge_usage not implemented yet.');
    }
};

function checkCondition(params) {
    var condition = params.condition;

    var func = CONDITIONS[condition.type] || function() { return false; };
    return func(params);
}

const OPERATORS = {
    'value': function(params) {
        var operator = params.operator;
        return operator.value;
    },
    'min':function(params) {
        var operator = params.operator;

        return _.min(_.map(operator.operators, function(_operator) {
            return calculateOperator(_.extend(params, {operator:_operator}));
        }));
    },
    'max':function(params) {
        var operator = params.operator;

        return _.max(_.map(operator.operators, function(_operator) {
            return calculateOperator(_.extend(params, {operator:_operator}));
        }));
    },
    'multiply':function(params) {
        var operator = params.operator;

        let numerators = 1;
        let denominators = 1;

        _.each(operator.numerators, function(_operator) {
            numerators *= calculateOperator(_.extend(params, {operator:_operator}));
        });

        _.each(operator.denominators, function(_operator) {
            denominators *= calculateOperator(_.extend(params, {operator:_operator}));
        });

        let result = numerators / denominators;

        return Math.sign(result) * Math.floor(Math.abs(result) + 0.5);
    },
    'count_items':function(params) {
        var operator = params.operator;
        var orderItems = params.orderItems;
        var orderCharges = params.orderCharges;

        var total = 0;

        _.each(orderItems, (orderItem) => {
            if (isApplicableItem(orderItem.itemId, operator.items)) {
                total += (orderItem.count || 1);
            }
        });

        _.each(orderCharges, (orderCharge) => {
            if (isApplicableItem(orderCharge.chargeId, operator.charges)) {
                total++;
            }
        });

        return total;
    },
    'sum':function(params) {
        var operator = params.operator;

        var result = 0;

        _.each(operator.operators, function(_operator) {
            result += calculateOperator(_.extend(params, {operator:_operator}));
        });

        return result;
    },
    'sum_prices':function(params) {
        var operator = params.operator;
        var orderItems = params.orderItems;
        var orderCharges = params.orderCharges;

        // Get all applicable items' price in a sorted list
        var applicableItems = _.flatten(_.compact(_.map(orderItems, function(orderItem) {
            if (!isApplicableItem(orderItem.itemId, operator.items)) {
                return null;
            }
            return _.map(_.range(orderItem.count || 1), function() {
                return OrderItemHelper.getTotalPrice({orderItem})/(orderItem.count||1);
            });
        })));

        // Get all applicable items' price in a sorted list
        var applicableCharges = _.flatten(_.compact(_.map(orderCharges, function(orderCharge) {
            if (!isApplicableItem(orderCharge.chargeId, operator.charges)) {
                return null;
            }
            return orderCharge.amount;
        })));

        var applicable = _(applicableItems).concat(applicableCharges).value().sort(function(x,y) { return x-y; });

        // Re-calculate Y
        var max = Math.min(operator.maxCount || Number.MAX_VALUE, applicable.length);

        // Ensure there's the right amount of items
        if (max < 0) return 0;

        return _.reduce(applicable.splice(0, max), function(memo, num){ return memo + num; }, 0);
    }
};

function calculateOperator(params) {
    var operator = params.operator;

    var func = OPERATORS[operator.type] || function() { return 0; };
    const ret = func(params);

    return ret;
}

function isApplicableItem(itemId, idsFilter) {
    if (!idsFilter) return false;

    if ((idsFilter.type || 'include') === 'include') {
        return _.includes(idsFilter.ids, itemId);
    } else {
        return !_.includes(idsFilter.ids, itemId);
    }
}

export default {

    isApplicable : function(params) {
        var charge = params.charge;
        var deliveryTime = params.deliveryTime;
        var deliveryType = params.deliveryType || '';
        var orderItems = params.orderItems || [];
        var source = params.source;
        var platform = params.platform;

        if (charge.state === 'closed') return false;

        return checkCondition({condition:charge.condition, deliveryTime:deliveryTime, deliveryType:deliveryType,
            orderItems:orderItems, source:source, platform:platform});
    },

    isDisplayable : function(params) {
        var charge = params.charge;
        var deliveryTime = params.deliveryTime;
        var deliveryType = params.deliveryType || '';
        var orderItems = params.orderItems || [];
        var source = params.source;
        var platform = params.platform;

        if (charge.state === 'closed') return false;

        return checkCondition({condition:charge.displayCondition, deliveryTime:deliveryTime, deliveryType:deliveryType,
            orderItems:orderItems, source:source, platform:platform});
    },

    calculateAmount : function(params) {
        var charge = params.charge;
        var tip = params.tip || 0;
        var orderItems = params.orderItems || [];
        var orderCharges = params.orderCharges || [];
        var extraCost = params.extraCost;

        if (!this.isApplicable(params)) return 0;

        if (charge.type == 'tip') return tip;

        return calculateOperator({operator:charge.operator, orderItems:orderItems, orderCharges:orderCharges,
            extraCost:extraCost});
    }
};
