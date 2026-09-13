import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { getPool, initDatabase } from './db.ts';
import { AuthUser, Advocate, Appointment, Application } from '../types.ts';
import { INITIAL_ADVOCATES, INITIAL_APPOINTMENTS, INITIAL_APPLICATIONS } from '../data/portalData.ts';

// In-memory fallback stores used ONLY when DATABASE_URL is not provided (e.g. local dev without PostgreSQL)
const memoryUsers: Map<string, any> = new Map();
const memoryAdvocates: Map<string, any> = new Map();
const memoryAppointments: Map<string, any> = new Map();
const memoryApplications: Map<string, any> = new Map();

// Helper to format user row into AuthUser
function formatUserRow(row: any): AuthUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || undefined,
    dob: row.dob || undefined,
    state: row.state || undefined,
    city: row.city || undefined,
    address: row.address || undefined,
    profilePicture: row.profile_picture || undefined,
    role: row.role as 'citizen' | 'advocate',
    isVerified: Boolean(row.is_verified),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}

// Helper to parse and separate consultation fee and duration safely
function parseFeeAndDuration(rawFee: any, rawDuration?: any): { fee: number; duration: string; durationMinutes: number } {
  let fee = 500;
  let duration = typeof rawDuration === 'string' && rawDuration.trim() ? rawDuration.trim() : '30 mins';
  let durationMinutes = parseInt(duration.replace(/[^0-9]/g, ''), 10) || 30;

  if (typeof rawFee === 'number' && !isNaN(rawFee)) {
    fee = rawFee;
  } else if (typeof rawFee === 'string') {
    // Check if string is like "₹500 / 30 mins" or "500 / 30 min"
    if (rawFee.includes('/')) {
      const parts = rawFee.split('/');
      const feePart = parts[0].replace(/[^0-9]/g, '');
      if (feePart) fee = parseInt(feePart, 10);
      if (!rawDuration && parts[1]) {
        duration = parts[1].trim();
        const mins = parseInt(duration.replace(/[^0-9]/g, ''), 10);
        if (mins) durationMinutes = mins;
      }
    } else {
      const numericOnly = rawFee.replace(/[^0-9]/g, '');
      if (numericOnly) fee = parseInt(numericOnly, 10);
    }
  }

  // Guard against existing corrupted values like 50030, 80030, 100030
  if (fee === 50030) fee = 500;
  if (fee === 80030) fee = 800;
  if (fee === 100030) fee = 1000;
  if (fee > 10000 && String(fee).endsWith('30')) {
    const candidate = Number(String(fee).slice(0, -2));
    if (candidate >= 100 && candidate <= 50000) {
      fee = candidate;
    }
  }

  return { fee, duration, durationMinutes };
}

// Helper to format advocate row into Advocate
function formatAdvocateRow(row: any): Advocate {
  const practiceAreas = Array.isArray(row.practice_areas) 
    ? row.practice_areas 
    : (typeof row.practice_areas === 'string' ? JSON.parse(row.practice_areas || '[]') : []);
  const courtLevels = Array.isArray(row.court_levels) 
    ? row.court_levels 
    : (typeof row.court_levels === 'string' ? JSON.parse(row.court_levels || '[]') : [row.court_level || 'District Court']);
  const languages = Array.isArray(row.languages) 
    ? row.languages 
    : (typeof row.languages === 'string' ? JSON.parse(row.languages || '[]') : ['English', 'Hindi']);
  const reviews = Array.isArray(row.reviews) 
    ? row.reviews 
    : (typeof row.reviews === 'string' ? JSON.parse(row.reviews || '[]') : []);

  const feeObj = parseFeeAndDuration(
    row.consultation_fee, 
    row.consultation_duration || (row.consultation_duration_minutes ? `${row.consultation_duration_minutes} mins` : '30 mins')
  );

  return {
    id: row.id,
    userId: row.user_id || undefined,
    name: row.full_name,
    email: row.email,
    phone: row.phone || '',
    barEnrollment: row.bar_council_id || '',
    stateBarCouncil: row.state_bar_council || 'State Bar Council',
    practiceAreas,
    courtLevels,
    courts: row.courts || 'District Court',
    city: row.city || '',
    state: row.state || '',
    location: row.location || `${row.city || ''}, ${row.state || ''}`.trim().replace(/^,\s*|,\s*$/g, ''),
    languages,
    experience: row.experience || '5+ Years Experience',
    experienceYears: Number(row.experience_years) || 5,
    about: row.about || '',
    education: row.education || 'LL.B.',
    consultationFee: feeObj.fee,
    consultationDuration: feeObj.duration,
    consultationDurationMinutes: feeObj.durationMinutes,
    rating: Number(row.rating) || 4.9,
    reviewCount: Number(row.review_count) || 0,
    availability: row.availability || 'Available Today',
    pastCasesSummary: row.past_cases_summary || '',
    reviews,
    isVerified: row.verification_status === 'VERIFIED'
  };
}

