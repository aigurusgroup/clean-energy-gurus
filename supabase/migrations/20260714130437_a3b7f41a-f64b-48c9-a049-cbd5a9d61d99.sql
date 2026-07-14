REVOKE ALL ON public.energy_iq_assessments FROM anon;
REVOKE ALL ON public.energy_iq_assessments FROM authenticated;
GRANT INSERT ON public.energy_iq_assessments TO anon;
GRANT INSERT ON public.energy_iq_assessments TO authenticated;
GRANT ALL ON public.energy_iq_assessments TO service_role;

CREATE OR REPLACE FUNCTION public.submit_energy_iq_assessment(assessment jsonb)
RETURNS TABLE(assessment_id text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inserted_assessment_id text;
  score_value integer;
BEGIN
  IF assessment IS NULL OR jsonb_typeof(assessment) <> 'object' THEN
    RAISE EXCEPTION 'assessment payload must be a JSON object' USING ERRCODE = '22023';
  END IF;

  IF NULLIF(BTRIM(assessment->>'first_name'), '') IS NULL THEN
    RAISE EXCEPTION 'first_name is required' USING ERRCODE = '23502';
  END IF;
  IF NULLIF(BTRIM(assessment->>'last_name'), '') IS NULL THEN
    RAISE EXCEPTION 'last_name is required' USING ERRCODE = '23502';
  END IF;
  IF NULLIF(BTRIM(assessment->>'email'), '') IS NULL THEN
    RAISE EXCEPTION 'email is required' USING ERRCODE = '23502';
  END IF;
  IF NULLIF(BTRIM(assessment->>'telephone'), '') IS NULL THEN
    RAISE EXCEPTION 'telephone is required' USING ERRCODE = '23502';
  END IF;
  IF COALESCE((assessment->>'privacy_consent')::boolean, false) IS NOT TRUE THEN
    RAISE EXCEPTION 'privacy_consent is required' USING ERRCODE = '23502';
  END IF;
  IF NULLIF(BTRIM(assessment->>'energy_iq_score'), '') IS NULL THEN
    RAISE EXCEPTION 'energy_iq_score is required' USING ERRCODE = '23502';
  END IF;
  IF NULLIF(BTRIM(assessment->>'energy_iq_band'), '') IS NULL THEN
    RAISE EXCEPTION 'energy_iq_band is required' USING ERRCODE = '23502';
  END IF;

  BEGIN
    score_value := (assessment->>'energy_iq_score')::integer;
  EXCEPTION WHEN invalid_text_representation THEN
    RAISE EXCEPTION 'energy_iq_score must be an integer' USING ERRCODE = '22P02';
  END;

  INSERT INTO public.energy_iq_assessments (
    first_name,
    last_name,
    email,
    telephone,
    marketing_consent,
    privacy_consent,
    completed_at,
    full_address,
    postcode,
    epc_identifier,
    current_epc_rating,
    current_epc_score,
    potential_epc_rating,
    potential_epc_score,
    property_type,
    built_form,
    floor_area,
    main_heating,
    epc_recommendations,
    property_data_found,
    answers,
    skipped_questions,
    questionnaire_version,
    energy_iq_score,
    energy_iq_band,
    result_summary,
    findings,
    identified_opportunities,
    personalised_roadmap,
    calculation_version
  ) VALUES (
    BTRIM(assessment->>'first_name'),
    BTRIM(assessment->>'last_name'),
    BTRIM(assessment->>'email'),
    BTRIM(assessment->>'telephone'),
    COALESCE((assessment->>'marketing_consent')::boolean, false),
    COALESCE((assessment->>'privacy_consent')::boolean, false),
    COALESCE(NULLIF(assessment->>'completed_at', '')::timestamptz, now()),
    NULLIF(assessment->>'full_address', ''),
    NULLIF(assessment->>'postcode', ''),
    NULLIF(assessment->>'epc_identifier', ''),
    NULLIF(assessment->>'current_epc_rating', ''),
    NULLIF(assessment->>'current_epc_score', '')::integer,
    NULLIF(assessment->>'potential_epc_rating', ''),
    NULLIF(assessment->>'potential_epc_score', '')::integer,
    NULLIF(assessment->>'property_type', ''),
    NULLIF(assessment->>'built_form', ''),
    NULLIF(assessment->>'floor_area', '')::numeric,
    NULLIF(assessment->>'main_heating', ''),
    CASE WHEN jsonb_typeof(assessment->'epc_recommendations') IN ('array', 'object') THEN assessment->'epc_recommendations' ELSE '[]'::jsonb END,
    COALESCE((assessment->>'property_data_found')::boolean, false),
    CASE WHEN jsonb_typeof(assessment->'answers') = 'object' THEN assessment->'answers' ELSE '{}'::jsonb END,
    CASE WHEN jsonb_typeof(assessment->'skipped_questions') = 'array' THEN assessment->'skipped_questions' ELSE '[]'::jsonb END,
    COALESCE(NULLIF(assessment->>'questionnaire_version', ''), 'v1'),
    score_value,
    BTRIM(assessment->>'energy_iq_band'),
    NULLIF(assessment->>'result_summary', ''),
    CASE WHEN jsonb_typeof(assessment->'findings') = 'array' THEN assessment->'findings' ELSE '[]'::jsonb END,
    CASE WHEN jsonb_typeof(assessment->'identified_opportunities') = 'array' THEN assessment->'identified_opportunities' ELSE '[]'::jsonb END,
    CASE WHEN jsonb_typeof(assessment->'personalised_roadmap') = 'array' THEN assessment->'personalised_roadmap' ELSE '[]'::jsonb END,
    COALESCE(NULLIF(assessment->>'calculation_version', ''), 'v1')
  )
  RETURNING energy_iq_assessments.assessment_id INTO inserted_assessment_id;

  RETURN QUERY SELECT inserted_assessment_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_energy_iq_assessment(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_energy_iq_assessment(jsonb) TO anon;
GRANT EXECUTE ON FUNCTION public.submit_energy_iq_assessment(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_energy_iq_assessment(jsonb) TO service_role;