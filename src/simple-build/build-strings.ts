const buildTables = ' -a -f ./database-build.sql';
const noTable = /(relation).+(does not exist)/g
export { buildTables, noTable };
