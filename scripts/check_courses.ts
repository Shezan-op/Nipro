import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://etwdqpgoavedstnxmnpj.supabase.co';
const supabaseKey = 'sb_publishable_v0-AcF5rAmplA1aw-jNMqg_t31LRfCs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: courses, error } = await supabase.from('courses').select('id, name, price, long_description');
  if (error) {
    console.error(error);
    process.exit(1);
  }
  console.log(JSON.stringify(courses, null, 2));
}

main();
