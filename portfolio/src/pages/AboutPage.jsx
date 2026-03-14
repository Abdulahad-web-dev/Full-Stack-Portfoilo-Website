import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import About from '../components/About';

const AboutPage = () => {
    const [bio, setBio] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            const { data, error } = await supabase
                .from('settings')
                .select('bio, profile_image_url')
                .eq('id', 1)
                .single();

            if (data && !error) {
                setBio(data.bio);
                setProfileImageUrl(data.profile_image_url);
            }
        };
        fetchSettings();
    }, []);

    return <About bio={bio} profileImageUrl={profileImageUrl} />;
};

export default AboutPage;
