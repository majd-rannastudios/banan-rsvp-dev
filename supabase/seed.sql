-- Dev-only sample data. Never run against production.
insert into events (name, starts_on, ends_on, venue_name, hero_copy_en, hero_copy_ar)
values (
  'Banan Inauguration',
  '2026-09-18',
  '2026-09-19',
  null,
  'An evening to unveil Riyadh''s newest landmark in elevated living.',
  'أمسية للكشف عن أحدث معالم الرياض في الحياة الراقية.'
)
returning id;

-- Run the slot inserts below with the returned event id substituted.
-- insert into event_slots (event_id, slot_date, starts_at, label_en, label_ar, sort_order) values
--   ('<event_id>', '2026-09-18', '2026-09-18T18:00:00+03', 'Fri 18 Sep · 6:00 PM', 'الجمعة ١٨ سبتمبر · ٦:٠٠ م', 1),
--   ('<event_id>', '2026-09-18', '2026-09-18T20:30:00+03', 'Fri 18 Sep · 8:30 PM', 'الجمعة ١٨ سبتمبر · ٨:٣٠ م', 2),
--   ('<event_id>', '2026-09-19', '2026-09-19T18:00:00+03', 'Sat 19 Sep · 6:00 PM', 'السبت ١٩ سبتمبر · ٦:٠٠ م', 3),
--   ('<event_id>', '2026-09-19', '2026-09-19T20:30:00+03', 'Sat 19 Sep · 8:30 PM', 'السبت ١٩ سبتمبر · ٨:٣٠ م', 4);

-- insert into guests (full_name, mobile, email, nationality, party_size, language_pref)
-- values ('Demo Guest', '+966500000000', 'demo@example.com', 'Saudi Arabia', 2, 'en')
-- returning invite_token;
