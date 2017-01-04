export default function createContact() {
    let fixture = {};

    return {

        setFirstName(firstName) {
            fixture.firstName = firstName;
            return this;
        },

        setLastName(lastName) {
            fixture.lastName = lastName;
            return this;
        },

        setPhone(phone) {
            fixture.phone = phone;
            return this;
        },

        setEmail(email) {
            fixture.email = email;
            return this;
        },

        val() {
            return fixture;
        }
    };
}