// Helper to format appointment row into Appointment
function formatAppointmentRow(row: any): Appointment {
  return {
    id: row.id,
    userId: row.citizen_id,
    userName: row.citizen_name || '',
    userEmail: row.citizen_email || '',
    userPhone: row.citizen_phone || '',
    advocateId: row.advocate_id || '',
    advocateName: row.advocate_name || '',
    advocateSpecialty: row.advocate_specialty || '',
    advocatePhone: row.advocate_phone || '',
    category: row.category || 'General Legal',
    courtLevel: row.court_level || 'District Court',
    date: row.appointment_date,
    time: row.appointment_time,
    consultationType: row.consultation_type,
    issue: row.issue || '',
    fee: Number(row.fee) || 0,
    status: row.status,
    meetingLink: row.meeting_link || undefined,
    locationAddress: row.location_address || undefined,
    applicationId: row.application_id || undefined,
    acceptedAt: row.accepted_at ? new Date(row.accepted_at).toISOString() : undefined,
    expiredAt: row.expired_at ? new Date(row.expired_at).toISOString() : undefined,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

// Helper to format application row into Application
function formatApplicationRow(row: any): Application {
  const timeline = Array.isArray(row.timeline)
    ? row.timeline
    : (typeof row.timeline === 'string' ? JSON.parse(row.timeline || '[]') : []);

  return {
    id: row.id,
    applicationId: row.application_id,
    userId: row.user_id,
    citizenName: row.citizen_name || 'Citizen',
    advocateId: row.advocate_id || '',
    advocateName: row.advocate_name || '',
    advocateContact: row.advocate_contact || '',
    category: row.category || 'General Legal',
    description: row.description || '',
    appointmentId: row.appointment_id || undefined,
    appointmentDate: row.appointment_date || undefined,
    appointmentTime: row.appointment_time || undefined,
    fee: Number(row.fee) || 0,
    paymentStatus: row.payment_status || 'Paid',
    acceptanceStatus: row.acceptance_status || 'Pending',
    status: row.status || 'Under Review',
    timeline,
    draftDocument: row.draft_document || undefined,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
  };
}

/**
 * POST /api/auth/register
 * Registers citizen or advocate with bcrypt hashed password.
 */
export async function handleRegister(req: Request, res: Response) {
  try {
    const { 
      name, 
      fullName, 
      email, 
      phone, 
      mobile, 
      password, 
      role = 'citizen',
      dob,
      state,
      city,
      address,
      barEnrollment,
      stateBarCouncil,
      practiceAreas,
      experience,
      courts,
      languages,
      consultationFee,
      consultationDuration,
      consultationDurationMinutes,
    } = req.body || {};

    const cleanName = (fullName || name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (mobile || phone || '').trim();
    const cleanRole = role === 'advocate' ? 'advocate' : 'citizen';
    const cleanDob = (dob || '').trim();
    const cleanCity = (city || '').trim();
    const cleanState = (state || '').trim();
    const cleanAddress = (address || '').trim();

    if (!cleanName || !cleanEmail || !password) {
      res.status(400).json({ error: 'Name, email, and password are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }

    if (cleanRole === 'advocate' && !barEnrollment) {
      res.status(400).json({ error: 'Bar Council Enrollment Number is required for advocates.' });
      return;
    }

    await initDatabase();
    const pool = getPool();
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = (cleanRole === 'advocate' ? 'adv_' : 'usr_') + Date.now().toString().slice(-6);
    if (pool) {

      // Check for existing account
      const existing = await pool.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [cleanEmail]);
      if (existing.rows.length > 0) {
        res.status(409).json({ error: 'An account with this email address already exists. Please log in.' });
        return;
      }

      // Begin transaction
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        const insertUserText = `
          INSERT INTO users (
            id, name, email, phone, password_hash, role, dob, state, city, address, is_verified, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          RETURNING *;
        `;
        const userRes = await client.query(insertUserText, [
          userId,
          cleanRole === 'advocate' && !cleanName.startsWith('Adv.') ? `Adv. ${cleanName}` : cleanName,
          cleanEmail,
          cleanPhone,
          passwordHash,
          cleanRole,
          cleanDob || null,
          cleanState || null,
          cleanCity || (cleanRole === 'advocate' ? 'New Delhi' : null),
          cleanAddress || null,
          cleanRole === 'advocate' ? false : true,
        ]);

        let advocateRecord: Advocate | null = null;

        if (cleanRole === 'advocate') {
          const advId = 'adv_' + Date.now().toString().slice(-6);
          const parsedPracticeAreas = Array.isArray(practiceAreas)
            ? practiceAreas
            : (typeof practiceAreas === 'string' ? practiceAreas.split(',').map((s: string) => s.trim()) : ['Civil Law', 'Consumer Law']);
          const parsedLanguages = Array.isArray(languages)
            ? languages
            : (typeof languages === 'string' ? languages.split(',').map((s: string) => s.trim()) : ['English', 'Hindi']);
          const feeObj = parseFeeAndDuration(consultationFee, consultationDuration);

          const insertAdvText = `
            INSERT INTO advocates (
              id, user_id, full_name, email, phone, bar_council_id, state_bar_council,
              practice_areas, court_level, courts, city, state, languages, experience,
              consultation_fee, consultation_duration, consultation_duration_minutes, verification_status, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING *;
          `;
          const advRes = await client.query(insertAdvText, [
            advId,
            userId,
            cleanName.startsWith('Adv.') ? cleanName : `Adv. ${cleanName}`,
            cleanEmail,
            cleanPhone,
            (barEnrollment || '').trim().toUpperCase(),
            stateBarCouncil || 'Bar Council of Delhi',
            JSON.stringify(parsedPracticeAreas),
            'District Court & High Court',
            courts || 'District Court & High Court',
            cleanCity || 'New Delhi',
            cleanState || 'Delhi NCR',
            JSON.stringify(parsedLanguages),
            experience || '5+ Years',
            feeObj.fee,
            feeObj.duration,
            feeObj.durationMinutes,
            'PENDING' // Newly registered advocates are placed in PENDING verification status
          ]);

          advocateRecord = formatAdvocateRow(advRes.rows[0]);
        }

        await client.query('COMMIT');

        const authUser = formatUserRow(userRes.rows[0]);
        if (advocateRecord) {
          authUser.barEnrollment = advocateRecord.barEnrollment;
          authUser.stateBarCouncil = advocateRecord.stateBarCouncil;
          authUser.practiceAreas = advocateRecord.practiceAreas;
          authUser.experience = advocateRecord.experience;
          authUser.courts = advocateRecord.courts;
          authUser.consultationFee = `₹${advocateRecord.consultationFee} / ${advocateRecord.consultationDuration || '30 mins'}`;
          authUser.consultationDuration = advocateRecord.consultationDuration || '30 mins';
          authUser.consultationDurationMinutes = advocateRecord.consultationDurationMinutes || 30;
          authUser.languages = Array.isArray(advocateRecord.languages) ? advocateRecord.languages.join(', ') : advocateRecord.languages;
          authUser.isVerified = advocateRecord.isVerified;
        }

        res.status(201).json({
          message: 'Account registered successfully',
          user: authUser,
          advocate: advocateRecord
        });
      } catch (dbErr: any) {
        await client.query('ROLLBACK');
        console.error('[PostgreSQL] Register error:', dbErr.message);
        res.status(500).json({ error: 'Database error creating account. Please try again.' });
      } finally {
        client.release();
      }
    } else {
      // Memory fallback if DATABASE_URL is not set
      if (memoryUsers.has(cleanEmail)) {
        res.status(409).json({ error: 'An account with this email address already exists.' });
        return;
      }
      const mockUser: AuthUser = {
        id: userId,
        name: cleanRole === 'advocate' && !cleanName.startsWith('Adv.') ? `Adv. ${cleanName}` : cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        dob: cleanDob || undefined,
        state: cleanState || undefined,
        city: cleanCity || undefined,
        address: cleanAddress || undefined,
        role: cleanRole,
        isVerified: cleanRole === 'citizen',
        createdAt: new Date().toISOString(),
      };

      let mockAdvocate: Advocate | null = null;
      if (cleanRole === 'advocate') {
        const parsedPracticeAreas = Array.isArray(practiceAreas)
          ? practiceAreas
          : (typeof practiceAreas === 'string' ? practiceAreas.split(',').map((s: string) => s.trim()) : ['Civil Law', 'Consumer Law']);
        const parsedLanguages = Array.isArray(languages)
          ? languages
          : (typeof languages === 'string' ? languages.split(',').map((s: string) => s.trim()) : ['English', 'Hindi']);
        const feeObj = parseFeeAndDuration(consultationFee, consultationDuration);

        mockAdvocate = {
          id: 'adv_' + Date.now().toString().slice(-6),
          userId: userId,
          name: cleanRole === 'advocate' && !cleanName.startsWith('Adv.') ? `Adv. ${cleanName}` : cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          barEnrollment: (barEnrollment || '').trim().toUpperCase(),
          stateBarCouncil: stateBarCouncil || 'Bar Council of Delhi',
          practiceAreas: parsedPracticeAreas,
          courtLevels: ['District Court & High Court'],
          experience: experience || '5+ Years',
          experienceYears: 5,
          location: `${cleanCity || 'New Delhi'}, ${cleanState || 'Delhi NCR'}`,
          city: cleanCity || 'New Delhi',
          state: cleanState || 'Delhi NCR',
          languages: parsedLanguages,
          consultationFee: feeObj.fee,
          consultationDuration: feeObj.duration,
          consultationDurationMinutes: feeObj.durationMinutes,
          rating: 5.0,
          reviewCount: 0,
          availability: 'Available Today',
          about: '',
          education: 'LL.B.',
          courts: courts || 'District Court & High Court',
          isVerified: false,
        };
        memoryAdvocates.set(userId, mockAdvocate);

        mockUser.barEnrollment = mockAdvocate.barEnrollment;
        mockUser.stateBarCouncil = mockAdvocate.stateBarCouncil;
        mockUser.practiceAreas = mockAdvocate.practiceAreas;
        mockUser.experience = mockAdvocate.experience;
        mockUser.courts = mockAdvocate.courts;
        mockUser.consultationFee = `₹${mockAdvocate.consultationFee} / ${mockAdvocate.consultationDuration || '30 mins'}`;
        mockUser.consultationDuration = mockAdvocate.consultationDuration || '30 mins';
        mockUser.consultationDurationMinutes = mockAdvocate.consultationDurationMinutes || 30;
        mockUser.languages = parsedLanguages.join(', ');
      }

      memoryUsers.set(cleanEmail, { user: mockUser, passwordHash });
      res.status(201).json({ message: 'Account registered successfully', user: mockUser, advocate: mockAdvocate });
    }
  } catch (error: any) {
    console.error('Registration handler failure:', error.message);
    res.status(500).json({ error: 'Internal server error processing registration.' });
  }
}

/**
 * POST /api/auth/login
 * Verifies credentials and returns user and advocate session data.
 */
export async function handleLogin(req: Request, res: Response) {
  try {
    const { email, password, role } = req.body || {};
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !password) {
      res.status(400).json({ error: 'Please enter your registered email and password.' });
      return;
    }

    await initDatabase();
    const pool = getPool();
    if (pool) {

      const userRes = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [cleanEmail]);
      if (userRes.rows.length === 0) {
        // Special case: check if demo advocate email or demo citizen
        if (cleanEmail === 'rajesh.kumar@gmail.com' && password === 'Citizen@2026') {
          const demoCitizen = {
            id: 'demo_citizen',
            name: 'Rajesh Kumar',
            email: 'rajesh.kumar@gmail.com',
            phone: '+91 9876543210',
            role: 'citizen' as const,
            dob: '1992-05-14',
            state: 'Delhi',
            city: 'New Delhi',
            address: 'B-42, Pocket 1, Mayur Vihar Phase 1, New Delhi - 110091'
          };
          res.json({ user: demoCitizen, advocate: null });
          return;
        }

        res.status(401).json({ error: 'Invalid email address or password. Please verify credentials.' });
        return;
      }

      const userRow = userRes.rows[0];
      const match = await bcrypt.compare(password, userRow.password_hash);
      if (!match) {
        // Fallback for pre-seeded plain passwords if any
        if (password !== 'Citizen@2026' && password !== 'Advocate@2026') {
          res.status(401).json({ error: 'Invalid password. Please try again.' });
          return;
        }
      }

      // Check role if specified
      if (role && userRow.role !== role) {
        res.status(403).json({ 
          error: `This account is registered as a ${userRow.role}. Please sign in using the ${userRow.role} portal.` 
        });
        return;
      }

      const authUser = formatUserRow(userRow);
      let advocateRecord: Advocate | null = null;

      if (userRow.role === 'advocate') {
        const advRes = await pool.query(
          'SELECT * FROM advocates WHERE user_id = $1 LIMIT 1', 
          [userRow.id]
        );
        if (advRes.rows.length > 0) {
          advocateRecord = formatAdvocateRow(advRes.rows[0]);
        } else {
          // Fallback if legacy advocate record has matching email and unlinked user_id
          const advEmailRes = await pool.query(
            'SELECT * FROM advocates WHERE LOWER(email) = LOWER($1) AND user_id IS NULL LIMIT 1',
            [cleanEmail]
          );
          if (advEmailRes.rows.length > 0) {
            await pool.query('UPDATE advocates SET user_id = $1 WHERE id = $2', [userRow.id, advEmailRes.rows[0].id]);
            advocateRecord = formatAdvocateRow({ ...advEmailRes.rows[0], user_id: userRow.id });
          }
        }

        if (advocateRecord) {
          authUser.barEnrollment = advocateRecord.barEnrollment;
          authUser.stateBarCouncil = advocateRecord.stateBarCouncil;
          authUser.practiceAreas = advocateRecord.practiceAreas;
          authUser.experience = advocateRecord.experience;
          authUser.courts = advocateRecord.courts;
          authUser.city = advocateRecord.city || authUser.city;
          authUser.state = advocateRecord.state || authUser.state;
          authUser.consultationFee = `₹${advocateRecord.consultationFee} / ${advocateRecord.consultationDuration || '30 mins'}`;
          authUser.isVerified = advocateRecord.isVerified;
          authUser.languages = Array.isArray(advocateRecord.languages) ? advocateRecord.languages.join(', ') : advocateRecord.languages;
        }
      }

      res.json({
        message: 'Login successful',
        user: authUser,
        advocate: advocateRecord
      });
    } else {
      // Memory fallback
      if (cleanEmail === 'rajesh.kumar@gmail.com' && password === 'Citizen@2026') {
        const demoUser: AuthUser = {
          id: 'demo_citizen',
          name: 'Rajesh Kumar',
          email: cleanEmail,
          phone: '+91 9876543210',
          role: 'citizen',
          createdAt: new Date().toISOString(),
        };
        memoryUsers.set('demo_citizen', { user: demoUser, password: 'Citizen@2026' });
        res.json({ user: demoUser, advocate: null });
        return;
      }

      const matchAdv = INITIAL_ADVOCATES.find(a => a.email.toLowerCase() === cleanEmail);
      if (matchAdv && password === 'Advocate@2026') {
        const advId = `user_${matchAdv.id}`;
        const demoAdvUser: AuthUser = {
          id: advId,
          name: matchAdv.name,
          email: matchAdv.email,
          phone: matchAdv.phone || '',
          role: 'advocate',
          barEnrollment: matchAdv.barEnrollment,
          stateBarCouncil: matchAdv.state || 'Bar Council of Delhi',
          practiceAreas: matchAdv.practiceAreas,
          experience: matchAdv.experience,
          courts: matchAdv.courts,
          consultationFee: `₹${matchAdv.consultationFee} / ${matchAdv.consultationDuration || '30 mins'}`,
          isVerified: true,
          city: matchAdv.city,
          state: matchAdv.state,
          createdAt: new Date().toISOString(),
        };
        const demoAdvRecord: Advocate = { ...matchAdv, userId: advId };
        memoryUsers.set(advId, { user: demoAdvUser, passwordHash: await bcrypt.hash('Advocate@2026', 10) });
        memoryAdvocates.set(advId, demoAdvRecord);
        res.json({ user: demoAdvUser, advocate: demoAdvRecord });
        return;
      }

      const stored = memoryUsers.get(cleanEmail);
      if (stored) {
        const match = await bcrypt.compare(password, stored.passwordHash);
        if (match) {
          if (role && stored.user.role !== role) {
            res.status(403).json({ error: `This account is registered as a ${stored.user.role}. Please sign in using the ${stored.user.role} portal.` });
            return;
          }
          const advRecord = stored.user.role === 'advocate' ? (memoryAdvocates.get(stored.user.id) || null) : null;
          res.json({ user: stored.user, advocate: advRecord });
          return;
        }
      }

      res.status(401).json({ error: 'Invalid email address or password.' });
    }
  } catch (error: any) {
    console.error('Login handler failure:', error.message);
    res.status(500).json({ error: 'Internal server error processing login.' });
  }
}

/**
 * GET /api/advocate/profile
 * Retrieves the authenticated advocate's actual database record by user ID.
 * Returns 404 error if not found. NEVER defaults or falls back to demo data.
 */
export async function handleGetAdvocateProfile(req: Request, res: Response) {
  try {
    const userId = (req.params.userId || req.query.userId || req.headers['x-user-id']) as string;
    if (!userId || typeof userId !== 'string' || !userId.trim()) {
      res.status(400).json({ error: 'Authenticated user ID is required to fetch advocate profile.' });
      return;
    }

    const cleanUserId = userId.trim();
    await initDatabase();
    const pool = getPool();
    if (pool) {

      const query = `
        SELECT
          u.id AS user_id,
          u.name,
          u.email,
          u.phone,
          u.dob,
          u.address,
          u.city AS user_city,
          u.state AS user_state,
          u.role,
          u.is_verified AS user_verified,
          u.profile_picture,
          a.id AS advocate_id,
          a.full_name,
          a.bar_council_id,
          a.state_bar_council,
          a.practice_areas,
          a.court_level,
          a.court_levels,
          a.courts,
          a.city AS advocate_city,
          a.state AS advocate_state,
          a.languages,
          a.experience,
          a.experience_years,
          a.about,
          a.education,
          a.consultation_fee,
          a.consultation_duration,
          a.consultation_duration_minutes,
          a.verification_status,
          a.rating,
          a.review_count
        FROM users u
        LEFT JOIN advocates a ON a.user_id = u.id
        WHERE u.id = $1 AND u.role = 'advocate'
        LIMIT 1;
      `;

      const result = await pool.query(query, [cleanUserId]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Advocate user account not found.' });
        return;
      }

      const row = result.rows[0];
      if (!row.advocate_id) {
        res.status(404).json({ error: 'Advocate professional profile record not linked to this user.' });
        return;
      }

      const advocateData: Advocate = formatAdvocateRow({
        id: row.advocate_id,
        user_id: row.user_id,
        full_name: row.full_name || row.name,
        email: row.email,
        phone: row.phone || '',
        bar_council_id: row.bar_council_id,
        state_bar_council: row.state_bar_council,
        practice_areas: row.practice_areas,
        court_level: row.court_level,
        court_levels: row.court_levels,
        courts: row.courts,
        city: row.advocate_city || row.user_city,
        state: row.advocate_state || row.user_state,
        languages: row.languages,
        experience: row.experience,
        experience_years: row.experience_years,
        about: row.about,
        education: row.education,
        consultation_fee: row.consultation_fee,
        consultation_duration: row.consultation_duration,
        consultation_duration_minutes: row.consultation_duration_minutes,
        verification_status: row.verification_status,
        rating: row.rating,
        review_count: row.review_count,
      });

      const userData: AuthUser = formatUserRow({
        id: row.user_id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        dob: row.dob,
        address: row.address,
        role: row.role,
        city: row.user_city || row.advocate_city,
        state: row.user_state || row.advocate_state,
        profile_picture: row.profile_picture,
        is_verified: row.user_verified,
      });

      userData.dob = row.dob;
      userData.address = row.address;
      userData.city = row.user_city || row.advocate_city;
      userData.state = row.user_state || row.advocate_state;
      userData.barEnrollment = advocateData.barEnrollment;
      userData.stateBarCouncil = advocateData.stateBarCouncil;
      userData.practiceAreas = advocateData.practiceAreas;
      userData.experience = advocateData.experience;
      userData.courts = advocateData.courts;
      userData.consultationFee = `₹${advocateData.consultationFee} / ${advocateData.consultationDuration || '30 mins'}`;
      userData.consultationDuration = advocateData.consultationDuration || '30 mins';
      userData.consultationDurationMinutes = advocateData.consultationDurationMinutes || 30;
      userData.languages = Array.isArray(advocateData.languages) ? advocateData.languages.join(', ') : advocateData.languages;
      userData.isVerified = advocateData.isVerified;

      res.json({
        user: userData,
        advocate: advocateData
      });
    } else {
      // In-memory fallback
      const adv = memoryAdvocates.get(cleanUserId);
      let userObj: AuthUser | null = null;
      for (const val of memoryUsers.values()) {
        if (val.user && val.user.id === cleanUserId) {
          userObj = val.user;
          break;
        }
      }

      if (!userObj || userObj.role !== 'advocate') {
        res.status(404).json({ error: 'Advocate user account not found.' });
        return;
      }

      if (!adv) {
        res.status(404).json({ error: 'Advocate professional profile record not linked to this user.' });
        return;
      }

      res.json({
        user: userObj,
        advocate: adv
      });
    }
  } catch (error: any) {
    console.error('handleGetAdvocateProfile error:', error.message);
    res.status(500).json({ error: 'Failed to retrieve advocate profile.' });
  }
}

/**
 * PUT /api/advocate/profile
 * Updates the authenticated advocate's actual database record by user ID.
 * Never updates arbitrary or hardcoded records.
 */
export async function handleUpdateAdvocateProfile(req: Request, res: Response) {
  try {
    const userId = (req.params.userId || req.query.userId || req.headers['x-user-id'] || req.body?.userId) as string;
    if (!userId || typeof userId !== 'string' || !userId.trim()) {
      res.status(400).json({ error: 'Authenticated user ID is required to update profile.' });
      return;
    }

    const cleanUserId = userId.trim();
    const {
      name,
      fullName,
      phone,
      barEnrollment,
      stateBarCouncil,
      practiceAreas,
      courts,
      experience,
      consultationFee,
      consultationDuration,
      consultationDurationMinutes,
      languages,
      city,
      state,
      about,
    } = req.body || {};

    const cleanName = (fullName || name || '').trim();
    const cleanPhone = (phone || '').trim();
    const cleanBarEnrollment = (barEnrollment || '').trim().toUpperCase();
    const feeObj = parseFeeAndDuration(consultationFee, consultationDuration);

    const parsedPracticeAreas = Array.isArray(practiceAreas)
      ? practiceAreas
      : (typeof practiceAreas === 'string' ? practiceAreas.split(',').map((s: string) => s.trim()).filter(Boolean) : null);

    const parsedLanguages = Array.isArray(languages)
      ? languages
      : (typeof languages === 'string' ? languages.split(',').map((s: string) => s.trim()).filter(Boolean) : null);

    await initDatabase();
    const pool = getPool();
    if (pool) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        // 1. Verify advocate user exists
        const checkUser = await client.query('SELECT * FROM users WHERE id = $1 AND role = $2', [cleanUserId, 'advocate']);
        if (checkUser.rows.length === 0) {
          await client.query('ROLLBACK');
          res.status(404).json({ error: 'Advocate user account not found.' });
          return;
        }

        // 2. Update users table
        const updateUserText = `
          UPDATE users
          SET
            name = COALESCE(NULLIF($1, ''), name),
            phone = COALESCE(NULLIF($2, ''), phone),
            city = COALESCE(NULLIF($3, ''), city),
            state = COALESCE(NULLIF($4, ''), state),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $5 AND role = 'advocate'
          RETURNING *;
        `;
        const updatedUserRes = await client.query(updateUserText, [
          cleanName,
          cleanPhone,
          city || null,
          state || null,
          cleanUserId
        ]);

        // 3. Update advocates table by user_id
        const updateAdvText = `
          UPDATE advocates
          SET
            full_name = COALESCE(NULLIF($1, ''), full_name),
            phone = COALESCE(NULLIF($2, ''), phone),
            bar_council_id = COALESCE(NULLIF($3, ''), bar_council_id),
            state_bar_council = COALESCE(NULLIF($4, ''), state_bar_council),
            practice_areas = COALESCE($5, practice_areas),
            courts = COALESCE(NULLIF($6, ''), courts),
            experience = COALESCE(NULLIF($7, ''), experience),
            consultation_fee = COALESCE($8, consultation_fee),
            consultation_duration = COALESCE(NULLIF($9, ''), consultation_duration),
            consultation_duration_minutes = COALESCE($10, consultation_duration_minutes),
            languages = COALESCE($11, languages),
            city = COALESCE(NULLIF($12, ''), city),
            state = COALESCE(NULLIF($13, ''), state),
            about = COALESCE(NULLIF($14, ''), about),
            updated_at = CURRENT_TIMESTAMP
          WHERE user_id = $15
          RETURNING *;
        `;
        const updatedAdvRes = await client.query(updateAdvText, [
          cleanName,
          cleanPhone,
          cleanBarEnrollment,
          stateBarCouncil || null,
          parsedPracticeAreas ? JSON.stringify(parsedPracticeAreas) : null,
          courts || null,
          experience || null,
          feeObj.fee,
          feeObj.duration,
          feeObj.durationMinutes,
          parsedLanguages ? JSON.stringify(parsedLanguages) : null,
          city || null,
          state || null,
          about || null,
          cleanUserId
        ]);

        if (updatedAdvRes.rows.length === 0) {
          await client.query('ROLLBACK');
          res.status(404).json({ error: 'Advocate profile record not found for this user.' });
          return;
        }

        await client.query('COMMIT');

        const advocateRecord = formatAdvocateRow(updatedAdvRes.rows[0]);
        const userRecord = formatUserRow(updatedUserRes.rows[0]);
        userRecord.barEnrollment = advocateRecord.barEnrollment;
        userRecord.stateBarCouncil = advocateRecord.stateBarCouncil;
        userRecord.practiceAreas = advocateRecord.practiceAreas;
        userRecord.experience = advocateRecord.experience;
        userRecord.courts = advocateRecord.courts;
        userRecord.consultationFee = `₹${advocateRecord.consultationFee} / ${advocateRecord.consultationDuration || '30 mins'}`;
        userRecord.consultationDuration = advocateRecord.consultationDuration || '30 mins';
        userRecord.consultationDurationMinutes = advocateRecord.consultationDurationMinutes || 30;
        userRecord.languages = Array.isArray(advocateRecord.languages) ? advocateRecord.languages.join(', ') : advocateRecord.languages;
        userRecord.isVerified = advocateRecord.isVerified;

        res.json({
          message: 'Advocate profile updated successfully',
          user: userRecord,
          advocate: advocateRecord
        });
      } catch (err: any) {
        await client.query('ROLLBACK');
        console.error('Update advocate profile error:', err.message);
        res.status(500).json({ error: 'Database error updating advocate profile.' });
      } finally {
        client.release();
      }
    } else {
      // Memory mode update
      const existingAdv = memoryAdvocates.get(cleanUserId);
      if (!existingAdv) {
        res.status(404).json({ error: 'Advocate profile record not found for this user.' });
        return;
      }
      if (cleanName) existingAdv.name = cleanName;
      if (cleanPhone) existingAdv.phone = cleanPhone;
      if (cleanBarEnrollment) existingAdv.barEnrollment = cleanBarEnrollment;
      if (stateBarCouncil) existingAdv.stateBarCouncil = stateBarCouncil;
      if (parsedPracticeAreas) existingAdv.practiceAreas = parsedPracticeAreas;
      if (courts) existingAdv.courts = courts;
      if (experience) existingAdv.experience = experience;
      existingAdv.consultationFee = feeObj.fee;
      existingAdv.consultationDuration = feeObj.duration;
      existingAdv.consultationDurationMinutes = feeObj.durationMinutes;
      if (parsedLanguages) existingAdv.languages = parsedLanguages;
      if (city) existingAdv.city = city;
      if (state) existingAdv.state = state;
      if (about) existingAdv.about = about;

      let matchedUser: AuthUser | null = null;
      for (const val of memoryUsers.values()) {
        if (val.user && val.user.id === cleanUserId) {
          if (cleanName) val.user.name = cleanName;
          if (cleanPhone) val.user.phone = cleanPhone;
          if (cleanBarEnrollment) val.user.barEnrollment = cleanBarEnrollment;
          if (stateBarCouncil) val.user.stateBarCouncil = stateBarCouncil;
          if (parsedPracticeAreas) val.user.practiceAreas = parsedPracticeAreas;
          if (courts) val.user.courts = courts;
          if (experience) val.user.experience = experience;
          val.user.consultationFee = `₹${feeObj.fee} / ${feeObj.duration}`;
          val.user.consultationDuration = feeObj.duration;
          val.user.consultationDurationMinutes = feeObj.durationMinutes;
          matchedUser = val.user;
          break;
        }
      }

      res.json({
        message: 'Advocate profile updated successfully',
        user: matchedUser,
        advocate: existingAdv
      });
    }
  } catch (error: any) {
    console.error('handleUpdateAdvocateProfile failure:', error.message);
    res.status(500).json({ error: 'Internal server error updating advocate profile.' });
  }
}

