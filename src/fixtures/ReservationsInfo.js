export default function createReservationsInfo() {
    const fixture = init();

    function init() {
        return {
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

