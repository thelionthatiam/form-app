const buildTables = ' -a -f ./sdist/build/database-build.sql';
const noTable = /(relation).+(found.)/g
export { buildTables, noTable };
