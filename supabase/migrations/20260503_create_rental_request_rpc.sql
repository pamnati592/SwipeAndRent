-- Atomic rental request: find-or-create conversation + insert transaction + insert message.
-- If any step fails, the entire operation rolls back.
create or replace function public.create_rental_request(
  p_item_id        uuid,
  p_lender_id      uuid,
  p_start_date     date,
  p_end_date       date,
  p_total_price    numeric,
  p_message        text
)
returns json
language plpgsql
security definer
as $$
declare
  v_renter_id       uuid := auth.uid();
  v_conversation_id uuid;
  v_transaction_id  uuid;
  v_lender_name     text;
begin
  -- Caller must be authenticated
  if v_renter_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Caller cannot rent their own item
  if v_renter_id = p_lender_id then
    raise exception 'You cannot rent your own item';
  end if;

  -- Find existing conversation or create a new one
  select id into v_conversation_id
  from public.conversations
  where item_id  = p_item_id
    and renter_id = v_renter_id
    and lender_id = p_lender_id;

  if v_conversation_id is null then
    insert into public.conversations (item_id, renter_id, lender_id)
    values (p_item_id, v_renter_id, p_lender_id)
    returning id into v_conversation_id;
  end if;

  -- Insert the transaction record and capture its ID
  insert into public.transactions (
    renter_id, lender_id, item_id,
    start_date, end_date, total_price,
    status, conversation_id
  ) values (
    v_renter_id, p_lender_id, p_item_id,
    p_start_date, p_end_date, p_total_price,
    'pending', v_conversation_id
  )
  returning id into v_transaction_id;

  -- Insert the system message linked to this specific transaction
  insert into public.messages (conversation_id, sender_id, content, transaction_id)
  values (v_conversation_id, v_renter_id, p_message, v_transaction_id);

  -- Keep conversation metadata in sync so ChatsScreen shows the preview and unread badge
  update public.conversations
  set last_message = p_message, last_message_at = now()
  where id = v_conversation_id;

  -- Return what the client needs to navigate to the chat screen
  select full_name into v_lender_name
  from public.profiles
  where id = p_lender_id;

  return json_build_object(
    'conversation_id', v_conversation_id,
    'lender_name',     coalesce(v_lender_name, 'Lender')
  );
end;
$$;
