module.exports = [
    {
      files: ["**/*.js"],  // Kiểm tra tất cả các file .js trong mọi thư mục con
      rules: {
        "no-unused-vars": "warn",
        "no-console": ["error", { allow: ["warn", "error"] }],
      },
    },
  ];
  