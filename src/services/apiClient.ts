import { AuthUser, Advocate, Appointment, Application } from '../types';
import { 
  saveAppointment as saveLocalAppointment, 
  updateAppointmentStatus as updateLocalAppointmentStatus,
  saveApplication as saveLocalApplication,
  saveStoredUser as saveLocalUser
} from '../data/portalData';

/**
 * Client API utility to communicate with backend PostgreSQL endpoints.
 */

export async function apiRegister(payload: any): Promise<{ user: AuthUser; advocate?: Advocate | null }> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to register account');
  }

  // Update local cache
  if (data.user) {
    saveLocalUser(data.user);
  }

  return data;
}

export async function apiLogin(payload: { email: string; password: string; role?: string }): Promise<{ user: AuthUser; advocate?: Advocate | null }> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Invalid credentials');
  }

  // Update local cache
  if (data.user) {
    saveLocalUser(data.user);
  }

  return data;
}

export async function apiGetUser(id: string): Promise<AuthUser | null> {
  try {
    const response = await fetch(`/api/users/${encodeURIComponent(id)}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.user || null;
  } catch (e) {
    return null;
  }
}

export async function apiUpdateUser(id: string, updates: Partial<AuthUser>): Promise<AuthUser> {
  const response = await fetch(`/api/users/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update profile');
  }

  if (data.user) {
    saveLocalUser(data.user);
  }

  return data.user;
}

export async function apiChangePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
  const response = await fetch(`/api/users/${encodeURIComponent(id)}/password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to change password');
  }
}

export async function apiGetAdvocates(params?: {
  search?: string;
  courtLevel?: string;
  practiceArea?: string;
  city?: string;
}): Promise<Advocate[]> {
  try {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.courtLevel) query.set('courtLevel', params.courtLevel);
    if (params?.practiceArea) query.set('practiceArea', params.practiceArea);
    if (params?.city) query.set('city', params.city);

    const res = await fetch(`/api/advocates?${query.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.advocates || [];
  } catch (e) {
    return [];
  }
}

export async function apiGetAppointments(userId?: string): Promise<Appointment[]> {
  try {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    const res = await fetch(`/api/appointments${query}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.appointments || [];
  } catch (e) {
    return [];
  }
}

export async function apiCreateAppointment(appointment: Appointment): Promise<Appointment> {
  // Sync to local cache first
  saveLocalAppointment(appointment);

  try {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.appointment) {
        saveLocalAppointment(data.appointment);
        return data.appointment;
      }
    }
  } catch (e) {
    console.warn('Backend sync failed, saved locally:', e);
  }

  return appointment;
}

export async function apiUpdateAppointmentStatus(
  id: string, 
  status: 'pending' | 'upcoming' | 'confirmed' | 'completed' | 'cancelled' | 'expired' | 'no-response',
  meetingLink?: string
): Promise<void> {
  // Sync to local cache
  updateLocalAppointmentStatus(id, status);

  try {
    await fetch(`/api/appointments/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, meetingLink }),
    });
  } catch (e) {
    console.warn('Backend status update failed, updated locally:', e);
  }
}

export async function apiGetApplications(userId?: string, advocateId?: string): Promise<Application[]> {
  try {
    const query = new URLSearchParams();
    if (userId) query.set('userId', userId);
    if (advocateId) query.set('advocateId', advocateId);
    
    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`/api/applications${queryString}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.applications || [];
  } catch (e) {
    return [];
  }
}

export async function apiUpdateApplicationStatus(
  id: string, 
  updates: { status?: string; acceptanceStatus?: string }
): Promise<void> {
  try {
    await fetch(`/api/applications/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  } catch (e) {
    console.warn('Backend application status update failed:', e);
  }
}

export async function apiCreateApplication(app: Application): Promise<Application> {
  saveLocalApplication(app);

  try {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(app),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.application) {
        saveLocalApplication(data.application);
        return data.application;
      }
    }
  } catch (e) {
    console.warn('Backend application sync failed, saved locally:', e);
  }

  return app;
}

/**
 * Fetch authenticated advocate's actual database profile from PostgreSQL.
 * Throws error if missing instead of silently defaulting.
 */
export async function apiGetAdvocateProfile(userId: string): Promise<{ user: AuthUser; advocate: Advocate }> {
  const response = await fetch(`/api/advocate/profile/${encodeURIComponent(userId)}`, {
    headers: {
      'x-user-id': userId
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch advocate profile');
  }

  if (data.user) {
    saveLocalUser(data.user);
  }

  return data;
}

/**
 * Update authenticated advocate's actual database profile in PostgreSQL.
 */
export async function apiUpdateAdvocateProfile(userId: string, updates: any): Promise<{ user: AuthUser; advocate: Advocate }> {
  const response = await fetch(`/api/advocate/profile/${encodeURIComponent(userId)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId
    },
    body: JSON.stringify({ ...updates, userId }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update advocate profile');
  }

  if (data.user) {
    saveLocalUser(data.user);
  }

  return data;
}
