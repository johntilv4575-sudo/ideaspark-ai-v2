import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { baseId, tableName, records } = await req.json();

    if (!baseId || !tableName || !records || !Array.isArray(records)) {
      return Response.json({ error: 'Missing required fields: baseId, tableName, records (array)' }, { status: 400 });
    }

    const apiKey = Deno.env.get("AIRTABLE_API_KEY");
    if (!apiKey) {
      return Response.json({ error: 'AIRTABLE_API_KEY not configured' }, { status: 500 });
    }

    // Airtable API allows max 10 records per request, so we batch
    const createdIds = [];
    const batchSize = 10;

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize).map(record => ({
        fields: record
      }));

      const response = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ records: batch })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return Response.json({ error: errorData.error?.message || 'Airtable API error', details: errorData }, { status: response.status });
      }

      const data = await response.json();
      createdIds.push(...data.records.map(r => r.id));
    }

    return Response.json({ success: true, createdIds, count: createdIds.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});