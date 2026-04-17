# Variable: adminCategoryAPI

> `const` **adminCategoryAPI**: `object`

Defined in: [services/admin/category.admin.ts:4](https://github.com/maliccstore/malicc-store/blob/66610a5232f27d4109b9b25550eef36086e83bda/src/services/admin/category.admin.ts#L4)

## Type Declaration

### create

> **create**: (`data`) => `Promise`\<\{ `data`: `AdminCategory`; \}\>

#### Parameters

##### data

`Partial`\<`AdminCategory`\>

#### Returns

`Promise`\<\{ `data`: `AdminCategory`; \}\>

### delete

> **delete**: (`id`) => `Promise`\<\{ `data`: `any`; \}\>

#### Parameters

##### id

`string`

#### Returns

`Promise`\<\{ `data`: `any`; \}\>

### getAll

> **getAll**: (`filters?`) => `Promise`\<\{ `data`: `AdminCategory`[]; `totalCount`: `any`; \}\>

#### Parameters

##### filters?

###### isActive?

`boolean`

###### search?

`string`

#### Returns

`Promise`\<\{ `data`: `AdminCategory`[]; `totalCount`: `any`; \}\>

### getById

> **getById**: (`id`) => `Promise`\<\{ `data`: `AdminCategory`; \}\>

#### Parameters

##### id

`string`

#### Returns

`Promise`\<\{ `data`: `AdminCategory`; \}\>

### update

> **update**: (`id`, `data`) => `Promise`\<\{ `data`: `AdminCategory`; \}\>

#### Parameters

##### id

`string`

##### data

`Partial`\<`AdminCategory`\>

#### Returns

`Promise`\<\{ `data`: `AdminCategory`; \}\>
