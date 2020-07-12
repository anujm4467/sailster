module.exports = {
  collectCoverage: true,
  reporters: [
    'default',
    [
      'jest-junit',
      {
        "outputDirectory": "./test-results/jest",
        "outputName": "results.xml",
      },
    ],
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png)$": "<rootDir>/__mocks__/image.js",
    "^@lib/(.*)$": "<rootDir>/src/lib/$1",
  },
  preset: "jest-preset-angular",
  setupFilesAfterEnv: [
    "<rootDir>/setupJest.ts",
  ],
  snapshotSerializers: [
    "jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js",
    "jest-preset-angular/build/AngularSnapshotSerializer.js",
    "jest-preset-angular/build/HTMLCommentSerializer.js",
  ],
};
