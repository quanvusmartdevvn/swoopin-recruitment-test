import React from 'react'
import { classNamesPrefix } from 'utils/react'

import { toJS } from 'mobx'
import { observer } from 'mobx-react'

import state from 'state'

import { useMemo } from 'hooks'

import {
    FaArrowLeft,
    FaCheck,
    FaChevronDown,
    FaSignOutAlt,
    FaUserCircle,
} from 'components/shared/icons'
import { Link, Dropdown } from 'components/shared/semantics'

import './top-bar.scss'

const block = 'top-bar'
const cx = classNamesPrefix(block)

const TopBar = observer(({ location } : { location: any }) => {
    const { topBar } = state.layout
    const { userName } = state.profile

    // Hooks
    const configs: any = useMemo(() => ({
        'back': {
            icon: FaArrowLeft,
            to: '#',
            state: null,
            onClick: (e: any) => {
                e.preventDefault()
                window.history.back()
            },
        },
        'submit': {
            icon: ({ className } : { className: string }) => (
                <FaCheck
                    className={cx(className, '__submit')}
                />
            ),
            to: null,
            onClick: null,
            state: null,
        },
        'submit-disabled': {
            icon: ({ className } : { className: string }) => (
                <FaCheck
                    className={cx(className, '__submit', '__submit--disabled')}
                />
            ),
            to: null,
            onClick: null,
            state: null,
        },
    }), [location.pathname, location.state && location.state.from])

    const defaultConfig = useMemo(() => ({
        icon: () => null,
        to: null,
        onClick: null,
        state: null,
    }), [])

    const left = (state.layout.topBar.left && configs[state.layout.topBar.left.type || '']) || defaultConfig
    const right = (state.layout.topBar.right && configs[state.layout.topBar.right.type || '']) || defaultConfig

    const LeftIcon = left.icon
    const RightIcon = right.icon

    const TitleIcon = topBar.titleIcon || (() => null)

    return (
        <header className={cx(block, {})}>
            {
                (topBar.left && topBar.left.type === 'custom' && topBar.left.component) ? (
                    <div className={cx('left-action', 'no-desktop')}>
                        {<topBar.left.component />}
                    </div>
                ) : (
                    <Link
                        to={(topBar.left && topBar.left.to) || left.to || '#'}
                        onClick={(topBar.left && topBar.left.onClick) || left.onClick}
                        state={toJS((topBar.left && topBar.left.state) || left.state)}
                        className={cx('__left-action', { 'no-desktop': !topBar.left || topBar.left.type !== 'back' })}
                    >
                        <LeftIcon className={cx('__action-icon')} />
                    </Link>
                )
            }
            <div className={cx('__title')}>
                <TitleIcon className={cx('__title-icon', 'no-mobile')} />
                <span className={cx('__title-text')}>
                    {topBar.title}
                </span>
            </div>
            {
                (topBar.right && topBar.right.type === 'custom' && topBar.right.component) ? (
                    <div className={cx('__right-action', 'no-desktop')}>
                        {<topBar.right.component />}
                    </div>
                ) : (
                    <Link
                        to={(topBar.right && topBar.right.to) || right.to || '#'}
                        onClick={(topBar.right && topBar.right.onClick) || right.onClick}
                        state={toJS((topBar.right && topBar.right.state) || right.state)}
                        className={cx('__right-action', 'no-desktop')}
                    >
                        <RightIcon className={cx('__action-icon')} />
                    </Link>
                )
            }
            <div className={cx(
                '__right-menu',
                'no-mobile',
            )}
            >
                <Dropdown className={cx('__user-profile', {})}>
                    <Dropdown.Toggle className={cx('__user-profile-toggle')} id="top-bar__user-profile">
                        <FaUserCircle />
                        <span className={cx('__user-profile-name')}>
                            {userName}
                        </span>
                        <FaChevronDown className={cx('__user-profile-carret')} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item
                            onClick={() => {
                                state.session.updateToken(false)
                            }}
                            className={cx('__user-profile-entry')}
                        >
                            <FaSignOutAlt className={cx('__user-profile-icon')} />
                            {' '}
                            Déconnecter
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </header>
    )
})

export default TopBar
