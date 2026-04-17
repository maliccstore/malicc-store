# Variable: addressAPI

> `const` **addressAPI**: `object`

Defined in: [services/address.service.ts:5](https://github.com/maliccstore/malicc-store/blob/66610a5232f27d4109b9b25550eef36086e83bda/src/services/address.service.ts#L5)

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
