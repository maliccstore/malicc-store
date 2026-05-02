# Variable: adminProductAPI

> `const` **adminProductAPI**: `object`

Defined in: [services/admin/product.admin.ts:26](https://github.com/maliccstore/malicc-store/blob/66610a5232f27d4109b9b25550eef36086e83bda/src/services/admin/product.admin.ts#L26)

## Type Declaration

### create

> **create**: (`data`) => `Promise`\<\{ `data`: `AdminProduct`; \}\>

#### Parameters

##### data

`Partial`\<`AdminProduct`\>

#### Returns

`Promise`\<\{ `data`: `AdminProduct`; \}\>

### delete

> **delete**: (`id`) => `Promise`\<\{ `data`: `any`; \}\>

#### Parameters

##### id

`string`

#### Returns

`Promise`\<\{ `data`: `any`; \}\>

### disable

> **disable**: (`id`) => `Promise`\<\{ `data`: `any`; \}\>

#### Parameters

##### id

`string`

#### Returns

`Promise`\<\{ `data`: `any`; \}\>

### getAll

> **getAll**: () => `Promise`\<\{ `data`: `any`; \}\>

#### Returns

`Promise`\<\{ `data`: `any`; \}\>

### getById

> **getById**: (`id`) => `Promise`\<\{ `data`: `AdminProduct`; \}\>

#### Parameters

##### id

`string`

#### Returns

`Promise`\<\{ `data`: `AdminProduct`; \}\>

### update

> **update**: (`id`, `data`) => `Promise`\<\{ `data`: `AdminProduct`; \}\>

#### Parameters

##### id

`string`

##### data

`Partial`\<`AdminProduct`\>

#### Returns

`Promise`\<\{ `data`: `AdminProduct`; \}\>
