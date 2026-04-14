# Variable: cartAPI

> `const` **cartAPI**: `object`

Defined in: [services/cart.service.ts:3](https://github.com/maliccstore/malicc-store/blob/531024241c1e60c35a681c4c70193c5252119b93/src/services/cart.service.ts#L3)

## Type Declaration

### addToCart

> **addToCart**: (`productId`, `quantity`) => `Promise`\<`any`\>

#### Parameters

##### productId

`string`

##### quantity?

`number` = `1`

#### Returns

`Promise`\<`any`\>

### clearCart

> **clearCart**: () => `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

### getCart

> **getCart**: () => `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

### removeFromCart

> **removeFromCart**: (`productId`) => `Promise`\<`any`\>

#### Parameters

##### productId

`string`

#### Returns

`Promise`\<`any`\>

### updateCartItem

> **updateCartItem**: (`productId`, `quantity`) => `Promise`\<`any`\>

#### Parameters

##### productId

`string`

##### quantity

`number`

#### Returns

`Promise`\<`any`\>
