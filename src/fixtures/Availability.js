import Time from '../helpers/Time.js';

export default function createAvailability() {
    let fixture = {weekly: [], exceptions: []};

    return {
        addWeeklyFromDate({_Time = Time, start, end}) {
            let startMinute = Math.floor(_Time.getMinuteOfWeek(start));
            let endMinute = Math.floor(_Time.getMinuteOfWeek(end));
            let duration = endMinute - startMinute;
            fixture.weekly.push({minuteOfWeek: startMinute, durationMins: duration});
            return this;
        },

        addWeeklyFromMinuteOfWeek({start, end}) {
            let duration = end - start;
            fixture.weekly.push({minuteOfWeek: start, durationMins: duration});
            return this;
        },

        addException({start, end, available, reason, comment}) {
            fixture.exceptions.push({start, end, available, reason, comment});
            return this;
        },

        val() {
            return fixture;
        }
    };
}
