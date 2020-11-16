module.exports = {
    testMatch: ['**/__tests__/**/*.+(ts|js)?(x)'],
    setupFilesAfterEnv: ['./jest.setup.js'],

      reporters: [
          "default",
          ["../node_modules/jest-html-reporter", {
              "pageTitle": "Test Report"
          }]
      ]
  }