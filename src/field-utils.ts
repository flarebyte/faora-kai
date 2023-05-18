export const isSingleLine = (value: string) =>
  value.split(/[\n\r]/).length <= 1;
export const keyName = /[a-z][\d_a-z]+/;
