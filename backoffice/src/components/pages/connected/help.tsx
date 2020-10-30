import React from 'react'
import { observer } from 'mobx-react'

import { classNamesPrefix } from 'utils/react'

import { useLayoutConfig } from 'hooks'

import SEO from 'components/layout/seo'
import {
    IconHelp, MdDashboard,
} from 'components/shared/icons'

import './help.scss'

const block = 'page-help'
const cx = classNamesPrefix(block)

const PageHelp = observer(() => {

    useLayoutConfig({
        topBar: {
            titleIcon: IconHelp,
            title: 'Aide',
        },
    })

    return (
        <section id="page-help" className={block}>
            <SEO title='title' />

            <h2 className={cx('__title')}>
                <MdDashboard className={cx('__title-icon', 'desktop')} />
                Page d'aide !
            </h2>

        </section>
    )
})

export default PageHelp