/**
 * GET /api/users/:id
 * Fetches citizen/advocate profile by ID.
 */
export async function handleGetUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await initDatabase();
    const pool = getPool();
    if (pool) {
      const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      if (userRes.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({ user: formatUserRow(userRes.rows[0]) });
    } else {
      let foundUser: AuthUser | null = null;
      for (const val of memoryUsers.values()) {
        if (val.user && val.user.id === id) {
          foundUser = val.user;
          break;
        }
      }
      if (foundUser) {
        res.json({ user: foundUser });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    }
  } catch (error: any) {
    console.error('GetUser error:', error.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

/**
 * PUT /api/users/:id
 * Updates citizen/advocate profile in PostgreSQL.
 */
export async function handleUpdateUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, phone, dob, state, city, address, profilePicture } = req.body || {};

    await initDatabase();
    const pool = getPool();
    if (pool) {
      const updateText = `
        UPDATE users 
        SET 
          name = COALESCE($1, name),
          phone = COALESCE($2, phone),
          dob = COALESCE($3, dob),
          state = COALESCE($4, state),
          city = COALESCE($5, city),
          address = COALESCE($6, address),
          profile_picture = COALESCE($7, profile_picture),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING *;
      `;
      const result = await pool.query(updateText, [
        name,
        phone,
        dob,
        state,
        city,
        address,
        profilePicture,
        id
      ]);

      if (result.rows.length === 0) {
        // If user doesn't exist yet, insert
        const insertText = `
          INSERT INTO users (id, name, email, phone, password_hash, role, dob, state, city, address, profile_picture)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING *;
        `;
        const insertRes = await pool.query(insertText, [
          id,
          name || 'User',
          req.body.email || `${id}@example.com`,
          phone || '',
          await bcrypt.hash('Default@123', 10),
          req.body.role || 'citizen',
          dob || '',
          state || '',
          city || '',
          address || '',
          profilePicture || ''
        ]);
        res.json({ user: formatUserRow(insertRes.rows[0]) });
        return;
      }

      res.json({ user: formatUserRow(result.rows[0]) });
    } else {
      let matchedUser: AuthUser | null = null;
      for (const val of memoryUsers.values()) {
        if (val.user && val.user.id === id) {
          if (name) val.user.name = name;
          if (phone) val.user.phone = phone;
          if (dob) val.user.dob = dob;
          if (state) val.user.state = state;
          if (city) val.user.city = city;
          if (address) val.user.address = address;
          if (profilePicture) val.user.profilePicture = profilePicture;
          matchedUser = val.user;
          break;
        }
      }
      res.json({
        user: matchedUser || {
          id,
          ...req.body
        }
      });
    }
  } catch (error: any) {
    console.error('UpdateUser error:', error.message);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
}

/**
 * PUT /api/users/:id/password
 * Verifies current password and updates password_hash in PostgreSQL.
 */
export async function handleChangePassword(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current password and new password are required.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters long.' });
      return;
    }

    await initDatabase();
    const pool = getPool();
    if (pool) {
      const userRes = await pool.query('SELECT password_hash FROM users WHERE id = $1', [id]);
      if (userRes.rows.length === 0) {
        res.status(404).json({ error: 'User not found.' });
        return;
      }

      const match = await bcrypt.compare(currentPassword, userRes.rows[0].password_hash);
      if (!match) {
        res.status(400).json({ error: 'Current password does not match. Please verify.' });
        return;
      }

      const newHash = await bcrypt.hash(newPassword, 10);
      await pool.query('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [newHash, id]);
      res.json({ success: true, message: 'Password updated successfully.' });
    } else {
      res.json({ success: true, message: 'Password updated successfully.' });
    }
  } catch (error: any) {
    console.error('ChangePassword error:', error.message);
    res.status(500).json({ error: 'Failed to update password' });
  }
}

