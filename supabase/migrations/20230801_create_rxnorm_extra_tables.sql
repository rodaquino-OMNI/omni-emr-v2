
-- Create new cache tables for additional RxNorm API features

-- Table for NDC code cache
CREATE TABLE IF NOT EXISTS rxnorm_ndc_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rxcui TEXT NOT NULL,
  ndcs JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for display terms cache (autocomplete)
CREATE TABLE IF NOT EXISTS rxnorm_displayterms_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_term TEXT NOT NULL,
  terms JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for drug interaction cache
CREATE TABLE IF NOT EXISTS rxnorm_interactions_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interaction_key TEXT NOT NULL,
  rxcuis TEXT[] NOT NULL,
  interactions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS rxnorm_ndc_cache_rxcui_idx ON rxnorm_ndc_cache (rxcui);
CREATE INDEX IF NOT EXISTS rxnorm_displayterms_cache_search_term_idx ON rxnorm_displayterms_cache (search_term);
CREATE INDEX IF NOT EXISTS rxnorm_interactions_cache_key_idx ON rxnorm_interactions_cache (interaction_key);

-- Add a function to clean expired cache entries
CREATE OR REPLACE FUNCTION clean_rxnorm_cache() RETURNS void AS $$
BEGIN
  -- Delete cache entries older than 7 days
  DELETE FROM rxnorm_search_cache WHERE created_at < NOW() - INTERVAL '7 days';
  DELETE FROM rxnorm_details_cache WHERE created_at < NOW() - INTERVAL '7 days';
  DELETE FROM rxnorm_ndc_cache WHERE created_at < NOW() - INTERVAL '7 days';
  DELETE FROM rxnorm_displayterms_cache WHERE created_at < NOW() - INTERVAL '7 days';
  DELETE FROM rxnorm_interactions_cache WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;
