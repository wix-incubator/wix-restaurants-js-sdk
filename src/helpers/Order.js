import _ from 'lodash';
import moment from 'moment';
import ChargeV2Helper from './ChargeV2.js';

export default {

    /**
     * @return The orderCharges (ChargesV2) that should be added to the order
     */
    getOrderCharges:function({order, chargesV2, timezone}) {

        let orderCharges = [];
        let prevOrderCharges = [];

        let deliveryTime = _.get(order, 'delivery.time') || moment();
        if ((timezone) && (_.isNumber(deliveryTime))) {
            deliveryTime = moment(deliveryTime).tz(timezone);
        }

        do {
            prevOrderCharges = orderCharges;

            orderCharges = _.compact(_.map(chargesV2, charge => {

                const isApplicable = ChargeV2Helper.isApplicable({
                    charge          : charge,
                    deliveryTime    : deliveryTime,
                    deliveryType    : order.delivery.type,
                    orderItems      : order.orderItems,
                    source          : order.source,
                    platform        : order.platform
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
                            deliveryTime    : deliveryTime,
                            deliveryType    : order.delivery.type,
                            source          : order.source,
                            platform        : order.platform,
                            orderItems      : order.orderItems,
                            orderCharges    : orderCharges
                        })
                    };
                }
            }));

            orderCharges = _.sortBy(orderCharges, 'chargeId');
            prevOrderCharges = _.sortBy(prevOrderCharges, 'chargeId');

        } while (!_.isEqual(orderCharges, prevOrderCharges));

        return orderCharges;
    }
};
