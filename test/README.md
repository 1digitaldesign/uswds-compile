# USWDS Compile Tests

This directory contains tests for the USWDS Compile package.

## Test Structure

- `unit/`: Unit tests for individual components
  - `settings.test.js`: Tests for settings and configuration
  - `utilities.test.js`: Tests for utility functions
  - `tasks.test.js`: Tests for task functions
- `integration.test.js`: Integration tests that actually run the gulp tasks
- `test-helpers.js`: Helper functions for tests

## Running Tests

To run the tests:

```bash
npm test
```

To see test coverage:

```bash
npm run test:coverage
```

By default, integration tests are skipped because they:
1. Take longer to run
2. Require more setup (creating test dirs, files, etc.)
3. Actually execute gulp tasks

To run integration tests, change `describe.skip` to `describe` in the integration test file.

## Adding New Tests

When adding new tests:

1. Unit tests should be placed in the `unit/` directory
2. Integration tests should be added to the `integration.test.js` file
3. Use the helper functions in `test-helpers.js` for common operations

## Best Practices

- Tests should be independent and not rely on the state from other tests
- Clean up any resources (files, directories) created during tests
- Use sinon to stub/mock external dependencies
- Use chai assertions for consistent validation