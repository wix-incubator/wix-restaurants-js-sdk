export default function createPlatform() {
    let fixture = null;

    return {
        setWeb() {
            fixture = 'web';
            return this;
        },

        setMobileWeb() {
            fixture = 'mobileweb';
            return this;
        },

        val() {
            return fixture;
        }
    };
}

