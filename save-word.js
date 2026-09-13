exports.handler = async (event, context) => {
  // Chỉ nhận request dạng POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // 1. Nhận dữ liệu từ Extension
    const { word, meaning } = JSON.parse(event.body);

    // 2. Gửi dữ liệu lưu vào Airtable (hoặc Google Sheet API / Supabase)
    const AIRTABLE_API_KEY = "patXXXXXX"; // Key API của bạn
    const AIRTABLE_BASE_ID = "appXXXXXX"; // ID bảng của bạn

    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Vocabulary`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              "Word": word,
              "Meaning": meaning,
              "Date": new Date().toISOString()
            }
          }
        ]
      })
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ message: "Lưu thành công!" })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
