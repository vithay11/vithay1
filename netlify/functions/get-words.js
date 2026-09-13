exports.handler = async (event, context) => {
  console.log("--- Bắt đầu gọi hàm get-words ---");

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
    const AIRTABLE_API_KEY = "pat2TJXzi0ZeWigYq.5ee1c1ad12870ed5f451a03ac549c12d4189a1d4520aee3ce7c52a6e986be3e4";
    const AIRTABLE_BASE_ID = "apphLkS11JfGCY1v4";
    const TABLE_NAME = "Vocabulary";

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;
    console.log("Đang gọi Airtable URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    console.log("Trạng thái Airtable trả về:", response.status);

    if (!response.ok) {
      console.error("Airtable báo lỗi:", data);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: data.error || "Lỗi từ Airtable" })
      };
    }

    const words = (data.records || []).map(record => ({
      word: record.fields.Word || "",
      meaning: record.fields.Meaning || "",
      date: record.fields.Date || record.fields["Date Added"] || ""
    }));

    console.log("Lấy thành công số từ vựng:", words.length);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(words)
    };
  } catch (error) {
    console.error("Lỗi trong quá trình xử lý:", error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
