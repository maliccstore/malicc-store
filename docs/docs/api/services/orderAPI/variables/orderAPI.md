# Variable: orderAPI

> `const` **orderAPI**: `object`

Defined in: [services/orderAPI.ts:3](https://github.com/maliccstore/malicc-store/blob/531024241c1e60c35a681c4c70193c5252119b93/src/services/orderAPI.ts#L3)

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
