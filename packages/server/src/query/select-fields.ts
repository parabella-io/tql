type Select = true | Record<string, any>;

const isPlainObject = (v: unknown): v is Record<string, any> => {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
};

/**
 * Applies a "select" tree to an object/array.
 *
 * Rules:
 * - select === true -> return data as-is
 * - select[key] === true -> include full value for that key
 * - select[key] is an object -> recurse into that value (object or array of objects)
 * - Arrays:
 *   - if select is object and value is an array of objects -> map recursion
 *   - if value is an array of non-objects and select is not true -> return the array as-is (best-effort)
 */
export const selectFields = <T>(data: T, select: Select): any => {
  if (select === true) {
    return data;
  }

  select = {
    ...select,
    id: true,
    __model: true,
  };

  // Array root
  if (Array.isArray(data)) {
    return data.map((item) => (isPlainObject(item) ? selectFields(item, select) : item));
  }

  // Non-object / null root
  if (!isPlainObject(data)) {
    return data;
  }

  const out: Record<string, any> = {};

  for (const key of Object.keys(select)) {
    const rule = select[key];
    if (!rule) continue;

    const value = (data as Record<string, any>)[key];

    if (rule === true) {
      out[key] = value;
      continue;
    }

    // Nested selection
    if (Array.isArray(value)) {
      // array of objects -> apply nested select to each object
      if (value.every((v) => isPlainObject(v))) {
        out[key] = value.map((v) => selectFields(v, rule));
      } else {
        // best-effort: selection object over scalar array is invalid; keep array unchanged
        out[key] = value;
      }
      continue;
    }

    if (isPlainObject(value)) {
      out[key] = selectFields(value, rule);
      continue;
    }

    // best-effort: selection object over scalar is invalid; omit
  }

  return out;
};