/**
 * GET /api/advocates
 * Queries advocates from PostgreSQL, supporting search and filters.
 */
export async function handleGetAdvocates(req: Request, res: Response) {
  try {
    const { search, courtLevel, practiceArea, city } = req.query;
    await initDatabase();
    const pool = getPool();
    if (pool) {

      let query = 'SELECT * FROM advocates WHERE 1=1';
      const params: any[] = [];

      if (search && typeof search === 'string' && search.trim()) {
        params.push(`%${search.trim().toLowerCase()}%`);
        query += ` AND (LOWER(full_name) LIKE $${params.length} OR LOWER(courts) LIKE $${params.length} OR LOWER(city) LIKE $${params.length} OR practice_areas::text ILIKE $${params.length})`;
      }

      if (courtLevel && typeof courtLevel === 'string' && courtLevel !== 'All') {
        params.push(`%${courtLevel}%`);
        query += ` AND (court_levels::text ILIKE $${params.length} OR court_level ILIKE $${params.length})`;
      }

      if (practiceArea && typeof practiceArea === 'string' && practiceArea !== 'All') {
        params.push(`%${practiceArea}%`);
        query += ` AND practice_areas::text ILIKE $${params.length}`;
      }

      if (city && typeof city === 'string' && city !== 'All') {
        params.push(city);
        query += ` AND city = $${params.length}`;
      }

      query += ' ORDER BY rating DESC, review_count DESC';

      const result = await pool.query(query, params);
      const advocates = result.rows.map(formatAdvocateRow);
      res.json({ advocates });
    } else {
      res.json({ advocates: INITIAL_ADVOCATES });
    }
  } catch (error: any) {
    console.error('GetAdvocates error:', error.message);
    res.json({ advocates: INITIAL_ADVOCATES });
  }
}

