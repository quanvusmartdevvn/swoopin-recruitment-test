import React from 'react'

import { useCallback, useState } from 'hooks'

import {
    FaCheckSquare, FaMinusSquare, FaSquare, FaRegSquare,
} from 'components/shared/icons'

import './checkbox.scss'

const Checkbox = React.memo(({
    id, checked, mixed, outline, onChange, children,
} : {
    id: string,
    checked?: boolean,
    mixed?: boolean,
    outline?: boolean,
    onChange?: (any: any) => void,
    children?: any,
}) => {
    const [checkedState, setChecked] = useState(false)

    const handlePropagation = useCallback(e => e.stopPropagation(), [])
    const handleChange = useCallback((e) => {
        setChecked(e.target.checked)

        if (onChange) {
            onChange(e)
        }
    }, [])

    const isMixed = !!mixed
    const isChecked = !isMixed && checked === undefined ? checkedState : checked
    const isEmpty = !isMixed && !isChecked

    return (
        <label htmlFor={id} className="checkbox" onClick={handlePropagation}>
            <input id={id} name={id} type="checkbox" onChange={handleChange} defaultChecked={!isEmpty} />

            { isChecked && <FaCheckSquare className="checked" /> }
            { isMixed && <FaMinusSquare className="mixed" /> }
            { isEmpty && !outline && <FaSquare className="unchecked" /> }
            { isEmpty && outline && <FaRegSquare className="unchecked" /> }

            { children }
        </label>
    )
})

export default Checkbox
