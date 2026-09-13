import pg from 'pg';
import bcrypt from 'bcrypt';
import { INITIAL_ADVOCATES } from '../data/portalData.ts';

const { Pool } = pg;

let pool: pg.Pool | null = null;
let initializationPromise: Promise<boolean> | null = null;
let failedToConnect = false;

/**
 * Returns a reusable PostgreSQL connection pool.
 * Does not crash if DATABASE_URL is not set; returns null with a warning.
 */
export function getPool(): pg.Pool | null {
  if (pool) return pool;
  if (failedToConnect) return null;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn('[PostgreSQL] NOTICE: DATABASE_URL environment variable is not configured. Running with in-memory fallback.');
    return null;
  }

  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const isSsl = isProduction || 
      connectionString.includes('sslmode=require') || 
      connectionString.includes('render.com') ||
      connectionString.includes('dpg-');

    pool = new Pool({
      connectionString,
      ssl: isSsl ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 8000,
    });

    pool.on('error', (err) => {
      console.error('[PostgreSQL] Unexpected error on idle client:', err.message);
    });

    return pool;
  } catch (error: any) {
    console.error('[PostgreSQL] Pool initialization error:', error.message);
    return null;
  }
}

/**
 * Safe database schema initialization with CREATE TABLE IF NOT EXISTS.
 * Preserves all existing data.
 */
