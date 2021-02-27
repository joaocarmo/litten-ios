module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'dotenv-import',
      {
        allowUndefined: false,
        moduleName: '@env',
        path: '.env',
        safe: false,
        whitelist: [
          'FIREBASE_AUTH_EMULATOR_HOST',
          'FIRESTORE_EMULATOR_HOST',
          'FIRESTORE_EMULATOR_PERSISTENCE',
          'GOOGLE_API_KEY',
          'IS_BETA_RELASE',
          'JIRA_API_KEY',
          'JIRA_EMAIL',
          'SLACK_WEBHOOK_URL',
          'USE_FIREBASE_EMULATOR',
          'USE_GRAVATAR',
          'USE_REDUX_DEVTOOLS_LOCAL_SERVER',
        ],
      },
    ],
    [
      '@babel/plugin-transform-react-jsx',
      {
        runtime: 'automatic',
      },
    ],
    ['macros'],
  ],
}
