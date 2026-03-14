import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Generic hook for Supabase table queries.
 * @param {string} table - Table name
 * @param {object} options - { columns, order, filter, deps }
 */
export const useSupabaseQuery = (table, options = {}) => {
    const { columns = '*', order = null, filter = null, deps = [] } = options;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let query = supabase.from(table).select(columns);
            if (filter) query = filter(query);
            if (order) query = query.order(order.column, { ascending: order.ascending ?? true });
            const { data: result, error: err } = await query;
            if (err) throw err;
            setData(result || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [table, columns, ...deps]); // eslint-disable-line

    useEffect(() => { fetch(); }, [fetch]);

    return { data, loading, error, refetch: fetch };
};

/**
 * Hook for fetching a single row from a table by column value.
 */
export const useSupabaseSingle = (table, column, value) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetch = useCallback(async () => {
        if (!value) { setLoading(false); return; }
        setLoading(true);
        try {
            const { data: result, error: err } = await supabase
                .from(table)
                .select('*')
                .eq(column, value)
                .single();
            if (err && err.code !== 'PGRST116') throw err;
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [table, column, value]);

    useEffect(() => { fetch(); }, [fetch]);
    return { data, loading, error, refetch: fetch };
};

export default useSupabaseQuery;
