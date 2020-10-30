import { observable, when} from 'mobx'
import { axios, base64 } from 'utils/misc'

type Configuration = {

        endpoint?: {
            host?: string
        }
        mapbox?: {
            accessToken?: string
        }
        showEnvironment?: string,

}

export default class StateConfiguration implements Promise<any> {
    @observable initialized = false

    @observable online = true

    @observable configuration : Configuration = {}

    @observable mapbox = { accessToken: '' }

    constructor() {
        // Only load configuration on client
        if (typeof window !== 'undefined') {
            // Add cache busting for up-to-date configuration
            axios.get(`/configuration.json?ts=${Date.now()}`)
                .then((result) => {
                    this.configuration = JSON.parse(base64.decode(result.data))
                    this.mapbox.accessToken = this.configuration.mapbox!.accessToken!
                    this.initialized = true
                })

            this.online = window.navigator && window.navigator.onLine

            window.addEventListener('online', () => {
                this.online = true
            })

            window.addEventListener('offline', () => {
                this.online = false
            })
        }
    }

    readonly [Symbol.toStringTag]: string

    catch<TResult = never>(): Promise<undefined> {
        return Promise.resolve(undefined)
    }

    finally(): Promise<StateConfiguration> {
        return this.then()
    }

    then<
        TResult1 = any,
        TResult2 = never
    >(
        onfulfilled?: ((value: any) => (PromiseLike<TResult1> | TResult1)) | undefined | null,
        onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | undefined | null,
    ): Promise<TResult1 | TResult2> {
        if (this.initialized && onfulfilled) {
            onfulfilled(this.configuration)
        }

        return new Promise((resolve) => {
            when(() => this.initialized, () => resolve(this.configuration))
        })
            .then(onfulfilled)
            .catch(onrejected)
    }
}
