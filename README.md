# Wix Restaurants JavaScript SDK
Official JavaScript client for the [Wix Restaurants API](http://developers.wixrestaurants.com).

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url]

This package contains three modules:
## Client
To use the client, it is perfered to use the derived [openrest4node](https://github.com/wix/openrest4node)

## Fixture
Fixtures let you create openrest objects using functions. Example:
```javascript
import {fixtures} from 'wix-restaurants-js-sdk';

const charge = fixtures.ChargeV2().
    deliveryTypes(['delivery']).
    displayConditionDeliveryTypes(['delivery', 'pickup']).
    platforms(['mobileweb', 'web']).
    val();
```
List of available fixtures:
### ChargeV2
Creates a [ChargeV2](https://github.com/wix/openrest4j/blob/master/openrest4j-api/src/main/java/com/openrest/olo/charges/Charge.java) object
- ```fixtures.ChargeV2.title(val)``` - Updates the title of the charge. Assumes 'en_US' locale.
- ```fixtures.ChargeV2.description(val)``` - Updates the description of the charge. Assumes 'en_US' locale.
- ```fixtures.ChargeV2.percentageDiscount({percentage, itemIds})``` - Sets the charge as a percentage discount. **percentage** is times 100 (eg, 1234 means 12.34%). **itemIds** is a list of itemIds to calculate the percentage on.
- ```fixtures.ChargeV2.tax({percentage, itemIds})``` - Sets the charge as a tax charge. **percentage** is times 100 (eg, 1234 means 12.34%). **itemIds** is a list of itemIds to calculate the percentage on.
- ```fixtures.ChargeV2.fixedDiscount({price})``` - Sets the charge as a fixed discount. **price** is times 100 (eg, 1234 means $12.34).
- ```fixtures.ChargeV2.deliveryTypes(types)``` - Sets the list of delivery types in the charge's condition.
- ```fixtures.ChargeV2.displayConditionDeliveryTypes(types)``` - Sets the list of delivery types in the charge's display condition.
- ```fixtures.ChargeV2.platforms(platforms)``` - Sets the list of platforms in the charge's condition.
- ```fixtures.ChargeV2.displayConditionPlatforms(platforms)``` - Sets the list of platforms in the charge's display condition.
- ```fixtures.ChargeV2.min(min)``` - Sets the minimum price in the charge's condition.
- ```fixtures.ChargeV2.displayConditionMin(min)``` - Sets the minimum price in the charge's display condition.
- ```fixtures.ChargeV2.deliveryTime(availability)``` - Sets the weekly availability in the charge's condition.
- ```fixtures.ChargeV2.displayConditionDeliveryTime(availability)``` - Sets the weekly availability in the charge's display condition.
- ```fixtures.ChargeV2.close()``` - Sets the state of the charge to 'closed'.
- ```fixtures.ChargeV2.val()``` - Returns the final charge created.

### Availability
Creates an [Availability](https://github.com/wix/wix-restaurants-availability/blob/master/wix-restaurants-availability-api/src/main/java/com/wix/restaurants/availability/Availability.java) object
- ```fixtures.Avalability.addWeeklyFromDate({start, end})``` - Adds duration to the availability.weekly field, translating the start and end to minutes of week (mainly used for testing).

## Helpers
### ChargeV2
Helper functions to work with ChargeV2 objects.
- ```isApplicable({charge, deliveryTime, deliveryType, orderItems, source, platform})``` - Checks if a charge is applicable to the current parameters.
- ```isDisplayable({charge, deliveryTime, deliveryType, orderItems, source, platform})``` - Checks if a charge is displayable to the current parameters.
- ```calculateAmount({charge, orderItems, orderCharges, extraCost})``` - Calculates the amount the matching OrderCharge should contain.

### OrderItem
Helper functions to work with OrderItems objects.
- ```getTotalPrice({orderItem})``` - Calculates the total price of an OrderItem (including variations).

### Order
Helper functions to work with Order objects.
- ```getOrderCharges({order, chargesV2})``` - Returns the orderCharges calculated, that should be added to the order object. Receives an existing **order** object that should contain **order.deilvery.type**, **order.delivery.time**, and **order.orderItems** to calculate correctly. **chargeV2** should be from the menu.

### Image
Helper functions to work with image URLs.
- ```fill({url, width, height})``` - Returns a URL that serves the resized image. Passing 0 for width or height means maximum size.


[downloads-image]: https://img.shields.io/npm/dm/wix-restaurants-js-sdk.svg

[npm-url]: https://npmjs.org/package/wix-restaurants-js-sdk
[npm-image]: https://img.shields.io/npm/v/wix-restaurants-js-sdk.svg
