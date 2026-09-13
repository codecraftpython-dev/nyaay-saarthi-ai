import fs from 'fs';
let portalData = fs.readFileSync('src/data/portalData.ts', 'utf8');
portalData = portalData.replace(/export const INITIAL_APPOINTMENTS: Appointment\[\] = \[[\s\S]*?\];\s*\/\/ LocalStorage helpers/m, 'export const INITIAL_APPOINTMENTS: Appointment[] = [];\n\n// LocalStorage helpers');
fs.writeFileSync('src/data/portalData.ts', portalData);