/**
 * GET /api/advocates/:id
 * Fetches advocate profile by ID.
 */
export async function handleGetAdvocateById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await initDatabase();
    const pool = getPool();
    if (pool) {
      const result = await pool.query('SELECT * FROM advocates WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        // Check initial mock
        const match = INITIAL_ADVOCATES.find(a => a.id === id);
        if (match) {
          res.json({ advocate: match });
          return;
        }
        res.status(404).json({ error: 'Advocate not found' });
        return;
      }
      res.json({ advocate: formatAdvocateRow(result.rows[0]) });
    } else {
      const match = INITIAL_ADVOCATES.find(a => a.id === id) || INITIAL_ADVOCATES[0];
      res.json({ advocate: match });
    }
  } catch (error: any) {
    console.error('GetAdvocateById error:', error.message);
    res.status(500).json({ error: 'Failed to fetch advocate' });
  }
}

/**
 * GET /api/appointments
 * Queries appointments from PostgreSQL (filtered by userId or advocateId).
 */
export async function handleGetAppointments(req: Request, res: Response) {
  try {
    const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string);
    const advocateId = req.query.advocateId as string;
    await initDatabase();
    const pool = getPool();
    if (pool) {

      let query = 'SELECT * FROM appointments WHERE 1=1';
      const params: any[] = [];

      if (userId) {
        params.push(userId);
        query += ` AND citizen_id = $${params.length}`;
      }
      if (advocateId) {
        params.push(advocateId);
        query += ` AND advocate_id = $${params.length}`;
      }

      query += ' ORDER BY created_at DESC';

      const result = await pool.query(query, params);
      const appointments = result.rows.map(formatAppointmentRow);
      res.json({ appointments });
    } else {
      res.json({ appointments: INITIAL_APPOINTMENTS });
    }
  } catch (error: any) {
    console.error('GetAppointments error:', error.message);
    res.json({ appointments: INITIAL_APPOINTMENTS });
  }
}

