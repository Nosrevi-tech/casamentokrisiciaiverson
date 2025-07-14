import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  // Configurar CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Parse request body
    const rsvpData = await req.json();
    
    // Validate required fields
    if (!rsvpData.name || !rsvpData.email || !rsvpData.phone || !rsvpData.attending) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get Netlify Blobs store
    const store = getStore('wedding-rsvp');
    
    // Create RSVP entry with unique ID and timestamp
    const rsvpEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: rsvpData.name,
      email: rsvpData.email,
      phone: rsvpData.phone,
      attending: rsvpData.attending,
      message: rsvpData.message || '',
      submittedAt: new Date().toISOString(),
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown'
    };

    // Get existing RSVPs
    let existingRSVPs = [];
    try {
      const existingData = await store.get('rsvp-list');
      if (existingData) {
        existingRSVPs = JSON.parse(existingData);
      }
    } catch (error) {
      console.log('No existing RSVP data found, starting fresh');
    }

    // Add new RSVP to the list
    existingRSVPs.push(rsvpEntry);

    // Save updated list back to Netlify Blobs
    await store.set('rsvp-list', JSON.stringify(existingRSVPs));

    // Also save individual entry for backup
    await store.set(`rsvp-${rsvpEntry.id}`, JSON.stringify(rsvpEntry));

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'RSVP saved successfully',
      id: rsvpEntry.id 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error saving RSVP:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};