const { _paymentWithVnpay } = require("../services/order.service"); // Đường dẫn tới file chứa hàm
const readline = require("readline");

// Tạo interface nhập liệu từ người dùng
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getInput = (question) => {
  return new Promise((resolve) => rl.question(question, resolve));
};

const mockReq = {
  headers: {
    "x-forwarded-for": "127.0.0.1",
  },
  connection: {
    remoteAddress: "127.0.0.1",
  },
};

(async () => {
  try {
    console.log("Vui lòng nhập thông tin để test hàm _paymentWithVnpay:");

    // Lấy thông tin từ người dùng
    const total_amount = parseFloat(await getInput("Nhập số tiền thanh toán (VND): "));
    const customer_id = await getInput("Nhập mã khách hàng: ");
    const bankCode = await getInput("Nhập mã ngân hàng (nếu không có thì để trống): ");

    // Gọi hàm với đầu vào do người dùng cung cấp
    const paymentUrl = await _paymentWithVnpay({
      total_amount,
      customer_id,
      req: mockReq, // Dữ liệu giả lập request
      bankCode,
    });

    console.log("URL thanh toán được tạo:", paymentUrl);
  } catch (error) {
    console.error("Đã xảy ra lỗi khi test hàm:", error.message);
  } finally {
    rl.close();
  }
})();
