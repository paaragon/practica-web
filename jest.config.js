module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.js"], // Apunta a los archivos de la API
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"], // Formatos de salida
};
