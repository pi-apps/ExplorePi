-- ============================================================
-- ExplorePi Quantum Network — Database Init
-- 01_schema.sql  (runs automatically on first container start)
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ── Core tables ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username    VARCHAR(64) UNIQUE NOT NULL,
    email       VARCHAR(128) UNIQUE NOT NULL,
    language_code VARCHAR(10) REFERENCES speaking_languages(code),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       TEXT NOT NULL,
    description TEXT,
    owner_id    UUID REFERENCES users(id),
    lang_code   VARCHAR(10) REFERENCES speaking_languages(code),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Quantum Network nodes ──────────────────────────────────

CREATE TABLE IF NOT EXISTS quantum_nodes (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_name   VARCHAR(128) NOT NULL,
    region      VARCHAR(64),
    status      VARCHAR(16) DEFAULT 'active' CHECK (status IN ('active','inactive','syncing')),
    ip_address  INET,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── All World Speaking Languages ──────────────────────────

CREATE TABLE IF NOT EXISTS speaking_languages (
    code        VARCHAR(10) PRIMARY KEY,   -- ISO 639-1/2 code
    name_en     TEXT NOT NULL,             -- English name
    name_native TEXT NOT NULL,             -- Native name
    family      TEXT,                      -- Language family
    region      TEXT,                      -- Primary region
    speakers_m  NUMERIC(8,1),             -- Approx. speakers in millions
    script      TEXT,                      -- Writing script
    rtl         BOOLEAN DEFAULT FALSE      -- Right-to-left
);

-- ── Seed: Complete World Languages ────────────────────────
-- 100+ languages covering all major speaking populations

INSERT INTO speaking_languages (code, name_en, name_native, family, region, speakers_m, script, rtl) VALUES
-- Indo-European: Romance
('pt',    'Portuguese',         'Português',            'Indo-European/Romance',    'South America/Europe',  263.0, 'Latin',    FALSE),
('es',    'Spanish',            'Español',              'Indo-European/Romance',    'Americas/Europe',       485.0, 'Latin',    FALSE),
('fr',    'French',             'Français',             'Indo-European/Romance',    'Europe/Africa',         280.0, 'Latin',    FALSE),
('it',    'Italian',            'Italiano',             'Indo-European/Romance',    'Europe',                 67.0, 'Latin',    FALSE),
('ro',    'Romanian',           'Română',               'Indo-European/Romance',    'Europe',                 24.0, 'Latin',    FALSE),
('ca',    'Catalan',            'Català',               'Indo-European/Romance',    'Europe',                  4.1, 'Latin',    FALSE),
-- Indo-European: Germanic
('en',    'English',            'English',              'Indo-European/Germanic',   'Global',               1456.0, 'Latin',    FALSE),
('de',    'German',             'Deutsch',              'Indo-European/Germanic',   'Europe',                 132.0, 'Latin',    FALSE),
('nl',    'Dutch',              'Nederlands',           'Indo-European/Germanic',   'Europe',                  30.0, 'Latin',    FALSE),
('sv',    'Swedish',            'Svenska',              'Indo-European/Germanic',   'Europe',                  13.9, 'Latin',    FALSE),
('no',    'Norwegian',          'Norsk',                'Indo-European/Germanic',   'Europe',                   5.3, 'Latin',    FALSE),
('da',    'Danish',             'Dansk',                'Indo-European/Germanic',   'Europe',                   6.0, 'Latin',    FALSE),
('af',    'Afrikaans',          'Afrikaans',            'Indo-European/Germanic',   'Africa',                   7.2, 'Latin',    FALSE),
('yi',    'Yiddish',            'ייִדיש',               'Indo-European/Germanic',   'Global',                   1.5, 'Hebrew',   TRUE),
-- Indo-European: Slavic
('ru',    'Russian',            'Русский',              'Indo-European/Slavic',     'Europe/Asia',            154.0, 'Cyrillic', FALSE),
('uk',    'Ukrainian',          'Українська',           'Indo-European/Slavic',     'Europe',                  40.0, 'Cyrillic', FALSE),
('pl',    'Polish',             'Polski',               'Indo-European/Slavic',     'Europe',                  45.0, 'Latin',    FALSE),
('cs',    'Czech',              'Čeština',              'Indo-European/Slavic',     'Europe',                  10.7, 'Latin',    FALSE),
('sk',    'Slovak',             'Slovenčina',           'Indo-European/Slavic',     'Europe',                   5.2, 'Latin',    FALSE),
('bg',    'Bulgarian',          'Български',            'Indo-European/Slavic',     'Europe',                   8.0, 'Cyrillic', FALSE),
('sr',    'Serbian',            'Српски',               'Indo-European/Slavic',     'Europe',                  12.0, 'Cyrillic', FALSE),
('hr',    'Croatian',           'Hrvatski',             'Indo-European/Slavic',     'Europe',                   5.6, 'Latin',    FALSE),
('be',    'Belarusian',         'Беларуская',           'Indo-European/Slavic',     'Europe',                   5.1, 'Cyrillic', FALSE),
-- Indo-European: Indo-Iranian
('hi',    'Hindi',              'हिन्दी',               'Indo-European/Indo-Iranian','Asia',                  602.0, 'Devanagari',FALSE),
('ur',    'Urdu',               'اردو',                 'Indo-European/Indo-Iranian','Asia',                  231.0, 'Nastaliq', TRUE),
('bn',    'Bengali',            'বাংলা',                'Indo-European/Indo-Iranian','Asia',                  272.0, 'Bengali',  FALSE),
('pa',    'Punjabi',            'ਪੰਜਾਬੀ',               'Indo-European/Indo-Iranian','Asia',                  113.0, 'Gurmukhi', FALSE),
('gu',    'Gujarati',           'ગુજરાતી',              'Indo-European/Indo-Iranian','Asia',                   57.0, 'Gujarati', FALSE),
('mr',    'Marathi',            'मराठी',                'Indo-European/Indo-Iranian','Asia',                   99.0, 'Devanagari',FALSE),
('ne',    'Nepali',             'नेपाली',               'Indo-European/Indo-Iranian','Asia',                   17.0, 'Devanagari',FALSE),
('si',    'Sinhala',            'සිංහල',                'Indo-European/Indo-Iranian','Asia',                   17.0, 'Sinhala',  FALSE),
('fa',    'Persian (Farsi)',    'فارسی',                'Indo-European/Indo-Iranian','Asia',                   77.0, 'Arabic',   TRUE),
('ps',    'Pashto',             'پښتو',                 'Indo-European/Indo-Iranian','Asia',                   40.0, 'Arabic',   TRUE),
-- Indo-European: Other
('el',    'Greek',              'Ελληνικά',             'Indo-European/Hellenic',   'Europe',                  13.5, 'Greek',    FALSE),
('hy',    'Armenian',           'Հայերեն',              'Indo-European/Armenian',   'Asia',                     6.7, 'Armenian', FALSE),
-- Sino-Tibetan
('zh',    'Mandarin Chinese',   '普通话',               'Sino-Tibetan',             'Asia',                   920.0, 'Hanzi',    FALSE),
('yue',   'Cantonese',          '廣東話',               'Sino-Tibetan',             'Asia',                    85.0, 'Hanzi',    FALSE),
('wuu',   'Wu Chinese',         '吴语',                 'Sino-Tibetan',             'Asia',                    81.0, 'Hanzi',    FALSE),
('bo',    'Tibetan',            'བོད་སྐད།',             'Sino-Tibetan',             'Asia',                     6.0, 'Tibetan',  FALSE),
('my',    'Burmese',            'မြန်မာဘာသာ',           'Sino-Tibetan',             'Asia',                    33.0, 'Myanmar',  FALSE),
-- Afro-Asiatic: Semitic
('ar',    'Arabic',             'العربية',              'Afro-Asiatic/Semitic',     'MENA',                  274.0, 'Arabic',   TRUE),
('he',    'Hebrew',             'עברית',                'Afro-Asiatic/Semitic',     'Middle East',              9.0, 'Hebrew',   TRUE),
('am',    'Amharic',            'አማርኛ',                'Afro-Asiatic/Semitic',     'Africa',                  22.0, 'Ethiopic', FALSE),
('so',    'Somali',             'Soomaali',             'Afro-Asiatic/Cushitic',    'Africa',                  21.8, 'Latin',    FALSE),
('ha',    'Hausa',              'Hausa',                'Afro-Asiatic/Chadic',      'Africa',                  77.0, 'Latin',    FALSE),
-- Turkic
('tr',    'Turkish',            'Türkçe',               'Turkic',                   'Europe/Asia',             88.0, 'Latin',    FALSE),
('az',    'Azerbaijani',        'Azərbaycan dili',      'Turkic',                   'Asia',                    23.0, 'Latin',    FALSE),
('uz',    'Uzbek',              'Oʻzbek tili',          'Turkic',                   'Asia',                    44.0, 'Latin',    FALSE),
('kk',    'Kazakh',             'Қазақ тілі',           'Turkic',                   'Asia',                    13.0, 'Cyrillic', FALSE),
('ky',    'Kyrgyz',             'Кыргыз тили',          'Turkic',                   'Asia',                     4.5, 'Cyrillic', FALSE),
('tk',    'Turkmen',            'Türkmençe',            'Turkic',                   'Asia',                     7.0, 'Latin',    FALSE),
('ug',    'Uyghur',             'ئۇيغۇرچە',             'Turkic',                   'Asia',                    10.0, 'Arabic',   TRUE),
-- Dravidian
('ta',    'Tamil',              'தமிழ்',                'Dravidian',                'Asia',                    86.0, 'Tamil',    FALSE),
('te',    'Telugu',             'తెలుగు',               'Dravidian',                'Asia',                    96.0, 'Telugu',   FALSE),
('kn',    'Kannada',            'ಕನ್ನಡ',                'Dravidian',                'Asia',                    59.0, 'Kannada',  FALSE),
('ml',    'Malayalam',          'മലയാളം',               'Dravidian',                'Asia',                    37.0, 'Malayalam',FALSE),
-- Austronesian
('id',    'Indonesian',         'Bahasa Indonesia',     'Austronesian',             'Asia',                   199.0, 'Latin',    FALSE),
('ms',    'Malay',              'Bahasa Melayu',        'Austronesian',             'Asia',                    33.0, 'Latin',    FALSE),
('tl',    'Filipino (Tagalog)', 'Filipino',             'Austronesian',             'Asia',                    45.0, 'Latin',    FALSE),
('jv',    'Javanese',           'Basa Jawa',            'Austronesian',             'Asia',                    68.0, 'Latin',    FALSE),
('su',    'Sundanese',          'Basa Sunda',           'Austronesian',             'Asia',                    32.0, 'Latin',    FALSE),
('mg',    'Malagasy',           'Malagasy',             'Austronesian',             'Africa',                  25.0, 'Latin',    FALSE),
-- Koreanic / Japonic
('ko',    'Korean',             '한국어',               'Koreanic',                 'Asia',                    81.7, 'Hangul',   FALSE),
('ja',    'Japanese',           '日本語',               'Japonic',                  'Asia',                   125.0, 'Kanji/Kana',FALSE),
-- Tai-Kadai
('th',    'Thai',               'ภาษาไทย',              'Tai-Kadai',                'Asia',                    60.0, 'Thai',     FALSE),
('lo',    'Lao',                'ພາສາລາວ',              'Tai-Kadai',                'Asia',                     7.0, 'Lao',      FALSE),
-- Hmong-Mien
('hmn',   'Hmong',              'Hmoob',                'Hmong-Mien',               'Asia',                     4.0, 'Latin',    FALSE),
-- Mongolic
('mn',    'Mongolian',          'Монгол хэл',           'Mongolic',                 'Asia',                     5.2, 'Cyrillic', FALSE),
-- Kartvelian
('ka',    'Georgian',           'ქართული',              'Kartvelian',               'Asia',                     3.7, 'Georgian', FALSE),
-- Uralic
('fi',    'Finnish',            'Suomi',                'Uralic/Finnic',            'Europe',                   5.0, 'Latin',    FALSE),
('et',    'Estonian',           'Eesti',                'Uralic/Finnic',            'Europe',                   1.1, 'Latin',    FALSE),
('hu',    'Hungarian',          'Magyar',               'Uralic/Ugric',             'Europe',                  13.0, 'Latin',    FALSE),
-- Niger-Congo
('sw',    'Swahili',            'Kiswahili',            'Niger-Congo/Bantu',        'Africa',                  71.0, 'Latin',    FALSE),
('yo',    'Yoruba',             'Yorùbá',               'Niger-Congo/Volta-Niger',  'Africa',                  45.0, 'Latin',    FALSE),
('ig',    'Igbo',               'Asụsụ Igbo',           'Niger-Congo/Volta-Niger',  'Africa',                  30.0, 'Latin',    FALSE),
('zu',    'Zulu',               'isiZulu',              'Niger-Congo/Bantu',        'Africa',                  12.0, 'Latin',    FALSE),
('xh',    'Xhosa',              'isiXhosa',             'Niger-Congo/Bantu',        'Africa',                   8.2, 'Latin',    FALSE),
('sn',    'Shona',              'chiShona',             'Niger-Congo/Bantu',        'Africa',                  14.0, 'Latin',    FALSE),
('rw',    'Kinyarwanda',        'Ikinyarwanda',         'Niger-Congo/Bantu',        'Africa',                  12.0, 'Latin',    FALSE),
('ny',    'Chichewa',           'Chichewa',             'Niger-Congo/Bantu',        'Africa',                  14.0, 'Latin',    FALSE),
('wo',    'Wolof',              'Wolof',                'Niger-Congo/Senegambian',  'Africa',                   5.4, 'Latin',    FALSE),
('ak',    'Akan',               'Akan',                 'Niger-Congo/Kwa',          'Africa',                  11.0, 'Latin',    FALSE),
-- Nilo-Saharan
('om',    'Oromo',              'Afaan Oromoo',         'Afro-Asiatic/Cushitic',    'Africa',                  37.0, 'Latin',    FALSE),
-- Baltic
('lt',    'Lithuanian',         'Lietuvių',             'Indo-European/Baltic',     'Europe',                   3.0, 'Latin',    FALSE),
('lv',    'Latvian',            'Latviešu',             'Indo-European/Baltic',     'Europe',                   1.7, 'Latin',    FALSE),
-- Celtic
('cy',    'Welsh',              'Cymraeg',              'Indo-European/Celtic',     'Europe',                   0.9, 'Latin',    FALSE),
('ga',    'Irish',              'Gaeilge',              'Indo-European/Celtic',     'Europe',                   1.2, 'Latin',    FALSE),
-- Creoles / Pidgins
('ht',    'Haitian Creole',     'Kreyòl ayisyen',       'Creole',                   'Americas',                12.0, 'Latin',    FALSE),
-- Sign Languages (representative)
('sgn',   'International Sign', 'International Sign',  'Sign Language',            'Global',                   0.5, 'Gestural', FALSE),
-- Other notable
('eu',    'Basque',             'Euskara',              'Language isolate',         'Europe',                   0.7, 'Latin',    FALSE),
('ky',    'Kyrgyz',             'Кыргыз тили',          'Turkic',                   'Asia',                     4.5, 'Cyrillic', FALSE),
('km',    'Khmer',              'ខ្មែរ',                'Austroasiatic',            'Asia',                    16.0, 'Khmer',    FALSE),
('vi',    'Vietnamese',         'Tiếng Việt',           'Austroasiatic/Mon-Khmer',  'Asia',                    85.0, 'Latin',    FALSE),
('sq',    'Albanian',           'Shqip',                'Indo-European',            'Europe',                   7.5, 'Latin',    FALSE),
('mk',    'Macedonian',         'Македонски',           'Indo-European/Slavic',     'Europe',                   2.0, 'Cyrillic', FALSE),
('sl',    'Slovenian',          'Slovenščina',          'Indo-European/Slavic',     'Europe',                   2.5, 'Latin',    FALSE),
('lb',    'Luxembourgish',      'Lëtzebuergesch',       'Indo-European/Germanic',   'Europe',                   0.4, 'Latin',    FALSE),
('mt',    'Maltese',            'Malti',                'Afro-Asiatic/Semitic',     'Europe',                   0.5, 'Latin',    FALSE),
('is',    'Icelandic',          'Íslenska',             'Indo-European/Germanic',   'Europe',                   0.4, 'Latin',    FALSE),
('fo',    'Faroese',            'Føroyskt',             'Indo-European/Germanic',   'Europe',                   0.07,'Latin',    FALSE),
('bs',    'Bosnian',            'Bosanski',             'Indo-European/Slavic',     'Europe',                   2.5, 'Latin',    FALSE),
('tg',    'Tajik',              'Тоҷикӣ',               'Indo-European/Indo-Iranian','Asia',                    8.0, 'Cyrillic', FALSE),
('tt',    'Tatar',              'Татар теле',           'Turkic',                   'Asia',                     5.3, 'Cyrillic', FALSE),
('ba',    'Bashkir',            'Башҡорт теле',         'Turkic',                   'Asia',                     1.4, 'Cyrillic', FALSE),
('cv',    'Chuvash',            'Чӑвашла',              'Turkic',                   'Asia',                     1.0, 'Cyrillic', FALSE),
('ce',    'Chechen',            'Нохчийн мотт',         'Northeast Caucasian',      'Asia',                     1.4, 'Cyrillic', FALSE),
('av',    'Avar',               'Авар мацӀ',            'Northeast Caucasian',      'Asia',                     0.7, 'Cyrillic', FALSE)
ON CONFLICT (code) DO NOTHING;

-- ── Indexes ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_lang_family   ON speaking_languages(family);
CREATE INDEX IF NOT EXISTS idx_lang_region   ON speaking_languages(region);
CREATE INDEX IF NOT EXISTS idx_lang_speakers ON speaking_languages(speakers_m DESC);
CREATE INDEX IF NOT EXISTS idx_projects_lang ON projects(lang_code);
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_qnode_status  ON quantum_nodes(status);
