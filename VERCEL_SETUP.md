# Vercel & Supabase Setup

## 1. Vercel Environment Variables
Settings → Environment Variables

| Name                   | Value                                           |
|------------------------|-------------------------------------------------|
| VITE_SUPABASE_URL      | https://bkteygggqwlvvzmbopbs.supabase.co       |
| VITE_SUPABASE_ANON_KEY | sb_publishable_Fh0AT1i7Yz6-fAXSCBpmzg_5AWNp-t5|

Danach: Redeploy klicken.

## 2. Supabase Redirect URL für Passwort-Reset
Authentication → URL Configuration → Redirect URLs

Füge hinzu:
- https://deine-vercel-url.vercel.app/reset-password
- http://localhost:5173/reset-password

## 3. E-Mail-Bestätigung deaktivieren
Authentication → Policies → "Enable email confirmations" → AUS

## 4. Test-User anlegen
SQL Editor → Inhalt von supabase/create_test_users.sql ausführen
Alle Passwörter: Pawgress123!
E-Mails: test1@pawgress.app bis test5@pawgress.app
