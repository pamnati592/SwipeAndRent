-- ============================================================
-- SwipeAndRent – Demo Seed Script
-- Paste this entire file into:
--   Supabase Dashboard → SQL Editor → New Query → Run
-- Project: kfuiofokcvdrxkmdzrxp
-- ============================================================
-- ACCOUNTS:
--   Nati        → 5f3d04de-da84-494f-8ca7-11220d7d4eec
--   Ori Perelman → 131ab58f-3077-47db-acfc-6af03b71eecf
-- ============================================================

-- ── STEP 1: Spread existing items across different Tel Aviv locations ──

UPDATE public.items
SET location = ST_SetSRID(ST_MakePoint(34.7818, 32.0853), 4326)::geography,
    city = 'Tel Aviv Center'
WHERE id = 'cc000000-0000-0000-0000-000000000001'; -- Nati: Camera Kit (0 km from center)

UPDATE public.items
SET location = ST_SetSRID(ST_MakePoint(34.7988, 32.1177), 4326)::geography,
    city = 'Ramat Aviv'
WHERE id = 'cc000000-0000-0000-0000-000000000002'; -- Nati: Mountain Bike (~5 km north)

UPDATE public.items
SET location = ST_SetSRID(ST_MakePoint(34.7675, 32.0970), 4326)::geography,
    city = 'Tel Aviv Port'
WHERE id = 'cc000000-0000-0000-0000-000000000003'; -- Nati: Camping Tent (~2.5 km north)

UPDATE public.items
SET location = ST_SetSRID(ST_MakePoint(34.7672, 32.0617), 4326)::geography,
    city = 'Florentin'
WHERE id = 'cc000000-0000-0000-0000-000000000004'; -- Nati: Power Drill (~2.7 km south)

UPDATE public.items
SET location = ST_SetSRID(ST_MakePoint(34.7630, 32.0601), 4326)::geography,
    city = 'Neve Tzedek'
WHERE id = '53c77124-1db0-418b-8464-fb3ecacbd1de'; -- Ori: PS5 (~3 km south)

-- ── STEP 2: New items for Nati ────────────────────────────────────────

INSERT INTO public.items
  (id, owner_id, title, category, description, daily_price, sale_price,
   verification_status, location, city, tags, photos)
VALUES
(
  'dd000000-0000-0000-0000-000000000001',
  '5f3d04de-da84-494f-8ca7-11220d7d4eec',
  'GoPro Hero 12 + Accessories Kit',
  'photography',
  'GoPro Hero 12 Black with waterproof housing, chest mount, head mount, 3 batteries, and 64GB card. Ideal for extreme sports, diving, or travel vlogs.',
  55.00, NULL, 'live',
  ST_SetSRID(ST_MakePoint(34.7526, 32.0513), 4326)::geography,
  'Yaffo',
  ARRAY['gopro','action-camera','waterproof','sports','4k'],
  ARRAY['https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&w=800']
),
(
  'dd000000-0000-0000-0000-000000000002',
  '5f3d04de-da84-494f-8ca7-11220d7d4eec',
  'DJI Mini 3 Pro Drone',
  'photography',
  'DJI Mini 3 Pro with RC controller, 3 batteries (90 min total), and ND filters kit. Under 249g — no license required in Israel. Perfect for coastal and city aerial shots.',
  120.00, NULL, 'live',
  ST_SetSRID(ST_MakePoint(34.8460, 32.1660), 4326)::geography,
  'Herzliya Pituah',
  ARRAY['drone','dji','aerial','4k','photography'],
  ARRAY['https://images.pexels.com/photos/336232/pexels-photo-336232.jpeg?auto=compress&w=800']
),
(
  'dd000000-0000-0000-0000-000000000003',
  '5f3d04de-da84-494f-8ca7-11220d7d4eec',
  'Fender Acoustic Guitar + Bag',
  'music',
  'Fender FA-115 acoustic guitar with padded gig bag, extra strings, capo, and clip-on tuner. Great condition. Perfect for beach sessions, events, or weekend trips.',
  35.00, NULL, 'live',
  ST_SetSRID(ST_MakePoint(34.7740, 32.0790), 4326)::geography,
  'Tel Aviv',
  ARRAY['guitar','acoustic','fender','music','beginner'],
  ARRAY['https://images.pexels.com/photos/164693/pexels-photo-164693.jpeg?auto=compress&w=800']
);

