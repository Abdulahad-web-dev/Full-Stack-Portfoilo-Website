import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import { Trash2 } from 'lucide-react';

const MessagesAdmin = () => {
    const { data: messages, loading, refetch } = useSupabaseQuery('messages', {
        order: { column: 'created_at', ascending: false }
    });

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this message?')) return;
        const { error } = await supabase.from('messages').delete().eq('id', id);
        if (!error) refetch();
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Contact Messages</h2>

            {loading ? (
                <div className="flex justify-center p-10"><div className="w-8 h-8 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div></div>
            ) : messages.length === 0 ? (
                <div className="text-center p-10 text-[#8B8BAA] bg-[#12121A]/80 rounded-2xl border border-[#8B5CF6]/20">
                    No messages received yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className="bg-[#12121A]/80 border border-[#8B5CF6]/20 rounded-2xl p-6 relative group">
                            <button
                                onClick={() => handleDelete(msg.id)}
                                className="absolute top-6 right-6 p-2 bg-[#EF4444]/10 text-[#EF4444] rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-[#EF4444]/20"
                                title="Delete message"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="flex flex-col sm:flex-row gap-4 sm:items-start justify-between mb-4 pr-12">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{msg.name}</h3>
                                    <a href={`mailto:${msg.email}`} className="text-sm text-[#06B6D4] hover:underline">{msg.email}</a>
                                </div>
                                <div className="text-xs text-[#6B6B8A] whitespace-nowrap">
                                    {new Date(msg.created_at).toLocaleString()}
                                </div>
                            </div>

                            <p className="text-[#E0E0E0] whitespace-pre-wrap leading-relaxed text-sm bg-black/20 p-4 rounded-xl border border-white/5">
                                {msg.message}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MessagesAdmin;
