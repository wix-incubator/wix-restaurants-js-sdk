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

export function checkCondition(params) {
    var condition = params.condition;

    var func = CONDITIONS[condition.type] || function() { return false; };
    return func(params);
}

export default {
    checkCondition
};
