// @ts-check

const commitlintConfig = {
  extends: ['@commitlint/config-conventional'],
  ignores: [
    /** @param {string} message */
    message => /^chore\(main\): release \d/.test(message),
  ],
};

export default commitlintConfig;
