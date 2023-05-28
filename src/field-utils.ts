export const isSingleLine = (value: string) =>
  value.split(/[\n\r]/).length <= 1;
