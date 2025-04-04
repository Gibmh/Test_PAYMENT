import React, { useState, useEffect } from "react";
import InputForm from "./components/input";
import Order from "./components/object";
import "./App.css";
require("dotenv").config();

const App = () => {
  const [products, setProducts] = useState([]);
  const [buttonOrder, setButtonOrder] = useState(true);
  const [buttonReceipt, setButtonReceipt] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // Trạng thái thanh toán
  const [invoices, setInvoices] = useState([]); // Đảm bảo invoices là một mảng rỗng khi khởi tạo

  const addProduct = (product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };
  const fetchInvoices = async () => {
    try {
      const response = await fetch(process.env.API_list); // API lấy danh sách hóa đơn
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setInvoices(result.data); // Lưu mảng data vào state invoices
        } else {
          console.error("Lỗi khi lấy danh sách hóa đơn.");
        }
      } else {
        console.error("Lỗi khi gọi API:", response.status);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    if (buttonReceipt) {
      fetchInvoices(); // Lấy hóa đơn khi người dùng vào trang "Quản lý hóa đơn"
    }
  }, [buttonReceipt]);
  useEffect(() => {
    if (buttonReceipt) {
      fetchInvoices(); // Lấy hóa đơn khi người dùng vào trang "Quản lý hóa đơn"
    }
  }, [buttonReceipt]);

  useEffect(() => {
    if (products.length > 0) {
      const updatedRequestData = {
        typeOb: "order",
        data: {
          receipt: {
            id_member: "12347654",
            method_payment: "Tiền mặt",
            id_receipt: products[0].id_receipt,
            voucher: products[0].voucher,
          },
          products: products,
        },
      };
      console.log("Data gửi:", updatedRequestData);
    }
  }, [products]);

  const handleDelete = (id_product) => {
    // Xóa sản phẩm khỏi danh sách bằng cách lọc sản phẩm không có ID trùng với id_product
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id_product !== id_product)
    );
  };
  const handlePayment = async () => {
    const requestData = {
      typeOb: "order",
      data: {
        receipt: {
          id_member: "12347654",
          method_payment: "Tiền mặt",
          id_receipt: products[0]?.id_receipt || "",
          voucher: products[0]?.voucher || 0,
        },
        order: products,
      },
    };

    try {
      const response = await fetch(process.env.API_create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setPaymentStatus("Thanh toán thành công!");

          // Reset lại danh sách sản phẩm và trạng thái sau khi thanh toán thành công
          setProducts([]); // Xóa danh sách sản phẩm
          setButtonOrder(true); // Quay lại trang tạo hóa đơn
          setButtonReceipt(false);
        } else {
          setPaymentStatus("Thanh toán thất bại. Vui lòng thử lại.");
        }
      } else {
        setPaymentStatus("Lỗi kết nối. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi thanh toán:", error);
      setPaymentStatus("Lỗi khi thanh toán. Vui lòng thử lại.");
    }
  };

  return (
    <div className="App">
      <div className="Navbar_container">
        <button
          className="bill"
          onClick={() => {
            setButtonReceipt(false);
            setButtonOrder(true);
          }}
        >
          Tạo hóa đơn
        </button>
        <button
          className="receipt"
          onClick={() => {
            setButtonReceipt(true);
            setButtonOrder(false);
          }}
        >
          Quản lý hóa đơn
        </button>
      </div>

      {buttonOrder && (
        <div className="App_container">
          <h1 style={{ marginTop: "10px", color: "red" }}>Tạo hóa đơn</h1>
          <InputForm addProduct={addProduct} />
          <div className="order_container">
            <h1 style={{ marginTop: "10px", color: "red" }}>Sản phẩm</h1>
            <div className="order_box">
              {products.map((p, index) =>
                p && p.id_product ? (
                  <div key={index} className="bill_detail">
                    <Order {...p} onDelete={handleDelete} />
                  </div>
                ) : (
                  <div key={index} className="bill_detail">
                    <p>Product data is missing</p>
                  </div>
                )
              )}
            </div>
            <button
              className="submit"
              style={{
                marginTop: "10px",
                color: "white",
                width: "400px",
                height: "50px",
                fontSize: "20px",
              }}
              onClick={handlePayment} // Thêm sự kiện khi nhấn thanh toán
            >
              Thanh Toán
            </button>
            {paymentStatus && (
              <div
                className="payment-status"
                style={{ marginTop: "20px", color: "green" }}
              >
                <strong>{paymentStatus}</strong>
              </div>
            )}
          </div>
        </div>
      )}

      {buttonReceipt && (
        <div className="App_container">
          <h1 style={{ marginTop: "10px", color: "red" }}>Quản lý hóa đơn</h1>
          <div className="receipt_container">
            <div className="bill_box">
              {invoices && invoices.length === 0 ? (
                <p>Chưa có hóa đơn nào.</p>
              ) : (
                invoices &&
                invoices.length > 0 &&
                invoices.map((invoice, index) => (
                  <div key={index} className="bill_detail">
                    <h3>Hóa đơn ID: {invoice.id_receipt}</h3>
                    <div className="label">Ngày:</div>
                    <div className="value">
                      {new Date(invoice.createAt).toLocaleDateString()}
                    </div>
                    <div className="label">Tổng giá trị:</div>
                    <div className="value">{invoice.total_amount} </div>
                    <div className="label">ID thu ngân:</div>
                    <div className="value">{invoice.id_member}</div>
                    <div className="label">Tên thu ngân:</div>
                    <div className="value">{invoice.name_cashier}</div>
                    <div className="label">Lợi nhuận:</div>
                    <div className="value">{invoice.profited}</div>
                    <div className="label">Phương thức thanh toán:</div>
                    <div className="value">{invoice.payment_method}</div>
                    <div className="label">Giảm giá:</div>
                    <div className="value">{invoice.voucher}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
