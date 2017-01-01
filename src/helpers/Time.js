export default {
    getMinuteOfWeek(date) {
        let firstWeekday = getFirstWeekday(date);
        return date.diff(firstWeekday, 'minutes');
    },

};

function getFirstWeekday(date) {
    return date.isoWeekday() % 7 === 0 ?
        date.clone().startOf('d') :
        date.clone().startOf('isoWeek').add(-1, 'd');
}
