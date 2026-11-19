import { lazy } from 'react';

const modules = import.meta.glob('../pages/*.jsx');
export function lazyPage(name) {
  return lazy(modules[`../pages/${name}.jsx`]);
}