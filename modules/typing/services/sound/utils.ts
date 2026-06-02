export const randomElementFromArray = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)] as T;
