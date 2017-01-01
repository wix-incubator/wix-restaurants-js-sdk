import {assert} from 'chai';
import moment from 'moment';
import {helpers} from '../../src/index.js';

const {Time} = helpers;

describe('helpers: Time', () => {

    describe('getMinuteOfWeek', () => {
        it('returns the minute of week of a certain date', () => {
            //Given
            let date = moment("2016-04-03 14:00:00");

            //When
            let result = Time.getMinuteOfWeek(date);

            //Then
            assert.equal(result, 14 * 60);

            //Given
            date = moment("2016-04-06 14:00:00");

            //When
            result = Time.getMinuteOfWeek(date);

            //Then
            assert.equal(result, 14 * 60 + 1440 * 3);
        });
    });
});
