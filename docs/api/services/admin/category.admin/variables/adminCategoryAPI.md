# Variable: adminCategoryAPI

> `const` **adminCategoryAPI**: `object`

Defined in: [services/admin/category.admin.ts:4](https://github.com/maliccstore/malicc-store/blob/dfca1e99c38062c5af487ee73ad4d7f8e5c53d75/src/services/admin/category.admin.ts#L4)

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
