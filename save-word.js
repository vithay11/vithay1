exports.handler = async (event, context) => {
  // Khai báo CORS headers cho phép Extension truy cập
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  // 1. Trả về thành công ngay nếu trình duyệt gửi yêu cầu kiểm tra (OPTIONS)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  // 2. Chỉ chấp nhận phương thức POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: "Method Not Allowed"
    };
  }

  try {
    const { word, meaning } = JSON.parse(event.body);
    console.log("Từ nhận được:", word, "->", meaning);

    // TODO: Viết logic lưu vào Database (Airtable / Supabase / Google Sheet) tại đây

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
