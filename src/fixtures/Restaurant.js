export default function createRestaurant() {
    const fixture = init();

    function init() {
        return {
            id: 'restaurantid',
            timezone: 'Asia/Jerusalem',
            availabilities: {}
        };
    }

    return {
        addTakeout({minOrderPrice, delayMins, availability}) {
            fixture.deliveryInfos = fixture.deliveryInfos || [];
            fixture.deliveryInfos.push({type:'takeout', minOrderPrice, delayMins, availability});

            return this;
        },

        addDelivery({minOrderPrice, delayMins, availability}) {
            fixture.deliveryInfos = fixture.deliveryInfos || [];
            fixture.deliveryInfos.push({type:'delivery', minOrderPrice, delayMins, availability});

            return this;
        },

        addAvailabilityType({type, availability}) {
            fixture.availabilities[type] = availability;

            return this;
        },

        val() {
            return fixture;
        }
    };
}