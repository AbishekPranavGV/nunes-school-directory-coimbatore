-- Migration: 002_providers_and_quality.sql
-- Description: Advanced 12-Source Discovery, Quality Assurance, and Staff Calling Tables
-- Compliant with Sections A, C, D, E of Specification

-- 1. Provider Registry Table (Tracks all 12 independent providers)
CREATE TABLE IF NOT EXISTS provider_registry (
    id TEXT PRIMARY KEY,
    provider_name TEXT NOT NULL,
    provider_type TEXT NOT NULL,
    is_available INTEGER DEFAULT 1,
    config_status TEXT NOT NULL, -- 'READY', 'CONFIGURED', 'MISSING_API_KEY', 'RATE_LIMITED'
    search_attempts INTEGER DEFAULT 0,
    schools_matched INTEGER DEFAULT 0,
    contacts_discovered INTEGER DEFAULT 0,
    contacts_verified INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    last_error TEXT,
    last_execution TEXT,
    usage_cost_currency TEXT DEFAULT 'INR',
    actual_usage_cost REAL DEFAULT 0.00,
    notes TEXT,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 2. Staff Calling Logs Table (Dedicated to Section D Staff Verification Workspace)
CREATE TABLE IF NOT EXISTS staff_calling_logs (
    id TEXT PRIMARY KEY,
    school_id TEXT NOT NULL,
    staff_name TEXT NOT NULL,
    called_phone TEXT NOT NULL,
    call_outcome TEXT NOT NULL, -- 'VERIFIED_OFFICIAL_OFFICE', 'BUSY', 'NO_ANSWER', 'WRONG_NUMBER', 'DISCONNECTED', 'FLAGGED_INCORRECT', 'REQUEST_ANOTHER_SOURCE'
    headmaster_confirmed TEXT,
    principal_desk_phone TEXT,
    whatsapp_confirmed TEXT,
    email_confirmed TEXT,
    notes TEXT,
    opt_out_requested INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_staff_calling_school ON staff_calling_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_staff_calling_outcome ON staff_calling_logs(call_outcome);

-- 3. Contact Candidates Table (For staging separate source-backed contacts before approval)
CREATE TABLE IF NOT EXISTS contact_candidates (
    id TEXT PRIMARY KEY,
    school_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    contact_type TEXT NOT NULL, -- 'landline', 'mobile', 'whatsapp', 'email', 'principal_office_phone'
    contact_role TEXT NOT NULL,
    contact_value TEXT NOT NULL,
    formatted_value TEXT NOT NULL,
    source_url TEXT NOT NULL,
    retrieval_date TEXT DEFAULT CURRENT_TIMESTAMP,
    ownership_evidence TEXT NOT NULL,
    verification_method TEXT NOT NULL,
    confidence_level REAL DEFAULT 0.0,
    exact_school_matching INTEGER DEFAULT 1,
    is_shared_group_number INTEGER DEFAULT 0,
    campus_group_name TEXT,
    mx_verified INTEGER DEFAULT 0,
    approval_status TEXT DEFAULT 'PENDING', -- 'APPROVED', 'REJECTED', 'PENDING', 'CONFLICT'
    manual_approval_required INTEGER DEFAULT 0,
    reviewed_by TEXT,
    reviewed_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_contact_candidates_school ON contact_candidates(school_id);
CREATE INDEX IF NOT EXISTS idx_contact_candidates_provider ON contact_candidates(provider_id);
CREATE INDEX IF NOT EXISTS idx_contact_candidates_approval ON contact_candidates(approval_status);
