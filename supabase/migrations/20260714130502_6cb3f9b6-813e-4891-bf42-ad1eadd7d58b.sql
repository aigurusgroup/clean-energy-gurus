DROP FUNCTION IF EXISTS public.submit_energy_iq_assessment(jsonb);

DROP POLICY IF EXISTS "Anyone can submit an Energy IQ assessment" ON public.energy_iq_assessments;

CREATE POLICY "Visitors can submit complete Energy IQ assessments"
ON public.energy_iq_assessments
FOR INSERT
TO anon, authenticated
WITH CHECK (
  privacy_consent IS TRUE
  AND NULLIF(BTRIM(first_name), '') IS NOT NULL
  AND NULLIF(BTRIM(last_name), '') IS NOT NULL
  AND NULLIF(BTRIM(email), '') IS NOT NULL
  AND NULLIF(BTRIM(telephone), '') IS NOT NULL
  AND energy_iq_score BETWEEN 0 AND 100
  AND NULLIF(BTRIM(energy_iq_band), '') IS NOT NULL
  AND jsonb_typeof(answers) = 'object'
  AND jsonb_typeof(skipped_questions) = 'array'
  AND jsonb_typeof(epc_recommendations) = 'array'
  AND jsonb_typeof(findings) = 'array'
  AND jsonb_typeof(identified_opportunities) = 'array'
  AND jsonb_typeof(personalised_roadmap) = 'array'
);