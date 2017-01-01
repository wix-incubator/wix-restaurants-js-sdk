import _ from 'lodash';
import OrderItemHelper from './OrderItem.js';
import * as availability from 'availability';
import moment from 'moment-timezone';

let self = {};

function indexOf(arr, val)
{
    for (let i in arr) if (arr[i] === val) return i;
    return -1;
}

self.isVariable = function(params) {
    let charge = params.charge;
    let type = charge.amountRuleType || 'variable';

    let buyXgetYFree = JSON.parse((charge.properties || {})['com.openrest'] || '{}').buyXgetYFree || null;
    if (buyXgetYFree) {
        return false;
    }

    return (type == 'variable');
};

self.isApplicable = function(params) {
    let charge = params.charge;
    let clubIds = params.clubIds;
    let ref = params.ref;
    let timezone = params.timezone;
    let deliveryType = params.deliveryType || '';
    let dontCheckAvailability = params.dontCheckAvailability || false;
    let skipClub = params.skipClub || false;
    let chargeUsages = params.chargeUsages || {};

    if (charge.state === 'closed') return false;

    if ((charge.refs) && (!_.isEmpty(charge.refs)) && (indexOf(charge.refs, ref) === -1)) return false;

    if ((charge.deliveryTypes) && (indexOf(charge.deliveryTypes, deliveryType) === -1)) return false;
    if (charge.inactive) return false;

    if ((typeof(charge.maxTimesPerUser) !== 'undefined') && (charge.maxTimesPerUser !== null)) {
        if ((chargeUsages[charge.id] || 0) >= charge.maxTimesPerUser) return false;
    }

    if ((!dontCheckAvailability) && (charge.availability)) {
        let now = moment.tz(timezone);

        let util = new availability.AvailabilityIterator({
            cal : now,
            availability : charge.availability || {}
        });
        if (!util.hasNext()) {
            console.log('AvailabilityIterator >> item availability hasNext returned false!');
            return false;
        }

        let status = util.next();
        if (status.status === 'unavailable') return false;
    }

    if ((charge.type) && (charge.type == 'club_coupon')) {
        if (!skipClub) {
            if (typeof(clubIds) == 'undefined') return false;
            if (typeof(charge.clubId) == 'undefined') return false;
            if (indexOf(clubIds, charge.clubId) == -1) return false;
        }
        return true;
    }

    if ((charge.type) && (charge.type == 'coupon')) {
        return true;
    }

    if ((charge.type) && (charge.type == 'tax')) {
        return true;
    }

    // TODO: Others!!!
    return false;
};

