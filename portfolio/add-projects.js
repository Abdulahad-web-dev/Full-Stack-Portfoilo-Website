import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://spgbnjpwwghdbfcrvuml.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey || supabaseKey === 'your-anon-key-here') {
    console.error("Error: Please add your actual Supabase ANON KEY to the .env file first.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addProjects() {
    console.log("Adding your projects to Supabase...");

    const projects = [
        {
            title: "Medical Store Management System",
            description: "A comprehensive management system for pharmacies and medical stores to track inventory, sales, and supplies.",
            demo: "https://abdulahadwarraichweb-debug.github.io/Medical-Store-Managment-System/",
            tags: ["HTML", "CSS", "JavaScript", "Management"],
            color: "#10B981",
            order: 1
        },
        {
            title: "Amazon Clone",
            description: "A high-fidelity Amazon clone featuring product search, categories, and a responsive shopping experience.",
            demo: "https://abdulahadwarraichweb-debug.github.io/Amazon---clone/",
            tags: ["React", "Tailwind CSS", "E-commerce"],
            color: "#F59E0B",
            order: 2
        }
    ];

    try {
        const { data, error } = await supabase.from('projects').insert(projects);

        if (error) {
            console.error("Supabase Error adding projects:", error.message);
        } else {
            console.log("✅ Successfully added both projects!");
        }
    } catch (e) {
        console.error("Unexpected error:", e);
    }
}

addProjects();
