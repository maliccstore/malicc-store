# Variable: adminCouponAPI

> `const` **adminCouponAPI**: `object`

Defined in: [services/admin/coupon.admin.ts:4](https://github.com/maliccstore/malicc-store/blob/66610a5232f27d4109b9b25550eef36086e83bda/src/services/admin/coupon.admin.ts#L4)

## Type Declaration

### create

> **create**: (`data`) => `Promise`\<\{ `data`: `AdminCoupon`; \}\>

#### Parameters

##### data

`CreateCouponInput`

#### Returns

`Promise`\<\{ `data`: `AdminCoupon`; \}\>

### disable

> **disable**: (`id`) => `Promise`\<\{ `data`: `AdminCoupon`; \}\>

#### Parameters

##### id

`string`

#### Returns

`Promise`\<\{ `data`: `AdminCoupon`; \}\>

### getAll

> **getAll**: (`filters?`) => `Promise`\<\{ `data`: `AdminCoupon`[]; `totalCount`: `any`; \}\>

#### Parameters

##### filters?

###### isActive?

`boolean`

###### limit?

`number`

###### offset?

`number`

#### Returns

`Promise`\<\{ `data`: `AdminCoupon`[]; `totalCount`: `any`; \}\>

### getById

> **getById**: (`id`) => `Promise`\<\{ `data`: `AdminCoupon`; \}\>

#### Parameters

##### id

`string`

#### Returns

`Promise`\<\{ `data`: `AdminCoupon`; \}\>

### update

> **update**: (`id`, `data`) => `Promise`\<\{ `data`: `AdminCoupon`; \}\>

#### Parameters

##### id

`string`

##### data

`UpdateCouponInput`

#### Returns

`Promise`\<\{ `data`: `AdminCoupon`; \}\>
