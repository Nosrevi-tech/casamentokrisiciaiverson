import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  // Configurar CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Simple authentication check
    const authHeader = req.headers.get('authorization');
    if (!authHeader || authHeader !== 'Bearer admin-casamento2026') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get Netlify Blobs store
    const store = getStore('wedding-rsvp');
    
    // Get all RSVPs
    let rsvpList = [];
    try {
      const data = await store.get('rsvp-list');
      if (data) {
        rsvpList = JSON.parse(data);
      }
    } catch (error) {
      console.log('No RSVP data found');
    }

    // Sort by submission date (newest first)
    rsvpList.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    return new Response(JSON.stringify({ 
      success: true, 
      data: rsvpList,
      count: rsvpList.length 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};