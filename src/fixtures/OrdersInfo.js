export default function createOrdersInfo() {
    const fixture = init();

    function init() {
        return {
            id: 'restaurantid',
            timezone: 'Asia/Jerusalem',
            availabilities: {}
        };
    }

    return {
        setAvailability({availability}) {
            fixture.availability = availability;
            return this;
        },
        setFutureDelayMins({min, max}) {
            fixture.futureDelayMins = {min, max};
            return this;
        },
        val() {
            return fixture;
        }
    };
}
