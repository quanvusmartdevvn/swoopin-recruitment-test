// @ts-ignore
import React from 'react'
import { reaction } from 'mobx'

export { default as classNamesPrefix } from 'classnames-prefix'

export class ObserverComponent<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {
    constructor(props) {
        super(props)

        const { __wrapped } = props

        if (!__wrapped) {
            const Wrapped = this.constructor

            if (Wrapped === ObserverComponent) {
                throw new Error('ObserverWrapperComponent should not be instantiated directly')
            }

            this.render = () => (
                <Wrapped {...this.props} __wrapped={() => this.forceUpdate()} />
            )

          // Disable lifecycle methods for wrapper component
            this.componentDidMount = () => null
            this.componentDidUpdate = () => null
            this.componentWillUnmount = () => null
        } else {
            const { componentDidMount, componentWillUnmount } = this

            // Patch lifecycle methods for wrapped component
            this.componentDidMount = () => {
                const dispose = reaction(
                    () => this.render(),
                    __wrapped,
                )

                this.componentWillUnmount = () => {
                    dispose()
                    if (componentWillUnmount) {
                        componentWillUnmount.bind(this)()
                    }
                }

                if (componentDidMount) {
                    componentDidMount.bind(this)()
                }
            }
        }
    }
}


// @ts-ignore
export class PureObserverComponent<P = {}, S = {}, SS = any> extends React.PureComponent<P, S, SS> {
    constructor(props) {
        super(props)

        const { __wrapped } = props

        if (!__wrapped) {
            const Wrapped = this.constructor

            if (Wrapped === PureObserverComponent) {
                throw new Error('PureObserverComponent should not be instantiated directly')
            }

            this.state = {
                // @ts-ignore
                __computed: this.observe(),
            }

            const watch = (__computed) => {
                // @ts-ignore
                this.setState({ __computed })
            }

            this.render = () => {
                // @ts-ignore
                const { __computed } = this.state

                return (
                // @ts-ignore
                    <Wrapped {...this.props} __wrapped={watch} {...__computed} />
                )
            }

            // Disable lifecycle methods for wrapper component
            this.componentDidMount = () => null
            this.componentDidUpdate = () => null
            this.componentWillUnmount = () => null
        } else {
            const { componentDidMount, componentWillUnmount } = this

            // Patch lifecycle methods for wrapped component
            this.componentDidMount = () => {
                const dispose = reaction(
                    () => this.observe && this.observe(),
                    __wrapped,
                )

                this.componentWillUnmount = () => {
                    dispose()
                    if (componentWillUnmount) {
                        componentWillUnmount.bind(this)()
                    }
                }

                if (componentDidMount) {
                    componentDidMount.bind(this)()
                }
            }
        }
    }

    observe?(): Partial<P>
}
