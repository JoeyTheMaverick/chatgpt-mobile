import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 8)); // Don't log full key!

    const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error('Supabase error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { user_id, title } = body;

        if(!user_id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("conversations")
            .insert([{ user_id, title: title || 'New Conversation' }])
            .select()
            .single();
        
        if (error) {
            console.error("Error inserting conversation:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
}