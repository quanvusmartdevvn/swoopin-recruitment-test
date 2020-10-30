import React from 'react'
import { observer } from 'mobx-react'

import { classNamesPrefix } from 'utils/react'

import { useLayoutConfig } from 'hooks'

import SEO from 'components/layout/seo'
import {
    IconMenuHome, MdDashboard,
} from 'components/shared/icons'

import './home.scss'


const block = 'page-home'
const cx = classNamesPrefix(block)

const PageHome = observer(() => {

    useLayoutConfig({
        topBar: {
            titleIcon: IconMenuHome,
            title: 'Accueil',
        },
    })

    return (
        <section id="page-home" className={block}>
            <SEO title='title' />

            <h2 className={cx('__title')}>
                <MdDashboard className={cx('__title-icon', 'desktop')} />
                Bienvenue sur l'accueil du test de recrutement Swoopin !
            </h2>

        </section>
    )
})

export default PageHome
