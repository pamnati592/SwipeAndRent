import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { chatBus } from '../services/chatBus';

export function useUnreadCount(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let userId: string | null = null;
    let mounted = true;

    async function fetchCount() {
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        userId = user.id;
      }

      const { data } = await supabase
        .from('conversations')
        .select('renter_id, lender_id, last_message_at, renter_last_read_at, lender_last_read_at')
        .or(`renter_id.eq.${userId},lender_id.eq.${userId}`)
        .not('last_message_at', 'is', null);

      if (!mounted || !data) return;

      const unread = data.filter((c) => {
        const isRenter = c.renter_id === userId;
        const myLastRead = isRenter ? c.renter_last_read_at : c.lender_last_read_at;
        if (!myLastRead) return true;
        return new Date(c.last_message_at) > new Date(myLastRead);
      }).length;

      setCount(unread);
    }

    fetchCount();

    const unsubBus = chatBus.subscribe(fetchCount);

    const channel = supabase
      .channel('unread-count-watch')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, fetchCount)
      .subscribe();

    return () => {
      mounted = false;
      unsubBus();
      channel.unsubscribe();
    };
  }, []);

  return count;
}
