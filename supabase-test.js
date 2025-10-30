import { createClient } from '@supabase/supabase-js';

const url = "https://novbuvwpjnxwwvdekjhr.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmJ1dndwam54d3d2ZGVramhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODkxODUsImV4cCI6MjA3Njc2NTE4NX0.1UUkdGafh6ZplAX8hi7Bvj94D2gvFQZUl0an1RvcSA0";

const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase.from("test").select("*").limit(1);
  if (error) console.error("❌ Connection failed:", error.message);
  else console.log("✅ Connection OK:", data);
}

test();
