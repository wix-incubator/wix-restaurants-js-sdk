import _ from 'lodash';
import moment from 'moment';
import ChargeV2Helper from './ChargeV2.js';
import OrderItemHelper from './OrderItem.js';

export default {

    /**
     * @return The orderCharges (ChargesV2) that should be added to the order
     */
    getOrderCharges:function({dispatchType, dispatchTime, orderItems, tip, source, platform, chargesV2, timezone}) {

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
                    if ((charge.mandatory) && (charge.state !== 'closed')) {
                        return {chargeId:charge.id, amount:0};
                    } else {
                        return null;
                    }
                } else {
                    const amount = ChargeV2Helper.calculateAmount({
                        charge          : charge,
                        deliveryTime    : _dispatchTime,
                        deliveryType    : dispatchType,
                        source          : source,
                        tip             : tip,
                        platform        : platform,
                        orderItems      : orderItems,
                        orderCharges    : orderCharges
                    });
                    if((charge.mandatory) || (amount != 0)) {
                        return {
                            chargeId:charge.id,
                            amount:ChargeV2Helper.calculateAmount({
                                charge          : charge,
                                deliveryTime    : _dispatchTime,
                                deliveryType    : dispatchType,
                                source          : source,
                                tip             : tip,
                                platform        : platform,
                                orderItems      : orderItems,
                                orderCharges    : orderCharges
                            })
                        };
                    } else {
                        return null;
                    }
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
    },

    sumTaxCharges:function({chargesV2, orderCharges}) {
        if (!_.find(chargesV2, charge => charge.type === 'tax' && charge.state !== 'closed')) return null;

        const taxOrderCharges = _.filter(orderCharges, orderCharge => {
            const charge = _.find(chargesV2, c => c.id === orderCharge.chargeId) || {};
            return charge.type === 'tax' && charge.state !== 'closed';
        });
        return _.sumBy(taxOrderCharges, 'amount') || 0;
    }
};
