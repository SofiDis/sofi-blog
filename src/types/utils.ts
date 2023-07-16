/**
 * Get more info about nested types.
 * @example
 * // type Thing = Prettify<BlockObjectResponse>;
 */
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
