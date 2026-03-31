-- Create registros table for time tracking
CREATE TABLE IF NOT EXISTS public.registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha DATE NOT NULL,
  horas DECIMAL(4,1) NOT NULL CHECK (horas > 0),
  persona TEXT NOT NULL,
  rubro TEXT NOT NULL,
  etapa TEXT,
  detalle TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_registros_fecha ON public.registros(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_registros_persona ON public.registros(persona);
CREATE INDEX IF NOT EXISTS idx_registros_rubro ON public.registros(rubro);

-- Disable RLS since there are no users - everyone shares the same data
ALTER TABLE public.registros DISABLE ROW LEVEL SECURITY;

-- Grant access to anonymous users (for public access without auth)
GRANT ALL ON public.registros TO anon;
GRANT ALL ON public.registros TO authenticated;
