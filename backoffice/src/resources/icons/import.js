const fs = require('fs')

const files = fs.readdirSync('./')
    .filter(f => f.endsWith('.svg'))
    .map((f) => {
        const base = f.split('.svg')[0]

        const words = base
            .split('-')
            .map(word => word[0].toUpperCase() + word.slice(1))

        return `// @ts-ignore
export { default as ${words.join('')} } from './${f}'`
    })
files.push('')

fs.writeFileSync('./index.ts', files.join('\n'), 'utf-8')