export async function initDatabase(): Promise<boolean> {
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    const dbPool = getPool();
    if (!dbPool) {
      console.log('[PostgreSQL] Skipped schema creation: DATABASE_URL not set.');
      return false;
    }

    let client;
    try {
      client = await dbPool.connect();
      console.log('[PostgreSQL] Initializing database tables and indexes...');

      // 1. Users Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(50),
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL,
          dob VARCHAR(50),
          state VARCHAR(100),
          city VARCHAR(100),
          address TEXT,
          profile_picture TEXT,
          is_verified BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 2. Advocates Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS advocates (
          id VARCHAR(100) PRIMARY KEY,
          user_id VARCHAR(100) REFERENCES users(id) ON DELETE SET NULL,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          bar_council_id VARCHAR(100),
          state_bar_council VARCHAR(150),
          practice_areas JSONB DEFAULT '[]'::jsonb,
          court_level VARCHAR(150),
          court_levels JSONB DEFAULT '[]'::jsonb,
          courts TEXT,
          city VARCHAR(100),
          state VARCHAR(100),
          location VARCHAR(200),
          languages JSONB DEFAULT '[]'::jsonb,
          experience VARCHAR(100),
          experience_years INTEGER DEFAULT 0,
          about TEXT,
          education TEXT,
          consultation_fee NUMERIC(10, 2) DEFAULT 500,
          consultation_duration VARCHAR(50) DEFAULT '30 mins',
          consultation_duration_minutes INTEGER DEFAULT 30,
          rating NUMERIC(3, 2) DEFAULT 4.9,
          review_count INTEGER DEFAULT 0,
          availability VARCHAR(100) DEFAULT 'Available Today',
          past_cases_summary TEXT,
          reviews JSONB DEFAULT '[]'::jsonb,
          verification_status VARCHAR(50) DEFAULT 'PENDING',
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 3. Appointments Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS appointments (
          id VARCHAR(100) PRIMARY KEY,
          citizen_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
          citizen_name VARCHAR(255),
          citizen_email VARCHAR(255),
          citizen_phone VARCHAR(50),
          advocate_id VARCHAR(100) REFERENCES advocates(id) ON DELETE SET NULL,
          advocate_name VARCHAR(255),
          advocate_specialty VARCHAR(255),
          advocate_phone VARCHAR(50),
          category VARCHAR(150),
          court_level VARCHAR(150),
          appointment_date VARCHAR(50) NOT NULL,
          appointment_time VARCHAR(50) NOT NULL,
          consultation_type VARCHAR(50) NOT NULL,
          issue TEXT,
          fee NUMERIC(10, 2) DEFAULT 0,
          status VARCHAR(50) NOT NULL DEFAULT 'pending',
          meeting_link TEXT,
          location_address TEXT,
          application_id VARCHAR(100),
          accepted_at TIMESTAMPTZ,
          expired_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 4. Applications Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS applications (
          id VARCHAR(100) PRIMARY KEY,
          application_id VARCHAR(100) NOT NULL,
          user_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
          advocate_id VARCHAR(100) REFERENCES advocates(id) ON DELETE SET NULL,
          advocate_name VARCHAR(255),
          advocate_contact VARCHAR(50),
          category VARCHAR(150),
          description TEXT,
          appointment_id VARCHAR(100),
          appointment_date VARCHAR(50),
          appointment_time VARCHAR(50),
          fee NUMERIC(10, 2) DEFAULT 0,
          payment_status VARCHAR(50) DEFAULT 'Paid',
          acceptance_status VARCHAR(50) DEFAULT 'Pending',
          status VARCHAR(50) DEFAULT 'Under Review',
          timeline JSONB DEFAULT '[]'::jsonb,
          draft_document TEXT,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create Performance Indexes
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_advocates_email ON advocates(email);
        CREATE INDEX IF NOT EXISTS idx_advocates_user_id ON advocates(user_id);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_advocates_unique_user_id ON advocates(user_id) WHERE user_id IS NOT NULL;
        CREATE INDEX IF NOT EXISTS idx_appointments_citizen_id ON appointments(citizen_id);
        CREATE INDEX IF NOT EXISTS idx_appointments_advocate_id ON appointments(advocate_id);
        CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
      `);

      // Idempotent column migrations for users and advocates
      await client.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS dob VARCHAR(50);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS state VARCHAR(100);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture TEXT;

        ALTER TABLE advocates ADD COLUMN IF NOT EXISTS consultation_fee NUMERIC(10, 2) DEFAULT 500;
        ALTER TABLE advocates ADD COLUMN IF NOT EXISTS consultation_duration VARCHAR(50) DEFAULT '30 mins';
        ALTER TABLE advocates ADD COLUMN IF NOT EXISTS consultation_duration_minutes INTEGER DEFAULT 30;
        ALTER TABLE advocates ADD COLUMN IF NOT EXISTS bar_council_id VARCHAR(100);
        ALTER TABLE advocates ADD COLUMN IF NOT EXISTS state_bar_council VARCHAR(150);
        ALTER TABLE advocates ADD COLUMN IF NOT EXISTS courts TEXT;
        ALTER TABLE advocates ADD COLUMN IF NOT EXISTS experience VARCHAR(100);
        ALTER TABLE advocates ADD COLUMN IF NOT EXISTS city VARCHAR(100);
        ALTER TABLE advocates ADD COLUMN IF NOT EXISTS state VARCHAR(100);
        ALTER TABLE advocates ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '[]'::jsonb;
        ALTER TABLE advocates ADD COLUMN IF NOT EXISTS practice_areas JSONB DEFAULT '[]'::jsonb;

        -- Fix any existing corrupted consultation_fee values (e.g. 50030 -> 500)
        UPDATE advocates SET consultation_fee = 500 WHERE consultation_fee = 50030;
        UPDATE advocates SET consultation_fee = 800 WHERE consultation_fee = 80030;
        UPDATE advocates SET consultation_fee = 1000 WHERE consultation_fee = 100030;
        UPDATE advocates SET consultation_fee = FLOOR(consultation_fee / 100) WHERE consultation_fee > 10000 AND consultation_fee::text LIKE '%30';
      `);

      // Seed Initial Demo Advocates if table is empty
      const advCountRes = await client.query('SELECT COUNT(*) FROM advocates');
      const advCount = parseInt(advCountRes.rows[0].count, 10);
      if (advCount === 0 && INITIAL_ADVOCATES.length > 0) {
        console.log(`[PostgreSQL] Seeding ${INITIAL_ADVOCATES.length} default advocates into database...`);
        for (const adv of INITIAL_ADVOCATES) {
          await client.query(`
            INSERT INTO advocates (
              id, full_name, email, phone, bar_council_id, state_bar_council,
              practice_areas, court_level, court_levels, courts, city, state, location,
              languages, experience, experience_years, about, education, consultation_fee,
              rating, review_count, availability, past_cases_summary, reviews, verification_status
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
            ) ON CONFLICT (id) DO NOTHING;
          `, [
            adv.id,
            adv.name,
            adv.email,
            adv.phone,
            adv.barEnrollment,
            adv.location.includes('Delhi') ? 'Bar Council of Delhi' : 'State Bar Council',
            JSON.stringify(adv.practiceAreas),
            adv.courtLevels[0] || 'High Court',
            JSON.stringify(adv.courtLevels),
            adv.courts,
            adv.city,
            adv.state,
            adv.location,
            JSON.stringify(adv.languages),
            adv.experience,
            adv.experienceYears,
            adv.about,
            adv.education,
            adv.consultationFee,
            adv.rating,
            adv.reviewCount,
            adv.availability,
            adv.pastCasesSummary || '',
            JSON.stringify(adv.reviews || []),
            'VERIFIED' // Mark demo directory advocates verified for directory browsing
          ]);
        }
      }

      // Seed default demo citizen account if missing
      const userCountRes = await client.query("SELECT COUNT(*) FROM users WHERE email = 'rajesh.kumar@gmail.com'");
      if (parseInt(userCountRes.rows[0].count, 10) === 0) {
        const defaultPasswordHash = await bcrypt.hash('Citizen@2026', 10);
        await client.query(`
          INSERT INTO users (
            id, name, email, phone, password_hash, role, dob, state, city, address
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (email) DO NOTHING;
        `, [
          'demo_citizen',
          'Rajesh Kumar',
          'rajesh.kumar@gmail.com',
          '+91 9876543210',
          defaultPasswordHash,
          'citizen',
          '1992-05-14',
          'Delhi',
          'New Delhi',
          'B-42, Pocket 1, Mayur Vihar Phase 1, New Delhi - 110091'
        ]);
      }

      // Seed default demo advocate account if missing
      const demoAdvUserRes = await client.query("SELECT COUNT(*) FROM users WHERE email = 'adv.vikram.sharma@delhibar.org'");
      if (parseInt(demoAdvUserRes.rows[0].count, 10) === 0) {
        const advPasswordHash = await bcrypt.hash('Advocate@2026', 10);
        await client.query(`
          INSERT INTO users (
            id, name, email, phone, password_hash, role, city, state, is_verified
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
          ON CONFLICT (email) DO NOTHING;
        `, [
          'demo_advocate_vikram',
          'Adv. Vikram Sharma',
          'adv.vikram.sharma@delhibar.org',
          '+91 98110 22334',
          advPasswordHash,
          'advocate',
          'New Delhi',
          'Delhi NCR'
        ]);

        await client.query(`
          INSERT INTO advocates (
            id, user_id, full_name, email, phone, bar_council_id, state_bar_council,
            practice_areas, court_level, court_levels, courts, city, state, location,
            languages, experience, experience_years, about, education, consultation_fee,
            rating, review_count, availability, past_cases_summary, verification_status
          ) VALUES (
            'adv_demo_vikram', 'demo_advocate_vikram', 'Adv. Vikram Sharma', 'adv.vikram.sharma@delhibar.org',
            '+91 98110 22334', 'D/1842/2016', 'Bar Council of Delhi',
            '["Constitutional Law", "Criminal Defense"]'::jsonb,
            'High Court', '["High Court", "Supreme Court"]'::jsonb,
            'Delhi High Court & Supreme Court of India',
            'New Delhi', 'Delhi NCR', 'New Delhi, Delhi NCR',
            '["English", "Hindi", "Punjabi"]'::jsonb,
            '8+ Years Experience', 8,
            'Senior Advocate practicing before the Delhi High Court and Supreme Court of India.',
            'B.A. LL.B. (Hons) - National Law University Delhi',
            800, 4.9, 42, 'Available Today',
            'Successfully represented over 180+ writ petitions and bail applications.',
            'VERIFIED'
          )
          ON CONFLICT (id) DO UPDATE SET user_id = 'demo_advocate_vikram';
        `);
      }

      console.log('[PostgreSQL] Database tables and seed check completed successfully.');
      return true;
    } catch (err: any) {
      console.error('[PostgreSQL] Error during database initialization:', err.message);
      console.warn('[PostgreSQL] Falling back to in-memory store due to connection failure.');
      failedToConnect = true;
      pool = null;
      return false;
    } finally {
      if (client) client.release();
    }
  })();

  return initializationPromise;
}
