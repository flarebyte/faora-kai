/**
 * Describe an Zod enum
 * @param introduction The first line introduction sentence
 * @param objectValue An object containing the enum value as string and the description as value
 * @returns a string with a long description
 */
export const describeEnum = (
  introduction: string,
  objectValue: Record<string, string>
): string => {
  const description = [introduction];
  for (const [name, title] of Object.entries(objectValue)) {
    description.push(`${name}: ${title}`);
  }

  return description.join('\n');
};
