'use strict'

module.exports = {
  '*.md': filenames => {
    const list = filenames.map(filename => `'markdown-toc -i ${filename}`)
    return list
  },
  '*.js': ['standard --fix'],
  '*.d.ts': ['standard --parser @typescript-eslint/parser --plugin @typescript-eslint/eslint-plugin --fix']
}