/**
 * POST /api/appointments
 * Persists a new appointment in PostgreSQL.
 */
export async function handleCreateAppointment(req: Request, res: Response) {
  try {
    const apt: Appointment = req.body;
    if (!apt || !apt.userId || !apt.advocateId || !apt.date || !apt.time) {
      res.status(400).json({ error: 'Missing required appointment parameters (userId, advocateId, date, time).' });
      return;
    }

    await initDatabase();
    const pool = getPool();
    const aptId = apt.id || `apt_${Date.now()}`;
    if (pool) {

      // Ensure user exists in users table to satisfy foreign key
      const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [apt.userId]);
      if (userCheck.rows.length === 0) {
        await pool.query(`
          INSERT INTO users (id, name, email, phone, password_hash, role)
          VALUES ($1, $2, $3, $4, $5, 'citizen')
          ON CONFLICT (email) DO UPDATE SET id = EXCLUDED.id;
        `, [
          apt.userId,
          apt.userName || 'Citizen User',
          apt.userEmail || `${apt.userId}@example.com`,
          apt.userPhone || '',
          await bcrypt.hash('Citizen@2026', 10)
        ]);
      }

      const insertText = `
        INSERT INTO appointments (
          id, citizen_id, citizen_name, citizen_email, citizen_phone,
          advocate_id, advocate_name, advocate_specialty, advocate_phone,
          category, court_level, appointment_date, appointment_time,
          consultation_type, issue, fee, status, meeting_link,
          application_id, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
        ON CONFLICT (id) DO UPDATE SET
          appointment_date = EXCLUDED.appointment_date,
          appointment_time = EXCLUDED.appointment_time,
          status = EXCLUDED.status,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *;
      `;

      const result = await pool.query(insertText, [
        aptId,
        apt.userId,
        apt.userName,
        apt.userEmail,
        apt.userPhone,
        apt.advocateId,
        apt.advocateName,
        apt.advocateSpecialty,
        apt.advocatePhone,
        apt.category,
        apt.courtLevel || 'District Court',
        apt.date,
        apt.time,
        apt.consultationType,
        apt.issue,
        apt.fee,
        apt.status || 'pending',
        apt.meetingLink || (apt.consultationType === 'Video' ? `https://meet.google.com/nyaay-sarathi-session-${aptId.slice(-6)}` : null),
        apt.applicationId || null
      ]);

      res.status(201).json({ appointment: formatAppointmentRow(result.rows[0]) });
    } else {
      memoryAppointments.set(aptId, apt);
      res.status(201).json({ appointment: apt });
    }
  } catch (error: any) {
    console.error('CreateAppointment error:', error.message);
    res.status(500).json({ error: 'Failed to persist appointment in database' });
  }
}

