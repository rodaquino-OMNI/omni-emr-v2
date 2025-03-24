-- Fix function_search_path_mutable warnings by explicitly setting search_path
-- for the affected functions

-- Fix clean_rxnorm_cache function
ALTER FUNCTION public.clean_rxnorm_cache()
SET search_path = '$user', public;

-- Fix get_rxnorm_displayterms_cache function
ALTER FUNCTION public.get_rxnorm_displayterms_cache(term_param text)
SET search_path = '$user', public;

-- Fix get_rxnorm_interactions_cache function
ALTER FUNCTION public.get_rxnorm_interactions_cache(key_param text)
SET search_path = '$user', public;

-- Fix get_rxnorm_ndc_cache function
ALTER FUNCTION public.get_rxnorm_ndc_cache(rxcui_param text)
SET search_path = '$user', public;

-- Fix insert_rxnorm_displayterms_cache function
ALTER FUNCTION public.insert_rxnorm_displayterms_cache(term_param text, terms_param jsonb)
SET search_path = '$user', public;

-- Fix insert_rxnorm_interactions_cache function
ALTER FUNCTION public.insert_rxnorm_interactions_cache(key_param text, rxcuis_param text[], interactions_param jsonb)
SET search_path = '$user', public;

-- Fix insert_rxnorm_ndc_cache function
ALTER FUNCTION public.insert_rxnorm_ndc_cache(rxcui_param text, ndcs_param jsonb)
SET search_path = '$user', public;