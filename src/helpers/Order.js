import _ from 'lodash';
import moment from 'moment';
import ChargeV2Helper from './ChargeV2.js';
import OrderItemHelper from './OrderItem.js';

export default {

    /**
     * @return The orderCharges (ChargesV2) that should be added to the order
     */
    getOrderCharges:function({dispatchType, dispatchTime, orderItems, source, platform, chargesV2, timezone}) {

        let orderCharges = [];
        let prevOrderCharges = [];

        const _dispatchTime = moment(dispatchTime).tz(timezone);

        do {
            prevOrderCharges = orderCharges;

            orderCharges = _.compact(_.map(chargesV2, charge => {

                const isApplicable = ChargeV2Helper.isApplicable({
                    charge          : charge,
                    deliveryTime    : _dispatchTime,
                    deliveryType    : dispatchType,
                    orderItems      : orderItems,
                    source          : source,
                    platform        : platform
                });

                if (!isApplicable) {
                    if (charge.mandatory) {
                        return {chargeId:charge.id, amount:0};
                    } else {
                        return null;
                    }
                } else {
                    return {
                        chargeId:charge.id,
                        amount:ChargeV2Helper.calculateAmount({
                            charge          : charge,
                            deliveryTime    : _dispatchTime,
                            deliveryType    : dispatchType,
                            source          : source,
                            platform        : platform,
                            orderItems      : orderItems,
                            orderCharges    : orderCharges
                        })
                    };
                }
            }));

            orderCharges = _.sortBy(orderCharges, 'chargeId');
            prevOrderCharges = _.sortBy(prevOrderCharges, 'chargeId');

        } while (!_.isEqual(orderCharges, prevOrderCharges));

        return orderCharges;
    },

    calculateTotalOrder:function({orderItems, orderCharges, dispatchCharge = 0}) {
        var price = dispatchCharge;

        _.each(orderItems, (orderItem) => price += OrderItemHelper.getTotalPrice({orderItem}));
        _.each(orderCharges, (orderCharge) => price += orderCharge.amount);

        return price;
    }
};
