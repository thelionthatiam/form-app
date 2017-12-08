const buildTables = ' -a -f ./sdist/build/database-build.sql';
const noTable = /(relation).+(does not exist)/g
export { buildTables, noTable };
