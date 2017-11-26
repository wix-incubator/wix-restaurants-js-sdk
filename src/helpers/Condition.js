import OrderItemHelper from './OrderItem.js';
import * as availability from 'availability';
import _ from 'lodash';

const CONDITIONS = {
    'true': function() {
        return { value: true, reasons: [] };
    },
    'false': function() {
        return { value: false, reasons: ['false'] };
    },
    'not': function(params) {
        var condition = params.condition;
        return {
            value: !checkConditionWithReasons(_.extend(params, {condition:condition.condition})),
            reasons: []
        };
    },
    'and': function(params) {
        var condition = params.condition;

        const results = _.map(condition.conditions, _condition =>
            checkConditionWithReasons(_.extend(params, {condition:_condition})));

        const value = _.every(results, r => r.value);

        if (value) {
            return {
                value,
                reasons: []
            };
        }

        return {
            value,
            reasons: _.union(_.map(_.filter(results, r => !r.value), r => r.reasons))
        };
    },
    'or': function(params) {
        const condition = params.condition;

        const results = _.map(condition.conditions, _condition =>
            checkConditionWithReasons(_.extend(params, {condition:_condition})));

        const value = _.some(results, r => r.value);
        if (value) {
            return {
                value,
                reasons: []
            };
        }

        return {
            value,
            reasons: _.union(_.map(r => r.reasons))
        };
    },
    'order_delivery_time': function(params) {
        var condition = params.condition;
        var deliveryTime = params.deliveryTime;

        var util = new availability.AvailabilityIterator({cal:deliveryTime, availability:condition.availability || {}});
        if (!util.hasNext()) {
            return false;
        }

        var status = util.next();
        return {
            value: !(status.status === 'unavailable'),
            reasons: [status.reason || 'order_delivery_time']
        };
    },
    'order_delivery_type': function(params) {
        var condition = params.condition;
        var deliveryType = params.deliveryType;

        return {
            value: condition.deliveryType === deliveryType,
            reasons: ['order_delivery_type']
        };
    },
    'order_items_price': function(params) {
        var condition = params.condition;
        var orderItems = params.orderItems;

        var totalApplicableItems = 0;
        _.each(orderItems, function(orderItem) {
            totalApplicableItems += OrderItemHelper.getTotalPrice({orderItem});
        });

        if ((condition.min) && (totalApplicableItems < condition.min)) return {
            value: false,
            reasons: ['order_items_price_min']
        };

        if ((condition.max) && (totalApplicableItems > condition.max)) return {
            value: false,
            reasons: ['order_items_price_max']
        };

        return { value: true, reasons:[] };
    },
    'order_platform': function(params) {
        var condition = params.condition;
        var platform = params.platform;

        return {
            value: platform === condition.platform,
            reasons: ['order_platform']
        };
    },
    'order_source': function(params) {
        var condition = params.condition;
        var source = params.source;

        return {
            value: source === condition.source,
            reasons: ['order_source']
        };
    },
    'user_charge_usage': function() {
        throw new Error('user_charge_usage not implemented yet.');
    }
};

export function checkConditionWithReasons(params) {
    var condition = params.condition;

    var func = CONDITIONS[condition.type] || function() { return { value: false, reasons:[] }; };
    return func(params);
}

export function checkCondition(params) {
    return checkConditionWithReasons(params).value;
}

export default {
    checkCondition,
    checkConditionWithReasons
};
