"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buildTables = ' -a -f ./database-build.sql';
exports.buildTables = buildTables;
const noTable = /(relation).+(does not exist)/g;
exports.noTable = noTable;
//# sourceMappingURL=build-strings.js.map