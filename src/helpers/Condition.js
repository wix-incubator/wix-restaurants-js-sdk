import OrderItemHelper from './OrderItem.js';
import * as availability from 'availability';
import _ from 'lodash';

const CONDITIONS = {
    'true': function() {
        return { value: true, reasons: [] };
    },
    'false': function() {
        return { value: false, reasons: [{reason: 'false'}] };
    },
    'not': function(params) {
        var condition = params.condition;
        const ret = {
            value: !checkRecur(_.extend(params, {condition:condition.condition})).value,
            reasons: []
        };

        return ret;
    },
    'and': function(params) {
        var condition = params.condition;

        const results = _.map(condition.conditions, _condition =>
            checkRecur(_.extend(params, {condition:_condition})));

        const value = _.every(results, r => r.value);

        if (value) {
            return {
                value,
                reasons: []
            };
        }

        return {
            value,
            reasons: joinReasons(results)
        };
    },
    'or': function(params) {
        const condition = params.condition;

        const results = _.map(condition.conditions, _condition =>
            checkRecur(_.extend(params, {condition:_condition})));

        const value = _.some(results, r => r.value);
        if (value) {
            return {
                value,
                reasons: []
            };
        }

        return {
            value,
            reasons: joinReasons(results)
        };
    },
    'order_delivery_time': function(params) {
        var condition = params.condition;
        var deliveryTime = params.deliveryTime;

        if (!deliveryTime) {
            return {
                value: true,
                reasons: []
            };
        }

        var util = new availability.AvailabilityIterator({cal:deliveryTime, availability:condition.availability || {}});
        if (!util.hasNext()) {
            return false;
        }

        var status = util.next();

        return {
            value: !(status.status === 'unavailable'),
            reasons: [{
                reason: status.reason || 'order_delivery_time',
                availability: condition.availability,
                actual: deliveryTime
            }]
        };
    },
    'order_delivery_type': function(params) {
        var condition = params.condition;
        var deliveryType = params.deliveryType;

        return {
            value: condition.deliveryType === deliveryType,
            reasons: [{
                reason: 'order_delivery_type',
                deliveryType: condition.deliveryType,
                actual: deliveryType
            }]
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
            reasons: [{
                reason: 'order_items_price_min',
                min: condition.min,
                actual: totalApplicableItems
            }]
        };

        if ((condition.max) && (totalApplicableItems > condition.max)) return {
            value: false,
            reasons: [{
                reason: 'order_items_price_max',
                max: condition.max,
                actual: totalApplicableItems
            }]
        };

        return { value: true, reasons:[] };
    },
    'order_platform': function(params) {
        var condition = params.condition;
        var platform = params.platform;

        const ret = {
            value: platform === condition.platform,
            reasons: [{
                reason: 'order_platform',
                platform: condition.platform,
                actual: platform
            }]
        };

        return ret;
    },
    'order_source': function(params) {
        var condition = params.condition;
        var source = params.source;

        return {
            value: source === condition.source,
            reasons: [{
                reason: 'order_source',
                source: condition.source,
                actual: source
            }]
        };
    },
    'user_charge_usage': function() {
        throw new Error('user_charge_usage not implemented yet.');
    },
    'order_coupon': function(params) {
        var condition = params.condition;
        var couponHashCode = params.couponHashCode;

        return {
            value: couponHashCode === condition.couponHashCode,
            reasons: [{
                reason: 'order_coupon',
                couponHashCode: condition.couponHashCode,
                actual: couponHashCode
            }]
        };
    }
};

function joinReasons(results) {
    return _.flatten(_.map(_.filter(results, r => !r.value), r => r.reasons));
}

function checkRecur(params) {
    const condition = params.condition;
    const func = CONDITIONS[condition.type] || function() { return { value: false, reasons:[] }; };
    return func(params);
}

export function checkConditionWithReasons(params) {
    const result = checkRecur(params);
    result.elaborateReasons = result.reasons;
    result.reasons = _.map(result.elaborateReasons, 'reason');
    return result;
}

export function checkCondition(params) {
    return checkConditionWithReasons(params).value;
}

export default {
    checkCondition,
    checkConditionWithReasons
};