self.calculateAmount = function(params) {
    let charge = params.charge;
    let orderItems = params.orderItems;
    let maxDiscount = params.maxDiscount || 0;
    let extraCost = params.extraCost;
    let isLoggedIn = params.isLoggedIn;
    let chargeUsages = params.chargeUsages || {};
    let type = charge.amountRuleType || 'variable';

    if (typeof(maxDiscount) == 'undefined') maxDiscount = Number.MAX_VALUE;

    let minApplicableOrderPrice = JSON.parse((charge.properties || {})['com.openrest'] || '{}').minApplicableOrderPrice || 0;
    let buyXgetYFree = JSON.parse((charge.properties || {})['com.openrest'] || '{}').buyXgetYFree || null;

    // Check that the minimal application order price is valid
    let totalApplicableItems = 0;
    for (let i in orderItems) {
        let item = orderItems[i];
        if (isApplicableItem({charge:charge, itemId:item.itemId})) {
            totalApplicableItems += OrderItemHelper.getTotalPrice({orderItem:item});
        }
    }

    if (totalApplicableItems < (minApplicableOrderPrice || 0)) {
        return 0;
    }

    if ((typeof(charge.maxTimesPerUser) !== 'undefined') && (charge.maxTimesPerUser !== null)) {
        if (!isLoggedIn) return 0;

        if ((chargeUsages[charge.id] || 0) >= charge.maxTimesPerUser) return 0;
    }

    if (buyXgetYFree) {
        let x = buyXgetYFree.x;
        let y = buyXgetYFree.y;

        // Get all applicable items' price in a sorted list
        let applicableItems = _.flatten(_.compact(_.map(orderItems, function(orderItem) {
            if (!isApplicableItem({charge:charge, itemId:orderItem.itemId})) {
                return null;
            }

            return _.map(_.range(orderItem.count || 1), function() {
                return OrderItemHelper.getTotalPrice({orderItem})/(orderItem.count || 1);
            });
        }))).sort(function(x,y) { return x-y; }); // For some strange reason my chrome did not
        // agree to sort it by numeric value without the lamda function

        console.log('[ChargeHelper] buyXgetYFree applicable prices: ', applicableItems);

        // Re-calculate Y
        y = Math.min(y, applicableItems.length-x);

        // Ensure there's the right amount of items
        if (y < 0) return 0;

        console.log('[ChargeHelper] buyXgetYFree (x, y): ', x, y);

        let value = -1 * _.reduce(applicableItems.splice(0, y), function(memo, num){ return memo + num; }, 0);

        // Ick - for Ratto's
        if ((charge.id === '5807927855457115') && (value < -875)) {
            return -875;
        }
        return value;
    }

    else if (type == 'fixed') {
        for (let i in orderItems) {
            let item = orderItems[i];
            if (isApplicableItem({charge:charge, itemId:item.itemId})) {
                return Math.max(charge.amountRule, -1*maxDiscount);
            }
        }
    } else if (type == 'percentage') {
        return Math.min(calculateChargeValuePercentage({charge:charge, orderItems:orderItems, extraCost:extraCost}), maxDiscount);
    } else if (type == 'fixed_per_item') {
        let total = 0;
        for (let i in orderItems) {
            let item = orderItems[i];
            if (isApplicableItem({charge:charge, itemId:item.itemId})) {
                let singlePrice = OrderItemHelper.getTotalPrice({orderItem:item}) / (item.count || 1);
                let discount = Math.max(-1*singlePrice, charge.amountRule) * (item.count || 1);
                total += discount;
            }
        }
        return total;
    } else if (type == 'variable') {
        if ((charge.variableAmountRuleType) && (charge.variableAmountRuleType == 'fixed')) {
            return Math.max(charge.variableAmountRule, -1*maxDiscount);
        } else if ((charge.variableAmountRuleType) && (charge.variableAmountRuleType == 'percentage')) {
            return Math.max(calculateChargeValuePercentage({charge:charge, orderItems:orderItems, extraCost:extraCost, percentage:charge.variableAmountRule}), -1*maxDiscount);
        } else {
            return charge.amount || 0;
        }
    }

    return 0;
};

function calculateChargeValuePercentage(params)
{
    let charge = params.charge;
    let orderItems = params.orderItems;
    let extraCost = params.extraCost;
    let percentage = params.percentage || parseInt(charge.amountRule);

    let total = 0;
    if (typeof(orderItems) != 'undefined') {
        for (let i in orderItems) {
            let item = orderItems[i];
            if (isApplicableItem({charge:charge, itemId:item.itemId})) {
                total += OrderItemHelper.getTotalPrice({orderItem:item}) * percentage / 10000;
            }
        }
    }

    if (extraCost) {
        total += extraCost * percentage / 10000;
    }

    return parseInt(total);
}

function isApplicableItem(params) {
    let charge = params.charge;
    let itemId = params.itemId;

    if ((charge.itemIds || null) === null) return true;

    let items = charge.itemIds;

    charge.mode = charge.mode || 'include';

    if (indexOf(items, itemId) == -1) {
        return (charge.mode === 'exclude');
    }
    return (charge.mode === 'include');
}

self.getTitle = function(params) {
    let charge = params.charge;
    let i18n = params.i18n;
    let defaultLocale = params.defaultLocale;

    if ((charge.type) && (charge.type == 'club_coupon')) {
        return charge.coupon.title[i18n.getLocale()] || charge.coupon.title[defaultLocale];
    }
    if ((charge.type) && (charge.type == 'coupon')) {
        return charge.coupon.title[i18n.getLocale()] || charge.coupon.title[defaultLocale];
    }
    if ((charge.type) && (charge.type == 'tax')) {
        return i18n.get('openrest_common_tax');
    }

    return '';
};

self.getDescription = function(params)
{
    let charge = params.charge;
    let i18n = params.i18n;
    let defaultLocale = params.defaultLocale;

    if ((charge.type) && ((charge.type == 'club_coupon') || (charge.type == 'coupon'))) {
        let ret = '';

        if (charge.coupon.description) ret = charge.coupon.description[i18n.getLocale()] || charge.coupon.description[defaultLocale];

        return ret;
    }

    return undefined;
};

export default self;
