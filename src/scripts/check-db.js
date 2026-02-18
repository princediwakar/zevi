const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_KEY
);

async function main() {
  // Get lessons for Introduction to PM Interviews and CIRCLES Framework units
  const { data: units } = await supabase
    .from('units')
    .select('id, name, order_index')
    .or('name.like.%Introduction to PM Interviews%,name.like.%The CIRCLES Framework%')
    .order('order_index');

  ;
  ;

  if (units) {
    const unitIds = units.map(u => u.id);
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, name, order_index, unit_id')
      .in('unit_id', unitIds)
      .order('order_index');

    ;
    lessons.forEach(l => {
      const unit = units.find(u => u.id === l.unit_id);
      ;
    });
  }
}

main();
