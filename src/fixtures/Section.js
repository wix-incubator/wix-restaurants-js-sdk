export default function createSection() {
    let fixture = init();

    function init() {
        return {
            id: 0,
            displayCondition: {type: 'true'},
            condition: {type: 'true'}
        };
    }

    return {

        setId(id) {
            fixture.id = id;
            return this;
        },

        setDisplayCondition(condition) {
            fixture.displayCondition = condition;
            return this;
        },

        setOpenRestAvailability(availability) {
            fixture.properties = {
                'com.implied2.spice': `{"availability":${JSON.stringify(availability)}}`
            };
            return this;
        },

        setChildren(children) {
            fixture.children = children;
            return this;
        },

        val() {
            return fixture;
        }
    };
}
