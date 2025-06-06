import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
    const conversationId = req.nextUrl.searchParams.get('conversation_Id');
    if (!conversationId) {
        return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { conversation_id, content, role, model_used, is_image, image_url } = body;

        if (!conversation_id || !content || !role) {
            return NextResponse.json({ error: 'Conversation ID, content, and role are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('messages')
            .insert([{ conversation_id, content, role, model_used : model_used || null, is_image : is_image || false, image_url: image_url || null },])
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
}