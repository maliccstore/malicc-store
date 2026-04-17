# Type Alias: Rating

> **Rating** = `"1"` \| `"2"` \| `"3"` \| `"4"`

Defined in: [types/rating.d.ts:12](https://github.com/maliccstore/malicc-store/blob/66610a5232f27d4109b9b25550eef36086e83bda/src/types/rating.d.ts#L12)

Represents a rating value as a string, ranging from "1" to "4".
- "1": Poor
- "2": Fair
- "3": Good
- "4": Excellent

## Example

```ts
const userRating: Rating = "3"; // Valid
const invalidRating: Rating = "5"; // ❌ Error: Not allowed
```
