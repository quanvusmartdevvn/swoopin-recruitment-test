import colorize from 'json-colorizer';
const isFunction = (functionToCheck) => functionToCheck
    && {}.toString.call(functionToCheck) === '[object Function]';
const printJSON = (object) => console.info(colorize(JSON.stringify(object, null, 4)));
export { isFunction, colorize, printJSON, };
