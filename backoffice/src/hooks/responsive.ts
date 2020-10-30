import useWindowSize from '@rehooks/window-size'

export default () => {
    const { innerWidth, innerHeight } = useWindowSize()

    return {
        isMobile: innerWidth <= 620,
        isDesktop: innerWidth > 620,
        isMobileWidth: innerWidth <= 620,
        isDesktopWidth: innerWidth > 620,
        width: innerWidth,
        height: innerHeight,
    }
}
