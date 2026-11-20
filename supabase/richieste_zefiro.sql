-- ZEFIRO — tabella delle richieste dal modulo contatti.
-- Supabase → SQL Editor → incolla tutto → Run. Basta farlo una volta.
-- Le richieste le scrive solo la Edge Function (con la chiave di servizio):
-- nessuno può leggerle o modificarle dal sito.

create table if not exists public.richieste_zefiro (
  id          bigint generated always as identity primary key,
  creata_il   timestamptz not null default now(),
  nome        text not null,
  email       text not null,
  azienda     text,
  tipologia   text not null,
  budget      text,
  descrizione text not null,
  stato       text not null default 'nuova'   -- nuova · in corso · chiusa (lo cambi tu dal Table Editor)
);

alter table public.richieste_zefiro enable row level security;
-- nessuna policy: dal sito non si legge e non si scrive; la funzione usa la service role key
