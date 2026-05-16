import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { baseId, tableName } = await req.json();
    const apiKey = Deno.env.get("AIRTABLE_API_KEY");
    if (!apiKey) {
      return Response.json({ error: 'AIRTABLE_API_KEY not configured' }, { status: 500 });
    }

    // Fetch all records with pagination
    let allRecords = [];
    let offset = null;

    do {
      const url = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`);
      if (offset) url.searchParams.set('offset', offset);
      url.searchParams.set('pageSize', '100');

      const response = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        return Response.json({ error: errorData.error?.message || 'Airtable API error', details: errorData }, { status: response.status });
      }

      const data = await response.json();
      allRecords.push(...data.records);
      offset = data.offset || null;
    } while (offset);

    return Response.json({ 
      success: true, 
      count: allRecords.length, 
      records: allRecords.map(r => ({ id: r.id, fields: r.fields }))
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});