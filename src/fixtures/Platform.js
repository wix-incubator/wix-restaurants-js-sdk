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

        setMessenger() {
            fixture = 'com.messenger';
            return this;
        },

        setTelegram() {
            fixture = 'com.telegram';
            return this;
        },

        setSlack() {
            fixture = 'com.slack';
            return this;
        },

        val() {
            return fixture;
        }
    };
}

