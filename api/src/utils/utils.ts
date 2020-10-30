import moment from 'moment'
import colorize from 'json-colorizer'

const isFunction = (functionToCheck: any) => functionToCheck
    && {}.toString.call(functionToCheck) === '[object Function]'

const printJSON = (object: any) => console.info(colorize(JSON.stringify(object, null, 4)))

export {
    isFunction,
    colorize,
    printJSON,
}
