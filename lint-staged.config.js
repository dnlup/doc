'use strict'

module.exports = {
  '*.md': filenames => {
    const list = filenames.map(filename => `'markdown-toc -i ${filename}`)
    return list
  },
  '*.{js,d.ts}': ['standard --fix']
}
