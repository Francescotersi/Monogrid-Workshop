import perfectionist from 'eslint-plugin-perfectionist'
import neostandard from 'neostandard'

export default [
  ...neostandard({
    ts: true,
    ignores: ['dist/**', 'node_modules/**'],
  }),
  {
    plugins: { perfectionist },
    rules: {
      'perfectionist/sort-imports': 'error',
    },
  },
]
