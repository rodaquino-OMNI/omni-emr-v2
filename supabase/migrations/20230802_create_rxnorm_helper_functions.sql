
-- Create helper functions to get cache data

-- Function to get NDC cache data
CREATE OR REPLACE FUNCTION get_rxnorm_ndc_cache(rxcui_param TEXT)
RETURNS TABLE (
  id UUID,
  rxcui TEXT,
  ndcs JSONB,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM rxnorm_ndc_cache
  WHERE rxcui = rxcui_param
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to insert NDC cache data
CREATE OR REPLACE FUNCTION insert_rxnorm_ndc_cache(rxcui_param TEXT, ndcs_param JSONB)
RETURNS VOID AS $$
BEGIN
  INSERT INTO rxnorm_ndc_cache (rxcui, ndcs, created_at)
  VALUES (
    rxcui_param,
    ndcs_param,
    now()
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get display terms cache data
CREATE OR REPLACE FUNCTION get_rxnorm_displayterms_cache(term_param TEXT)
RETURNS TABLE (
  id UUID,
  search_term TEXT,
  terms JSONB,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM rxnorm_displayterms_cache
  WHERE search_term = term_param
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to insert display terms cache data
CREATE OR REPLACE FUNCTION insert_rxnorm_displayterms_cache(term_param TEXT, terms_param JSONB)
RETURNS VOID AS $$
BEGIN
  INSERT INTO rxnorm_displayterms_cache (search_term, terms, created_at)
  VALUES (
    term_param,
    terms_param,
    now()
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get interactions cache data
CREATE OR REPLACE FUNCTION get_rxnorm_interactions_cache(key_param TEXT)
RETURNS TABLE (
  id UUID,
  interaction_key TEXT,
  rxcuis TEXT[],
  interactions JSONB,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM rxnorm_interactions_cache
  WHERE interaction_key = key_param
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to insert interactions cache data
CREATE OR REPLACE FUNCTION insert_rxnorm_interactions_cache(key_param TEXT, rxcuis_param TEXT[], interactions_param JSONB)
RETURNS VOID AS $$
BEGIN
  INSERT INTO rxnorm_interactions_cache (interaction_key, rxcuis, interactions, created_at)
  VALUES (
    key_param,
    rxcuis_param,
    interactions_param,
    now()
  );
END;
$$ LANGUAGE plpgsql;
