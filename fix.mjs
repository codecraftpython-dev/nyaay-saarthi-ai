import fs from 'fs';
const file = 'src/server/dbHandler.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/const pool = getPool\(\);\s*if \(pool\) \{\s*await initDatabase\(\);/g, 'await initDatabase();\n    const pool = getPool();\n    if (pool) {');

content = content.replace(/const pool = getPool\(\);\s*const passwordHash = await bcrypt\.hash\(password, 10\);\s*const userId = \([^;]+;\s*if \(pool\) \{\s*await initDatabase\(\);/g, 'await initDatabase();\n    const pool = getPool();\n    const passwordHash = await bcrypt.hash(password, 10);\n    const userId = (cleanRole === \'advocate\' ? \'adv_\' : \'usr_\') + Date.now().toString().slice(-6);\n    if (pool) {');

content = content.replace(/const pool = getPool\(\);\s*const aptId = apt\.id \|\| `apt_\$\{Date\.now\(\)\}`;(?:[\s\n]*)if \(pool\) \{\s*await initDatabase\(\);/g, 'await initDatabase();\n    const pool = getPool();\n    const aptId = apt.id || `apt_${Date.now()}`;\n    if (pool) {');

content = content.replace(/const pool = getPool\(\);\s*const id = appData\.id \|\| `app_\$\{Date\.now\(\)\}`;\s*const applicationId = appData\.applicationId \|\| `NS-\$\{Date\.now\(\)\.toString\(\)\.slice\(-4\)\}`;(?:[\s\n]*)if \(pool\) \{\s*await initDatabase\(\);/g, 'await initDatabase();\n    const pool = getPool();\n    const id = appData.id || `app_${Date.now()}`;\n    const applicationId = appData.applicationId || `NS-${Date.now().toString().slice(-4)}`;\n    if (pool) {');

fs.writeFileSync(file, content);
