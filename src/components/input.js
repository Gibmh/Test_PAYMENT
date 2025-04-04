import React, { useState } from "react";
import "./input.css";

const InputForm = ({ addProduct }) => {
  const [formData, setFormData] = useState({
    id_product: "",
    id_receipt: "",
    price: "",
    quantity: "",
    voucher: "", // Thêm trường voucher vào state
  });

  // Hàm cập nhật state khi nhập dữ liệu vào input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hàm xử lý khi submit form
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn trang reload khi submit

    // Kiểm tra dữ liệu có hợp lệ không
    if (
      !formData.id_product ||
      !formData.id_receipt ||
      formData.price === "" || // Kiểm tra price không rỗng (có thể là 0)
      !formData.quantity
    ) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Chuyển đổi giá trị nhập thành số hợp lệ
    const newProduct = {
      ...formData,
      price: parseFloat(formData.price), // Chuyển đổi price thành số
      quantity: parseInt(formData.quantity, 10),
      voucher: formData.voucher ? parseFloat(formData.voucher) : 0, // Chuyển voucher thành số (nếu có)
    };

    addProduct(newProduct); // Gửi dữ liệu lên component cha

    // Reset form sau khi thêm sản phẩm
    setFormData({
      id_product: "",
      id_receipt: "",
      price: "",
      quantity: "",
      voucher: "",
    });
  };

  return (
    <div className="input_bill">
      <div className="input_bill_container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="id_product">ID sách:</label>
            <input
              type="text"
              id="id_product"
              name="id_product"
              value={formData.id_product}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="id_receipt">ID hóa đơn:</label>
            <input
              type="text"
              id="id_receipt"
              name="id_receipt"
              value={formData.id_receipt}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Giá sách:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0" // Cho phép giá trị là 0
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Số lượng:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="voucher">Voucher (nếu có):</label>
            <input
              type="number"
              id="voucher"
              name="voucher"
              value={formData.voucher}
              onChange={handleChange}
              min="0"
            />
          </div>

          <button type="submit">Thêm sách</button>
        </form>
      </div>
    </div>
  );
};

export default InputForm;