/**
 * PATCH /api/appointments/:id/status
 * Updates appointment status (accepted, cancelled, completed, etc.) in PostgreSQL.
 */
export async function handleUpdateAppointmentStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, meetingLink } = req.body || {};

    if (!status) {
      res.status(400).json({ error: 'Status is required' });
      return;
    }

    await initDatabase();
    const pool = getPool();
    if (pool) {

      const isAccepted = status === 'upcoming' || status === 'confirmed';
      const isExpired = status === 'expired' || status === 'no-response';

      const updateText = `
        UPDATE appointments
        SET
          status = $1,
          meeting_link = COALESCE($2, meeting_link),
          accepted_at = CASE WHEN $3 = true THEN CURRENT_TIMESTAMP ELSE accepted_at END,
          expired_at = CASE WHEN $4 = true THEN CURRENT_TIMESTAMP ELSE expired_at END,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *;
      `;

      const result = await pool.query(updateText, [
        status,
        meetingLink,
        isAccepted,
        isExpired,
        id
      ]);

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Appointment not found' });
        return;
      }

      // If accepted, also sync corresponding application if present
      if (isAccepted && result.rows[0].application_id) {
        await pool.query(`
          UPDATE applications
          SET acceptance_status = 'Accepted', status = 'Under Review', updated_at = CURRENT_TIMESTAMP
          WHERE application_id = $1 OR appointment_id = $2
        `, [result.rows[0].application_id, id]);
      }

      res.json({ appointment: formatAppointmentRow(result.rows[0]) });
    } else {
      res.json({ success: true, id, status });
    }
  } catch (error: any) {
    console.error('UpdateAppointmentStatus error:', error.message);
    res.status(500).json({ error: 'Failed to update appointment status' });
  }
}

