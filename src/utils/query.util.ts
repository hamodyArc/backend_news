export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 5;

export const toPositiveInteger = (
  value: string | undefined,
  fallback: number,
): number => {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) return fallback;
  return parsed;
};

export const capLimit = (limit: number, maxLimit: number = MAX_LIMIT): number =>
  Math.min(limit, maxLimit);

export const parseBoolean = (value?: string): boolean | undefined => {
  if (value === undefined) return undefined;
  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "y"].includes(normalized)) return true;
  if (["false", "0", "no", "n"].includes(normalized)) return false;
  return undefined;
};

export const parseSort = (
  sortParam: string | undefined,
  allowedFields: string[],
  defaultSort: string,
): Record<string, 1 | -1> => {
  const sortValue = sortParam ?? defaultSort;
  const direction: 1 | -1 = sortValue.startsWith("-") ? -1 : 1;
  const field = sortValue.replace(/^-/, "");

  if (!allowedFields.includes(field)) {
    const fallbackDirection: 1 | -1 = defaultSort.startsWith("-") ? -1 : 1;
    const fallbackField = defaultSort.replace(/^-/, "");
    return { [fallbackField]: fallbackDirection };
  }

  return { [field]: direction };
};

export const parseProjection = (
  fieldsParam: string | undefined,
  allowed: string[],
): string | undefined => {
  if (!fieldsParam) return undefined;

  const requested = fieldsParam
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean);

  const safeFields = requested.filter((field) => allowed.includes(field));

  if (safeFields.length === 0) return undefined;

  return safeFields.join(" ");
};

export const buildSearchQuery = (
  search: string | undefined,
  searchFields: string[],
): Record<string, unknown> | undefined => {
  if (!search) return undefined;
  const regex = new RegExp(search, "i");
  return { $or: searchFields.map((field) => ({ [field]: regex })) };
};
