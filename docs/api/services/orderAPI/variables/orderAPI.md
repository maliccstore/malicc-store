# Variable: orderAPI

> `const` **orderAPI**: `object`

Defined in: [services/orderAPI.ts:3](https://github.com/maliccstore/malicc-store/blob/dfca1e99c38062c5af487ee73ad4d7f8e5c53d75/src/services/orderAPI.ts#L3)

## Type Declaration

### checkout

> **checkout**: (`addressId`, `paymentMethod`, `couponCode?`) => `Promise`\<`any`\>

#### Parameters

##### addressId

`number`

##### paymentMethod?

`string` = `"COD"`

##### couponCode?

`string`

#### Returns

`Promise`\<`any`\>

### getOrder

> **getOrder**: (`id`) => `Promise`\<`any`\>

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`any`\>

### myOrders

> **myOrders**: () => `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

### validateCoupon

> **validateCoupon**: (`code`, `subtotal`) => `Promise`\<`any`\>

#### Parameters

##### code

`string`

##### subtotal

`number`

#### Returns

`Promise`\<`any`\>
