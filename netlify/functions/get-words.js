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
    const AIRTABLE_API_KEY = "pat2TJXzi0ZeWigYq.5ee1c1ad12870ed5f451a03ac549c12d4189a1d4520aee3ce7c52a6e986be3e4";
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
