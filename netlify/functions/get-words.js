const https = require('https');

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };

  // Xử lý kiểm tra CORS
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const AIRTABLE_API_KEY = "pat0mNUzHcQAZGfgC.5f789bbda206b872abf9bdc7480180d04449e4c31e1684ec57bb9ba3c4259f02";
  const AIRTABLE_BASE_ID = "apphLkS11JfGCY1v4";
  const TABLE_NAME = "Vocabulary";

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.airtable.com',
      path: `/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          
          if (parsed && Array.isArray(parsed.records)) {
            const words = parsed.records.map(record => ({
              word: record.fields.Word || "",
              meaning: record.fields.Meaning || "",
              date: record.fields.Date || record.fields["Date Added"] || ""
            }));

            resolve({
              statusCode: 200,
              headers,
              body: JSON.stringify(words)
            });
          } else {
            resolve({
              statusCode: 200,
              headers,
              body: JSON.stringify([])
            });
          }
        } catch (e) {
          resolve({
            statusCode: 200,
            headers,
            body: JSON.stringify([])
          });
        }
      });
    });

    req.on('error', () => {
      resolve({
        statusCode: 200,
        headers,
        body: JSON.stringify([])
      });
    });

    req.end();
  });
};
