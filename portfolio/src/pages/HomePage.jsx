import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import EducationPage from './EducationPage';
import Contact from '../components/Contact';

const HomePage = () => {
    const [siteData, setSiteData] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .eq('id', 1)
                .single();

            if (data && !error) {
                setSiteData(data);
            }
        };
        fetchSettings();
    }, []);

    return (
        <>
            <Hero cvUrl={siteData?.cv_url} siteData={siteData} />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <EducationPage />
            <Contact />
        </>
    );
};

export default HomePage;
