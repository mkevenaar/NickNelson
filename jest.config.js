export default {
    testEnvironment: "node",
    testTimeout: 5000,
    modulePathIgnorePatterns: [
        "index.js",
        "migrate-mongo-config.js",
        ".eslintrc.js",
        "jest.config.js",
        "assets",
        "coverage",
        "docker",
        "file-uploads",
        "node_modules",
        "logs",
        "views"
    ],
    globalSetup: "./test/setup-global.js",
    setupFilesAfterEnv: [],
    collectCoverageFrom: ["**/*.js"],
    coveragePathIgnorePatterns: ["node_modules", "test"]
};
