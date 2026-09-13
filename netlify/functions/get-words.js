exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  };

  try {
    const AIRTABLE_API_KEY = "pat0mNUzHcQAZGfgC.5f789bbda206b872abf9bdc7480180d04449e4c31e1684ec57bb9ba3c4259f02";
    const AIRTABLE_BASE_ID = "apphLkS11JfGCY1v4";
    const TABLE_NAME = "Vocabulary";

    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}`, {
      headers: { "Authorization": `Bearer ${AIRTABLE_API_KEY}` }
    });

    const data = await res.json();

    // In thẳng phản hồi của Airtable lên trình duyệt để kiểm tra
    if (!res.ok) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ "Lỗi_Từ_Airtable": data }, null, 2)
      };
    }

    const words = (data.records || []).map(record => ({
      word: record.fields.Word || "",
      meaning: record.fields.Meaning || "",
      date: record.fields.Date || record.fields["Date Added"] || ""
    }));

    return { statusCode: 200, headers, body: JSON.stringify(words) };
  } catch (error) {
    return { statusCode: 200, headers, body: JSON.stringify({ error: error.message }) };
  }
};
