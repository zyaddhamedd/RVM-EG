-- Phase 2 Migration: Simplify Creator Form
-- Drops the NOT NULL constraint from columns that are being removed from the public application form.
-- This ensures existing data is preserved, but new submissions won't fail when these fields are omitted.

ALTER TABLE creators ALTER COLUMN equipment DROP NOT NULL;
ALTER TABLE creators ALTER COLUMN availability DROP NOT NULL;
ALTER TABLE creators ALTER COLUMN why_join DROP NOT NULL;
