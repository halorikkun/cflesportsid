import { checkData } from './data-tools.mjs';
try {
  const { errors, warnings, data } = checkData();
  for (const message of errors) console.error(`ERROR ${message}`);
  for (const message of warnings) console.warn(`WARNING ${message}`);
  console.log(`Checked ${Object.values(data).reduce((n, entries) => n + entries.size, 0)} valid records: ${errors.length} errors, ${warnings.length} warnings.`);
  process.exitCode = errors.length ? 1 : 0;
} catch (e) { console.error(`Data check failed: ${e.message}`); process.exitCode = 1; }
