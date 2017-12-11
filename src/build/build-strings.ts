const buildTables = ' -a -f ./sdist/build/database-build.sql';
const noTable = /(0 rows)/g
export { buildTables, noTable };
