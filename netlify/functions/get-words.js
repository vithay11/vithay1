exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    // THAY TOKEN MỚI VÀO ĐÂY:
    const AIRTABLE_API_KEY = "pat2TJXzi0ZeWigYq.6a91262dea0f761b6566f8d04b3f940e43e7017f15a91a0d4711bb0ff9f8a36f";
    const AIRTABLE_BASE_ID = "apphLkS11JfGCY1v4";
    const TABLE_NAME = "Vocabulary";

    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}`, {
      headers: { "Authorization": `Bearer ${AIRTABLE_API_KEY}` }
    });

    const data = await res.json();

    // Nếu vẫn lỗi thì hiện chi tiết để kiểm tra
    if (!res.ok) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ "Lỗi_Từ_Airtable": data })
      };
    }

    // Chuyển đổi dữ liệu bảng
    const words = (data.records || []).map(record => ({
      word: record.fields.Word || "",
      meaning: record.fields.Meaning || "",
      date: record.fields.Date || record.fields["Date Added"] || ""
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(words)
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
