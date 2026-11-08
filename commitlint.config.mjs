export default {
  extends: ['@commitlint/config-conventional'],
  ignores: [message => /^chore\(main\): release \d/.test(message)],
};
