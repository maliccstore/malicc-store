# Variable: productService

> `const` **productService**: `object`

Defined in: [services/product.service.ts:7](https://github.com/maliccstore/malicc-store/blob/dfca1e99c38062c5af487ee73ad4d7f8e5c53d75/src/services/product.service.ts#L7)

## Type Declaration

### createReview

> **createReview**: (`input`) => `Promise`\<[`Review`](../../../types/review/interfaces/Review.md)\>

#### Parameters

##### input

[`CreateReviewInput`](../../../types/review/interfaces/CreateReviewInput.md)

#### Returns

`Promise`\<[`Review`](../../../types/review/interfaces/Review.md)\>

### deleteReview

> **deleteReview**: (`id`) => `Promise`\<`boolean`\>

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`boolean`\>

### fetchProducts

> **fetchProducts**: (`filters?`) => `Promise`\<[`Product`](../../../types/product/type-aliases/Product.md)[]\>

#### Parameters

##### filters?

[`ProductFilterInput`](../../../types/product/interfaces/ProductFilterInput.md)

#### Returns

`Promise`\<[`Product`](../../../types/product/type-aliases/Product.md)[]\>

### getProductRatingSummary

> **getProductRatingSummary**: (`productId`) => `Promise`\<[`ProductRatingSummary`](../../../types/review/interfaces/ProductRatingSummary.md)\>

#### Parameters

##### productId

`string`

#### Returns

`Promise`\<[`ProductRatingSummary`](../../../types/review/interfaces/ProductRatingSummary.md)\>

### getProductReviews

> **getProductReviews**: (`productId`) => `Promise`\<[`Review`](../../../types/review/interfaces/Review.md)[]\>

#### Parameters

##### productId

`string`

#### Returns

`Promise`\<[`Review`](../../../types/review/interfaces/Review.md)[]\>

### updateReview

> **updateReview**: (`id`, `input`) => `Promise`\<[`Review`](../../../types/review/interfaces/Review.md)\>

#### Parameters

##### id

`string`

##### input

[`UpdateReviewInput`](../../../types/review/interfaces/UpdateReviewInput.md)

#### Returns

`Promise`\<[`Review`](../../../types/review/interfaces/Review.md)\>
