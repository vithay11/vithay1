exports.handler = async (event, context) => {
  // Cấu hình CORS để Extension không bị chặn
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: "Method Not Allowed" };
  }

  try {
    // 1. Nhận dữ liệu từ Extension
    const { word, meaning } = JSON.parse(event.body);

    // 2. Khai báo thông tin Airtable
    const AIRTABLE_API_KEY = "pat2TJXzi0ZeWigYq.6a91262dea0f761b6566f8d04b3f940e43e7017f15a91a0d4711bb0ff9f8a36f";
    const AIRTABLE_BASE_ID = "apphLkS11JfGCY1v4";

    // 3. Gọi API Airtable (Dùng đúng tên biến ở dòng 12 và 13)
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
      headers,
      body: JSON.stringify({ message: "Lưu thành công!" })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
