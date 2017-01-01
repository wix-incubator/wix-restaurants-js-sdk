export default function createReservation() {
    let fixture = init();

    function init() {
        return {
            id: 'reservationId',
            externalIds: {},
            created: Date.now(),
            modified: Date.now(),
            restaurantId: 'restaurantId',
            distributorId: 'distributorId',
            timeGuarantee: 'about',
            time: Date.now() + (1000 * 60 * 60 * 24), // 24 hours from now
            heldUntil: Date.now() + (1000 * 60 * 60 * 24) + (1000 * 60 * 30), // half an hour later
            contact: {
                firstName: 'First',
                lastName: 'Last',
                email: 'first@last.com',
                phone: '+972501112221'
            },
            partySize: 5,
            comment: 'This is a special request',
            locale: 'he_IL',
            ownerToken: 'ownerToken',
            shareToken: 'shareToken',
            status: 'new',
            restaurantStatus: 'new',
            customerStatus: 'new',
            user: {idIsInferred: null},
            developer: 'com.wix.restaurants',
            source: '',
            platform: 'web',
            log: [{
                type: 'status',
                timestamp: 2,
                user: {},
                actingAs: 'customer',
                properties: {},
                status: 'new'
            }],
            properties: {}
        };
    }

    return {
        id(id) {
            fixture.id = id;
            return this;
        },
        externalIds(externalIds) {
            fixture.externalIds = externalIds;
            return this;
        },
        created(created) {
            fixture.created = created;
            return this;
        },
        modified(modified) {
            fixture.modified = modified;
            return this;
        },
        restaurantId(restaurantId) {
            fixture.restaurantId = restaurantId;
            return this;
        },
        distributorId(distributorId) {
            fixture.distributorId = distributorId;
            return this;
        },
        timeGuarantee(timeGuarantee) {
            fixture.timeGuarantee = timeGuarantee;
            return this;
        },
        time(time) {
            fixture.time = time;
            return this;
        },
        heldUntil(heldUntil) {
            fixture.heldUntil = heldUntil;
            return this;
        },
        contact(contact) {
            fixture.contact = contact;
            return this;
        },
        partySize(partySize) {
            fixture.partySize = partySize;
            return this;
        },
        comment(comment) {
            fixture.comment = comment;
            return this;
        },
        locale(locale) {
            fixture.locale = locale;
            return this;
        },
        ownerToken(ownerToken) {
            fixture.ownerToken = ownerToken;
            return this;
        },
        shareToken(shareToken) {
            fixture.shareToken = shareToken;
            return this;
        },
        status(status) {
            fixture.status = status;
            return this;
        },
        restaurantStatus(restaurantStatus) {
            fixture.restaurantStatus = restaurantStatus;
            return this;
        },
        customerStatus(customerStatus) {
            fixture.customerStatus = customerStatus;
            return this;
        },
        user(user) {
            fixture.user = user;
            return this;
        },
        developer(developer) {
            fixture.developer = developer;
            return this;
        },
        source(source) {
            fixture.source = source;
            return this;
        },
        platform(platform) {
            fixture.platform = platform;
            return this;
        },
        log(log) {
            fixture.log = log;
            return this;
        },
        properties(properties) {
            fixture.properties = properties;
            return this;
        },
        val() {
            return fixture;
        }
    };
}