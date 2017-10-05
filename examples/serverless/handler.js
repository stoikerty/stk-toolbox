const path = require('path');

// Example of programmatic usage of dev-toolkit with a serverless-type application
require('dev-toolkit').default({
  command: 'preRender',
  options: {
    entryPoint: path.resolve(process.cwd(), 'src/server/preRender');
  },
  // Environment variables (which might not be available depending on your setup) can be passed
  // separately as an `envs`-object, they will be transformed into environment variables on the fly.
  envs: {
    NODE_ENV: 'production',
    MY_CUSTOM_ENV: 'foo-from-handler',
  },
});