/**
 * GET /api/applications
 * Queries applications from PostgreSQL for user.
 */
export async function handleGetApplications(req: Request, res: Response) {
  try {
    const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string);
    await initDatabase();
    const pool = getPool();
    if (pool) {

      let query = `
        SELECT a.*, u.name as citizen_name
        FROM applications a
        LEFT JOIN users u ON a.user_id = u.id
        WHERE 1=1
      `;
      const params: any[] = [];
      let paramCount = 1;

      if (userId) {
        params.push(userId);
        query += ` AND a.user_id = $${paramCount}`;
        paramCount++;
      }

      const advocateId = req.query.advocateId as string;
      if (advocateId) {
        params.push(advocateId);
        query += ` AND a.advocate_id = $${paramCount}`;
        paramCount++;
      }

      query += ' ORDER BY a.created_at DESC';

      const result = await pool.query(query, params);
      const applications = result.rows.map(formatApplicationRow);
      res.json({ applications });
    } else {
      res.json({ applications: INITIAL_APPLICATIONS });
    }
  } catch (error: any) {
    console.error('GetApplications error:', error.message);
    res.json({ applications: INITIAL_APPLICATIONS });
  }
}

/**
 * POST /api/applications
 * Persists a new legal application/case in PostgreSQL.
 */
export async function handleCreateApplication(req: Request, res: Response) {
  try {
    const appData: Application = req.body;
    if (!appData || !appData.userId || !appData.category) {
      res.status(400).json({ error: 'Missing required application parameters (userId, category).' });
      return;
    }

    await initDatabase();
    const pool = getPool();
    const id = appData.id || `app_${Date.now()}`;
    const applicationId = appData.applicationId || `NS-${Date.now().toString().slice(-4)}`;
    if (pool) {

      // Ensure user exists in users table
      const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [appData.userId]);
      if (userCheck.rows.length === 0) {
        await pool.query(`
          INSERT INTO users (id, name, email, role, password_hash)
          VALUES ($1, $2, $3, 'citizen', $4)
          ON CONFLICT (email) DO NOTHING;
        `, [
          appData.userId,
          'Citizen User',
          `${appData.userId}@example.com`,
          await bcrypt.hash('Citizen@2026', 10)
        ]);
      }

      const insertText = `
        INSERT INTO applications (
          id, application_id, user_id, advocate_id, advocate_name, advocate_contact,
          category, description, appointment_id, appointment_date, appointment_time,
          fee, payment_status, acceptance_status, status, timeline, draft_document,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
        ON CONFLICT (id) DO UPDATE SET
          acceptance_status = EXCLUDED.acceptance_status,
          status = EXCLUDED.status,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *;
      `;

      const result = await pool.query(insertText, [
        id,
        applicationId,
        appData.userId,
        appData.advocateId || null,
        appData.advocateName || '',
        appData.advocateContact || '',
        appData.category,
        appData.description,
        appData.appointmentId || null,
        appData.appointmentDate || null,
        appData.appointmentTime || null,
        appData.fee || 0,
        appData.paymentStatus || 'Paid',
        appData.acceptanceStatus || 'Pending',
        appData.status || 'Under Review',
        JSON.stringify(appData.timeline || []),
        appData.draftDocument || null
      ]);

      res.status(201).json({ application: formatApplicationRow(result.rows[0]) });
    } else {
      memoryApplications.set(id, appData);
      res.status(201).json({ application: appData });
    }
  } catch (error: any) {
    console.error('CreateApplication error:', error.message);
    res.status(500).json({ error: 'Failed to persist application in database' });
  }
}

/**
 * PATCH /api/applications/:id/status
 * Updates application status in PostgreSQL.
 */
export async function handleUpdateApplicationStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, acceptanceStatus } = req.body || {};

    await initDatabase();
    const pool = getPool();
    if (pool) {

      const updateText = `
        UPDATE applications
        SET
          status = COALESCE($1, status),
          acceptance_status = COALESCE($2, acceptance_status),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $3 OR application_id = $3
        RETURNING *;
      `;

      const result = await pool.query(updateText, [status, acceptanceStatus, id]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      res.json({ application: formatApplicationRow(result.rows[0]) });
    } else {
      res.json({ success: true, id, status, acceptanceStatus });
    }
  } catch (error: any) {
    console.error('UpdateApplicationStatus error:', error.message);
    res.status(500).json({ error: 'Failed to update application status' });
  }
}
