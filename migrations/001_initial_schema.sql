-- Migration: 001_initial_schema.sql
-- Description: Production PostgreSQL relational schema for Nunes AI School Directory — Coimbatore District
-- Compliant with Section 10 of Specification

-- 1. Schools Table
CREATE TABLE IF NOT EXISTS schools (
    id VARCHAR(64) PRIMARY KEY,
    udise_code VARCHAR(16) UNIQUE NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    normalized_name VARCHAR(255) NOT NULL,
    management_type VARCHAR(100) NOT NULL,
    board VARCHAR(100) NOT NULL,
    school_level VARCHAR(100) NOT NULL,
    classes_offered VARCHAR(150),
    address TEXT NOT NULL,
    locality VARCHAR(150),
    taluk VARCHAR(100) NOT NULL,
    education_block VARCHAR(100) NOT NULL,
    district VARCHAR(100) DEFAULT 'Coimbatore',
    state VARCHAR(100) DEFAULT 'Tamil Nadu',
    pincode VARCHAR(10) NOT NULL,
    website TEXT,
    google_maps_link TEXT,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    source_provenance TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_schools_udise ON schools(udise_code);
CREATE INDEX IF NOT EXISTS idx_schools_block ON schools(education_block);
CREATE INDEX IF NOT EXISTS idx_schools_taluk ON schools(taluk);
CREATE INDEX IF NOT EXISTS idx_schools_board ON schools(board);
CREATE INDEX IF NOT EXISTS idx_schools_management ON schools(management_type);

-- 2. Sources Table
CREATE TABLE IF NOT EXISTS sources (
    id VARCHAR(64) PRIMARY KEY,
    source_name VARCHAR(255) NOT NULL,
    source_url TEXT NOT NULL,
    source_type VARCHAR(100) NOT NULL, -- 'Government Official', 'School Website', 'Affiliation Board', 'Secondary Public Directory'
    last_checked TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'ACTIVE' -- 'ACTIVE', 'WARNING', 'OFFLINE'
);

-- 3. Contacts Table (Normalized)
CREATE TABLE IF NOT EXISTS contacts (
    id VARCHAR(64) PRIMARY KEY,
    school_id VARCHAR(64) NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    contact_type VARCHAR(50) NOT NULL, -- 'landline', 'mobile', 'whatsapp', 'email', 'principal_office_phone', 'reception', 'admissions', 'alternate'
    contact_role VARCHAR(100) NOT NULL, -- 'Principal', 'Headmaster', 'Office Reception', 'School Administration', 'Admissions Desk', 'General Office'
    contact_person_name VARCHAR(150),
    telephone_number VARCHAR(50),
    email VARCHAR(150),
    whatsapp_url TEXT,
    source_id VARCHAR(64) REFERENCES sources(id) ON DELETE SET NULL,
    verification_status VARCHAR(50) DEFAULT 'UNVERIFIED', -- 'VERIFIED', 'PARTIALLY_ENRICHED', 'UNVERIFIED', 'STALE', 'REJECTED'
    confidence_score DECIMAL(3, 2) DEFAULT 0.0,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contacts_school ON contacts(school_id);
CREATE INDEX IF NOT EXISTS idx_contacts_type ON contacts(contact_type);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(verification_status);

-- 4. Research Jobs Table
CREATE TABLE IF NOT EXISTS research_jobs (
    id VARCHAR(64) PRIMARY KEY,
    school_id VARCHAR(64) NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    source_id VARCHAR(64) REFERENCES sources(id) ON DELETE SET NULL,
    job_type VARCHAR(100) NOT NULL, -- 'AI_WEB_SEARCH', 'GOV_REGISTER_LOOKUP', 'OFFICIAL_SITE_CRAWL', 'CONTACT_PAGE_PARSE', 'MANUAL_VERIFICATION_DISPATCH'
    job_status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'
    attempts INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_research_jobs_school ON research_jobs(school_id);
CREATE INDEX IF NOT EXISTS idx_research_jobs_status ON research_jobs(job_status);

-- 5. Contact Verifications Table
CREATE TABLE IF NOT EXISTS contact_verifications (
    id VARCHAR(64) PRIMARY KEY,
    contact_id VARCHAR(64) NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    verification_method VARCHAR(100) NOT NULL, -- 'HTTP_CRAWL', 'BOARD_AFFILIATION_LOOKUP', 'STAFF_SWITCHBOARD_CALL', 'DOMAIN_WHOIS', 'MANUAL_DOCUMENT_AUDIT'
    evidence TEXT NOT NULL,
    verified_by VARCHAR(100) NOT NULL,
    verification_result VARCHAR(50) NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contact_verifications_contact ON contact_verifications(contact_id);

-- 6. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    actor_id VARCHAR(64) NOT NULL,
    action VARCHAR(100) NOT NULL,
    record_type VARCHAR(100) NOT NULL,
    record_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_record ON audit_logs(record_type, record_id);

-- 7. Opt-Outs Registry (Compliance)
CREATE TABLE IF NOT EXISTS opt_outs (
    id VARCHAR(64) PRIMARY KEY,
    identifier_type VARCHAR(50) NOT NULL,
    identifier_value VARCHAR(150) NOT NULL,
    school_id VARCHAR(64),
    reason TEXT,
    requested_by VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Users Table (RBAC)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
