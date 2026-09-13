import fs from 'fs';
let advPage = fs.readFileSync('src/components/dashboard/AdvocateDashboardPage.tsx', 'utf8');
advPage = advPage.replace(/const INITIAL_REQUESTS: ConsultationRequest\[\] = \[[\s\S]*?\];\s*interface AdvocateDashboardPageProps/m, 'const INITIAL_REQUESTS: ConsultationRequest[] = [];\n\ninterface AdvocateDashboardPageProps');
fs.writeFileSync('src/components/dashboard/AdvocateDashboardPage.tsx', advPage);
