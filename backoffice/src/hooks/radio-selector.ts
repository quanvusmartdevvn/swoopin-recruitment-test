import { useCallback, useEffect, useState } from 'react'

export default function useRadioSelector(initial: any) {
    const [selected, setSelected] = useState(initial)
    const isSelected = useCallback(s => selected === s, [selected])
    const select = useCallback((s) => {
        if (selected === s) {
            setSelected(initial)
        } else {
            setSelected(s)
        }
    }, [selected])

    useEffect(() => setSelected(initial), [initial])

    return {
        select,
        selected,
        isSelected,
    }
}
