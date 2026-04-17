# Variable: orderAPI

> `const` **orderAPI**: `object`

Defined in: [services/orderAPI.ts:3](https://github.com/maliccstore/malicc-store/blob/66610a5232f27d4109b9b25550eef36086e83bda/src/services/orderAPI.ts#L3)

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
