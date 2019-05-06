import Condition from '../../src/helpers/Condition.js';
import moment from 'moment';
import { expect } from 'chai';

describe('helpers: Condition', () => {
    it('false', () => {
        expect(Condition.checkConditionWithReasons({
            condition: {
                type: 'false'
            }
        })).to.deep.equal({
            value: false,
            reasons: ['false'],
            elaborateReasons: [{reason: 'false'}]
        });
    });

    it('order_platform', () => {
        expect(Condition.checkConditionWithReasons({
            platform: 'bbb',
            condition: {
                type: 'order_platform',
                platform: 'aaa'
            }
        })).to.deep.equal({
            value: false,
            reasons: ['order_platform'],
            elaborateReasons: [{
                reason: 'order_platform',
                platform: 'aaa',
                actual: 'bbb'
            }]
        });
    });

    it('and with one operand', () => {
        expect(Condition.checkConditionWithReasons({
            platform: 'bbb',
            condition: {
                type: 'and',
                conditions: [{
                    type: 'order_platform',
                    platform: 'aaa'
                }]
            }
        })).to.deep.equal({
            value: false,
            reasons: ['order_platform'],
            elaborateReasons: [{
                reason: 'order_platform',
                platform: 'aaa',
                actual: 'bbb'
            }]
        });
    });

    it('or with one operand', () => {
        expect(Condition.checkConditionWithReasons({
            platform: 'bbb',
            condition: {
                type: 'or',
                conditions: [{
                    type: 'order_platform',
                    platform: 'aaa'
                }]
            }
        })).to.deep.equal({
            value: false,
            reasons: ['order_platform'],
            elaborateReasons: [{
                reason: 'order_platform',
                platform: 'aaa',
                actual: 'bbb'
            }]
        });
    });

    it('order_coupon', () => {
        expect(Condition.checkConditionWithReasons({
            couponHashCode: 'wrongCode',
            condition: {
                type: 'or',
                conditions: [{
                    type: 'order_coupon',
                    couponHashCode: 'foo'
                }]
            }
        })).to.deep.equal({
            value: false,
            reasons: ['order_coupon'],
            elaborateReasons: [{
                reason: 'order_coupon',
                couponHashCode: 'foo',
                actual: 'wrongCode'
            }]
        });
    });

    it('order_items_price_min', () => {
        expect(Condition.checkConditionWithReasons({
            orderItems: [{
                price: 19
            }],
            condition: {
                type: 'order_items_price',
                min: 20
            }
        })).to.deep.equal({
            value: false,
            reasons: ['order_items_price_min'],
            elaborateReasons: [{
                reason: 'order_items_price_min',
                min: 20,
                actual: 19
            }]
        });
    });

    it('order_items_price_max', () => {
        expect(Condition.checkConditionWithReasons({
            orderItems: [{
                price: 21
            }],
            condition: {
                type: 'order_items_price',
                max: 20
            }
        })).to.deep.equal({
            value: false,
            reasons: ['order_items_price_max'],
            elaborateReasons: [{
                reason: 'order_items_price_max',
                max: 20,
                actual: 21
            }]
        });
    });

    it('order_items_price_max', () => {
        expect(Condition.checkConditionWithReasons({
            orderItems: [{
                price: 21
            }],
            condition: {
                type: 'order_items_price',
                max: 20
            }
        })).to.deep.equal({
            value: false,
            reasons: ['order_items_price_max'],
            elaborateReasons: [{
                reason: 'order_items_price_max',
                max: 20,
                actual: 21
            }]
        });
    });

    it('order_delivery_time', () => {
        const deliveryTime = moment('2000-01-01 00:11:00');
        const availability = { weekly: [{ minuteOfWeek: 0, durationMins: 10 }] };

        expect(Condition.checkConditionWithReasons({
            deliveryTime,
            condition: {
                type: 'order_delivery_time',
                availability
            }
        })).to.deep.equal({
            value: false,
            reasons: ['order_delivery_time'],
            elaborateReasons: [{
                reason: 'order_delivery_time',
                availability,
                actual: deliveryTime
            }]
        });
    });

    it('order_delivery_type', () => {
        expect(Condition.checkConditionWithReasons({
            deliveryType: 'delivery',
            condition: {
                type: 'order_delivery_type',
                deliveryType: 'takeout'
            }
        })).to.deep.equal({
            value: false,
            reasons: ['order_delivery_type'],
            elaborateReasons: [{
                reason: 'order_delivery_type',
                deliveryType: 'takeout',
                actual: 'delivery'
            }]
        });
    });

    it('order_delivery_type + order_items_price_min', () => {
        expect(Condition.checkConditionWithReasons({
            deliveryType: 'delivery',
            orderItems: [{
                price: 19
            }],
            condition: {
                type: 'and',
                conditions: [{
                    type: 'order_delivery_type',
                    deliveryType: 'takeout'
                }, {
                    type: 'order_items_price',
                    min: 20
                }]
            }
        })).to.deep.equal({
            value: false,
            reasons: ['order_delivery_type', 'order_items_price_min'],
            elaborateReasons: [{
                reason: 'order_delivery_type',
                deliveryType: 'takeout',
                actual: 'delivery'
            }, {
                reason: 'order_items_price_min',
                min: 20,
                actual: 19
            }]
        });
    });

    it('order_source', () => {
        expect(Condition.checkConditionWithReasons({
            source: 'b',
            condition: {
                type: 'order_source',
                source: 'a'
            }
        })).to.deep.equal({
            value: false,
            reasons: ['order_source'],
            elaborateReasons: [{
                reason: 'order_source',
                source: 'a',
                actual: 'b'
            }]
        });
    });

    it('complex condition', () => {
        expect(Condition.checkConditionWithReasons({
            condition: {
                "type": "and",
                "conditions": [{
                    "type": "true"
                }, {
                    "type": "true"
                }, {
                    "type": "and",
                    "conditions": [{
                        "type": "not",
                        "condition": {
                            "type": "order_platform",
                            "platform": "web"
                        }
                    }, {
                        "type": "not",
                        "condition": {
                            "type": "order_platform",
                            "platform": "mobileweb"
                        }
                    }, {
                        "type": "not",
                        "condition": {
                            "type": "order_platform",
                            "platform": "ios"
                        }
                    }, {
                        "type": "not",
                        "condition": {
                            "type": "order_platform",
                            "platform": "android"
                        }
                    }]
                }, {
                    "type": "true"
                }]
            },
            platform: 'callcenter'
        })).to.deep.equal({
            value: true,
            reasons: [],
            elaborateReasons: []
        });
    });
});
