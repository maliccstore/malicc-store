# Variable: adminCouponAPI

> `const` **adminCouponAPI**: `object`

Defined in: [services/admin/coupon.admin.ts:4](https://github.com/maliccstore/malicc-store/blob/dfca1e99c38062c5af487ee73ad4d7f8e5c53d75/src/services/admin/coupon.admin.ts#L4)

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
