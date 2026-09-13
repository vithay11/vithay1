exports.handler = async (event, context) => {
  // Cấu hình CORS để trang web tải dữ liệu không bị chặn
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    // 1. Thông tin kết nối Airtable của bạn
    const AIRTABLE_API_KEY = "pat0mNUzHcQAZGfgC.5f789bbda206b872abf9bdc7480180d04449e4c31e1684ec57bb9ba3c4259f02";
    const AIRTABLE_BASE_ID = "apphLkS11JfGCY1v4";

    // 2. Gọi API Airtable lấy danh sách từ vựng từ bảng Vocabulary
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Vocabulary`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${AIRTABLE_API_KEY}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Lỗi Airtable: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // 3. Trích xuất đúng các trường thông tin (Word, Meaning, Date)
    const words = data.records.map(record => ({
      id: record.id,
      word: record.fields.Word || "",
      meaning: record.fields.Meaning || "",
      date: record.fields.Date || ""
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(words)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
