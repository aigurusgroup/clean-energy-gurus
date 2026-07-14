
CREATE TABLE public.energy_iq_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id text NOT NULL UNIQUE DEFAULT ('EIQ-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),

  -- Customer
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  telephone text NOT NULL,
  marketing_consent boolean NOT NULL DEFAULT false,
  privacy_consent boolean NOT NULL DEFAULT false,
  completed_at timestamptz NOT NULL DEFAULT now(),

  -- Property
  full_address text,
  postcode text,
  epc_identifier text,
  current_epc_rating text,
  current_epc_score integer,
  potential_epc_rating text,
  potential_epc_score integer,
  property_type text,
  built_form text,
  floor_area numeric,
  main_heating text,
  epc_recommendations jsonb NOT NULL DEFAULT '[]'::jsonb,
  property_data_found boolean NOT NULL DEFAULT false,

  -- Questionnaire
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  skipped_questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  questionnaire_version text NOT NULL DEFAULT 'v1',

  -- Energy IQ Result
  energy_iq_score integer NOT NULL,
  energy_iq_band text NOT NULL,
  result_summary text,
  findings jsonb NOT NULL DEFAULT '[]'::jsonb,
  identified_opportunities jsonb NOT NULL DEFAULT '[]'::jsonb,
  personalised_roadmap jsonb NOT NULL DEFAULT '[]'::jsonb,
  calculation_version text NOT NULL DEFAULT 'v1',

  -- Integration status
  ghl_sync_status text NOT NULL DEFAULT 'pending',
  ghl_contact_id text,
  ghl_opportunity_id text,
  ghl_sync_error text,
  pdf_status text NOT NULL DEFAULT 'pending',
  pdf_url text,
  ai_recommendation_status text NOT NULL DEFAULT 'pending',

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Grants: allow anonymous + authenticated visitors to submit (INSERT only).
-- Deliberately no SELECT/UPDATE/DELETE to app roles — records are private.
GRANT INSERT ON public.energy_iq_assessments TO anon, authenticated;
GRANT ALL ON public.energy_iq_assessments TO service_role;

ALTER TABLE public.energy_iq_assessments ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a new assessment
CREATE POLICY "Anyone can submit an Energy IQ assessment"
ON public.energy_iq_assessments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Updated-at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_energy_iq_assessments_updated_at
BEFORE UPDATE ON public.energy_iq_assessments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_energy_iq_assessments_email ON public.energy_iq_assessments (email);
CREATE INDEX idx_energy_iq_assessments_completed_at ON public.energy_iq_assessments (completed_at DESC);
