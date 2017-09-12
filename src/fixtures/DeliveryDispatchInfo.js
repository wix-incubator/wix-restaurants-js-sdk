export default function create() {
    let fixture = {type: 'delivery'};

    return {
        setArea(area) {
            fixture.area = area;
            return this;
        },
        setMinOrderPrice(val) {
            fixture.minOrderPrice = val;
            return this;
        },
        setCharge(val) {
            fixture.charge = val;
            return this;
        },
        setDelayMins(val) {
            fixture.delayMins = val;
            return this;
        },
        setInactive(val) {
            fixture.inactive = val;
            return this;
        },
        setAvailability(val) {
            fixture.availability = val;
            return this;
        },
        val() {
            return fixture;
        }
    };
}

