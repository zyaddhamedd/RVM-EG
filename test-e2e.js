const { createClient } = require('@supabase/supabase-js');
const { z } = require('zod');
const fs = require('fs');

// 1. Simulate reading .env.local
const env = fs.readFileSync('.env.local', 'utf-8').split('\n').reduce((acc, line) => {
  const [k, ...v] = line.split('=');
  if (k && v) acc[k.trim()] = v.join('=').trim();
  return acc;
}, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Simulate Zod schema exactly as in actions.ts
const schema = z.object({
  full_name: z.string().min(2).max(100),
  age: z.coerce.number().min(16).max(100),
  gender: z.enum(['male', 'female']),
  city: z.string().min(2).max(100),
  phone: z.string().min(10).max(20),
  email: z.string().email().max(100),
  instagram: z.string().url().or(z.string().min(2).startsWith('@').max(50)),
  tiktok: z.string().url().or(z.string().min(2).startsWith('@').max(50)),
  facebook: z.string().max(100).optional(),
  has_ugc_experience: z.coerce.boolean(),
  portfolio_url: z.string().max(200).optional(),
  preferred_niches: z.array(z.string()).min(1),
  languages: z.array(z.string()).min(1),
});

async function runE2E() {
  console.log('Running E2E Form Submission Test...');

  // 3. Simulated valid form data (with empty optional fields)
  const simulatedData = {
    full_name: 'Test Creator E2E',
    age: '24',
    gender: 'female',
    city: 'Dubai',
    phone: '+971501234567',
    email: 'test_e2e_user@example.com',
    instagram: '@test_creator',
    tiktok: '@test_creator',
    facebook: undefined, // Simulating empty string logic
    has_ugc_experience: true,
    portfolio_url: undefined, // Simulating empty string logic
    preferred_niches: ['Fashion', 'Beauty'],
    languages: ['English', 'Arabic']
  };

  try {
    // Phase 1: Validation
    console.log('1. Validating Zod Schema...');
    const validated = schema.parse(simulatedData);
    console.log('✅ Zod validation successful.');

    // Phase 2: DB Insert
    console.log('2. Inserting into Supabase...');
    const { error } = await supabase.from('creators').insert({
      full_name: validated.full_name,
      age: validated.age,
      gender: validated.gender,
      city: validated.city,
      phone: validated.phone,
      email: validated.email,
      instagram: validated.instagram,
      tiktok: validated.tiktok,
      facebook: validated.facebook || null,
      has_ugc_experience: validated.has_ugc_experience,
      portfolio_url: validated.portfolio_url || null,
      preferred_niches: validated.preferred_niches,
      languages: validated.languages,
    });

    if (error) {
      if (error.code === '23502') {
        console.log('✅ TEST FAILED AS EXPECTED (NOT NULL constraint). You MUST run the phase_2_simplify_creator_form.sql migration in your Supabase dashboard to allow missing equipment/availability/why_join.');
        console.log('Error details:', error.message);
      } else {
        console.error('❌ Unexpected DB Error:', error);
      }
    } else {
      console.log('✅ DB Insert successful. (This means the migration was already run or columns allow null!)');
    }

  } catch (err) {
    console.error('❌ Validation Failed:', JSON.stringify(err.errors || err, null, 2));
  }
}

runE2E();
