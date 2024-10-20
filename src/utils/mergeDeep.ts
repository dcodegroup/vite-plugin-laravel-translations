/**
 *    Function: mergeDeep()
 *    Description: Method used to deeply merge objects that are nested.
 *
 *    @param target - Main Object to merge into
 *    @param source - Object 2 containing data to merge into main object
 *    @returns target
 */
// @ts-ignore - Unknown object definitions
export const mergeDeep = (target, source) => {
  // @ts-ignore - Unknown object definitions
  const isObject = (obj) => obj && typeof obj === 'object';

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  Object.keys(source).forEach((key) => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });

  return target;
};
