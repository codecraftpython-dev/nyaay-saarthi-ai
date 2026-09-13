import fs from 'fs';

// Clear src/data/portalData.ts
let portalData = fs.readFileSync('src/data/portalData.ts', 'utf8');
portalData = portalData.replace(/export const INITIAL_ADVOCATES: Advocate\[\] = \[[\s\S]*?\];\s*export const MOCK_ADVOCATES/m, 'export const INITIAL_ADVOCATES: Advocate[] = [];\n\nexport const MOCK_ADVOCATES');
portalData = portalData.replace(/export const INITIAL_APPLICATIONS: Application\[\] = \[[\s\S]*?\];\s*export const INITIAL_APPOINTMENTS/m, 'export const INITIAL_APPLICATIONS: Application[] = [];\n\nexport const INITIAL_APPOINTMENTS');
portalData = portalData.replace(/export const INITIAL_APPOINTMENTS: Appointment\[\] = \[[\s\S]*?\];\s*export const INITIAL_FEEDBACKS/m, 'export const INITIAL_APPOINTMENTS: Appointment[] = [];\n\nexport const INITIAL_FEEDBACKS');
portalData = portalData.replace(/export const INITIAL_FEEDBACKS: AdvocateFeedback\[\] = \[[\s\S]*?\];\s*export function/m, 'export const INITIAL_FEEDBACKS: AdvocateFeedback[] = [];\n\nexport function');
fs.writeFileSync('src/data/portalData.ts', portalData);

// Clear src/components/dashboard/AdvocateDashboardPage.tsx
let advPage = fs.readFileSync('src/components/dashboard/AdvocateDashboardPage.tsx', 'utf8');
advPage = advPage.replace(/const INITIAL_REQUESTS: ConsultationRequest\[\] = \[[\s\S]*?\];\s*export function AdvocateDashboardPage/m, 'const INITIAL_REQUESTS: ConsultationRequest[] = [];\n\nexport function AdvocateDashboardPage');
fs.writeFileSync('src/components/dashboard/AdvocateDashboardPage.tsx', advPage);
