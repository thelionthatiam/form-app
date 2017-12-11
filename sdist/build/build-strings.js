"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buildTables = ' -a -f ./sdist/build/database-build.sql';
exports.buildTables = buildTables;
const noTable = /(0 rows)/g;
exports.noTable = noTable;
//# sourceMappingURL=build-strings.js.map