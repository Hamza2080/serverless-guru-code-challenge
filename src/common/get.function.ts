export const get = (object: any, path: string, defaultValue: any) => path.split('.').reduce((o, k) => (o || {})[k] || defaultValue, object);