-- ── STEP 3: New items for Ori ─────────────────────────────────────────

INSERT INTO public.items
  (id, owner_id, title, category, description, daily_price, sale_price,
   verification_status, location, city, tags, photos)
VALUES
(
  'dd000000-0000-0000-0000-000000000004',
  '131ab58f-3077-47db-acfc-6af03b71eecf',
  'Surfboard 7ft Funboard + Leash & Fins',
  'sports',
  'Funboard 7ft — stable and forgiving, ideal for beginners to intermediates. Comes with leash and tri-fin setup. Based near Jaffa Port, 5 min walk to the beach.',
  65.00, NULL, 'live',
  ST_SetSRID(ST_MakePoint(34.7483, 32.0576), 4326)::geography,
  'Jaffa Port',
  ARRAY['surfboard','surf','beach','water-sports','funboard'],
  ARRAY['https://images.pexels.com/photos/390051/pexels-photo-390051.jpeg?auto=compress&w=800']
),
(
  'dd000000-0000-0000-0000-000000000005',
  '131ab58f-3077-47db-acfc-6af03b71eecf',
  'Nintendo Switch OLED + 4 Games',
  'gaming',
  'Nintendo Switch OLED white edition with Mario Kart 8 Deluxe, Zelda: Tears of the Kingdom, Super Mario Party, and Smash Bros Ultimate. All in excellent condition.',
  45.00, NULL, 'live',
  ST_SetSRID(ST_MakePoint(34.7795, 32.0810), 4326)::geography,
  'Tel Aviv',
  ARRAY['nintendo','switch','gaming','console','oled'],
  ARRAY['https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&w=800']
),
(
  'dd000000-0000-0000-0000-000000000006',
  '131ab58f-3077-47db-acfc-6af03b71eecf',
  'Premium Hammock + Camping Kit',
  'camping',
  'ENO DoubleNest hammock with Atlas straps, rain tarp, headlamp, and sleeping bag liner. Sets up in 5 minutes between any two trees. Rated for 200kg. Perfect for parks or forest trips.',
  40.00, NULL, 'live',
  ST_SetSRID(ST_MakePoint(34.7650, 32.0590), 4326)::geography,
  'Florentin',
  ARRAY['hammock','eno','camping','outdoor','sleeping'],
  ARRAY['https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&w=800']
),
(
  'dd000000-0000-0000-0000-000000000007',
  '131ab58f-3077-47db-acfc-6af03b71eecf',
  'Polaroid Now+ Instant Camera + Film',
  'photography',
  'Polaroid Now+ with Bluetooth app for creative filters and double exposures. Comes with 2 packs of color film (16 shots total). Retro vibes, real prints. Great for parties and events.',
  30.00, NULL, 'live',
  ST_SetSRID(ST_MakePoint(34.7610, 32.0595), 4326)::geography,
  'Neve Tzedek',
  ARRAY['polaroid','instant','photography','vintage','film'],
  ARRAY['https://images.pexels.com/photos/821652/pexels-photo-821652.jpeg?auto=compress&w=800']
);

-- ── STEP 4: Verify — shows all live items with owner and distance from center ─

SELECT
  p.full_name  AS owner,
  i.title,
  i.city,
  i.daily_price,
  round(ST_Distance(
    i.location,
    ST_SetSRID(ST_MakePoint(34.7818, 32.0853), 4326)::geography
  )::numeric / 1000, 1) AS dist_km_from_center
FROM public.items i
JOIN public.profiles p ON p.id = i.owner_id
WHERE i.verification_status = 'live'
ORDER BY dist_km_from_center ASC NULLS LAST;
