require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Project = require('./models/Project');

const initialProjects = [
    {
        title: "Personal Portfolio Website",
        description: "A responsive developer portfolio built to showcase projects, skills, and experience with modern UI design and smooth 3D animations.",
        image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tags: ["React", "Tailwind CSS", "Framer Motion"],
        github: "#",
        demo: "#",
        color: "#8B5CF6",
        order: 1,
    },
    {
        title: "PDF Timetable Search System",
        description: "A web application that allows users to upload a PDF timetable and search for specific schedules directly inside the browser using text extraction.",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tags: ["HTML", "CSS", "JavaScript", "PDF.js"],
        github: "#",
        demo: "#",
        color: "#06B6D4",
        order: 2,
    },
    {
        title: "MongoDB Flight Data Analysis",
        description: "A database project using MongoDB aggregation pipelines to analyze airline flight data including delays, performance metrics, and statistics.",
        image: "https://images.unsplash.com/photo-1540575339264-569259ce8736?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tags: ["MongoDB", "Aggregation Pipelines"],
        github: "#",
        demo: "#",
        color: "#10B981",
        order: 3,
    },
    {
        title: "AI Jarvis Assistant",
        description: "An AI assistant inspired by Jarvis that interacts with users using voice commands and performs tasks conversationally with LLM integration.",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tags: ["Python", "AI APIs", "Speech Processing"],
        github: "#",
        demo: "#",
        color: "#F59E0B",
        order: 4,
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');

        // Clear existing data
        await Project.deleteMany({});
        await User.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Seed projects
        const projects = await Project.insertMany(initialProjects);
        console.log(`✅ Seeded ${projects.length} projects`);

        // Seed admin user
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const passwordHash = await bcrypt.hash(adminPassword, 12);

        const adminUser = new User({
            email: adminEmail,
            passwordHash,
            role: 'admin',
        });
        await adminUser.save();
        console.log(`✅ Admin user created: ${adminEmail} / ${adminPassword}`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`   Admin Email:    ${adminEmail}`);
        console.log(`   Admin Password: ${adminPassword}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
}

seed();
