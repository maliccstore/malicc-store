# Variable: addressAPI

> `const` **addressAPI**: `object`

Defined in: [services/address.service.ts:5](https://github.com/maliccstore/malicc-store/blob/dfca1e99c38062c5af487ee73ad4d7f8e5c53d75/src/services/address.service.ts#L5)

## Type Declaration

### createAddress

> **createAddress**: (`input`) => `Promise`\<[`Address`](../../../types/address/interfaces/Address.md)\>

#### Parameters

##### input

[`CreateAddressInput`](../../../types/address/interfaces/CreateAddressInput.md)

#### Returns

`Promise`\<[`Address`](../../../types/address/interfaces/Address.md)\>

### deleteAddress

> **deleteAddress**: (`id`) => `Promise`\<`boolean`\>

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`boolean`\>

### getUserAddresses

> **getUserAddresses**: () => `Promise`\<[`Address`](../../../types/address/interfaces/Address.md)[]\>

#### Returns

`Promise`\<[`Address`](../../../types/address/interfaces/Address.md)[]\>

### setDefaultAddress

> **setDefaultAddress**: (`id`) => `Promise`\<[`Address`](../../../types/address/interfaces/Address.md)\>

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`Address`](../../../types/address/interfaces/Address.md)\>

### updateAddress

> **updateAddress**: (`id`, `input`) => `Promise`\<[`Address`](../../../types/address/interfaces/Address.md)\>

#### Parameters

##### id

`string`

##### input

[`UpdateAddressInput`](../../../types/address/interfaces/UpdateAddressInput.md)

#### Returns

`Promise`\<[`Address`](../../../types/address/interfaces/Address.md)\>
