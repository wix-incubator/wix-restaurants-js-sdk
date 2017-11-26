import Condition from '../../src/helpers/Condition.js';
import { expect } from 'chai';

describe('helpers: Condition', () => {
    it('works with receiving the reason as well', () => {

        expect(Condition.checkConditionWithReasons({
            condition: {
                type: 'false'
            }
        })).to.deep.equal({
            value: false,
            reasons: ['false']
        });

        expect(Condition.checkConditionWithReasons({
            condition: {
                type: 'order_platform',
                platform: 'aaa'
            }
        })).to.deep.equal({
            value: false,
            reasons: ['order_platform']
        });

        expect(Condition.checkConditionWithReasons({
            condition: {
                type: 'and',
                conditions: [{
                    type: 'order_platform',
                    platform: 'aaa'
                }]
            }
        })).to.deep.equal({
            value: false,
            reasons: ['order_platform']
        });

        expect(Condition.checkConditionWithReasons({
            condition: {
                type: 'or',
                conditions: [{
                    type: 'order_platform',
                    platform: 'aaa'
                }]
            }
        })).to.deep.equal({
            value: false,
            reasons: ['order_platform']
        });
    });
});
