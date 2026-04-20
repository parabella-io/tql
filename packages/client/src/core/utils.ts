export const deepPartialMatch = (target: any, partial: any): boolean => {
  if (Object.is(target, partial)) return true;

  if (Array.isArray(partial)) {
    if (!Array.isArray(target)) return false;
    return partial.every((p) => target.some((t) => deepPartialMatch(t, p)));
  }

  if (typeof partial !== 'object' || partial === null || typeof target !== 'object' || target === null) {
    return Object.is(target, partial);
  }

  return Object.keys(partial).every((key) => deepPartialMatch(target[key], partial[key]));
};
