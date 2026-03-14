const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase URL loaded:", supabaseUrl ? "YES" : "NO");
console.log("Supabase Key loaded:", supabaseKey ? "YES" : "NO");

if (!supabaseUrl || !supabaseKey) {
    console.error("Error: Missing Supabase credentials in .env file.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const projects = [
    {
        title: "Medical Store Management System",
        description: "A comprehensive web application for managing inventory, sales, and operations in a medical store environment.",
        demo: "https://abdulahadwarraichweb-debug.github.io/Medical-Store-Managment-System/",
        tags: ["HTML", "CSS", "JavaScript"],
        color: "#10B981",
        order: 1
    },
    {
        title: "Amazon Clone",
        description: "A functional front-end clone of the Amazon e-commerce platform featuring responsive design and product listings.",
        demo: "https://abdulahadwarraichweb-debug.github.io/Amazon---clone/",
        tags: ["HTML", "CSS", "JavaScript", "E-commerce"],
        color: "#F59E0B",
        order: 2
    }
];

async function addProjects() {
    console.log("Pushing projects to Supabase...");
    try {
        const { data, error } = await supabase.from('projects').upsert(projects, { onConflict: 'title' });

        if (error) {
            console.error("Supabase Error:", error.message);
        } else {
            console.log("✅ Successfully added/updated both projects!");
        }
    } catch (e) {
        console.error("Unexpected error:", e);
    }
}

addProjects();
