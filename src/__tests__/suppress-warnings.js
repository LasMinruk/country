// Suppress Node.js deprecation warnings
const originalEmitWarning = process.emitWarning;
process.emitWarning = (warning, ...args) => {
  if (warning.includes('punycode')) {
    return;
  }
  return originalEmitWarning(warning, ...args);
}; 