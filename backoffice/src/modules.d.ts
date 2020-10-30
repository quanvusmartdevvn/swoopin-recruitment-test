declare module 'rodal' {
  import React from 'react'

  type RodalAnimation = 'zoom'|'fade'|'flip'|'door'|'rotate'|'slideUp'|'slideDown'|'slideLeft'|'slideRight'

  export type Rodal = React.FC<{
    width?: number
    height?: number
    measure?: string
    onClose: () => void
    onAnimationEnd?: () => void
    visible: boolean
    showMask?: boolean
    closeOnEsc?: boolean
    closeMaskOnClick?: boolean
    showCloseButton?: boolean
    animation?: RodalAnimation
    enterAnimation?: RodalAnimation
    leaveAnimation?: RodalAnimation
    duration?: number
    className?: string
    customStyles?: any
    customMaskStyles?: React.CSSProperties
  }>

  const Rodal : Rodal

  export default Rodal
}
