import "./object.css";

const Order = ({
  id_product,
  id_receipt,
  price,
  quantity,
  voucher,
  onDelete,
}) => {
  return (
    <div className="order-container">
      <h2>
        Thông tin sản phẩm
        <button className="delete-button" onClick={() => onDelete(id_product)}>
          {" "}
          X{" "}
        </button>
      </h2>
      <div className="order-detail">
        <strong>ID Sản phẩm:</strong> {id_product || "N/A"}
      </div>
      <div className="order-detail">
        <strong>ID Hóa đơn:</strong> {id_receipt || "N/A"}
      </div>
      <div className="order-detail">
        <strong>Giá:</strong> {price ? `${price} VND` : "Chưa có giá"}
      </div>
      <div className="order-detail">
        <strong>Số lượng:</strong> {quantity || "0"}
      </div>
      <div className="order-detail">
        <strong>Giảm giá:</strong> {voucher || "0"}
      </div>
    </div>
  );
};

export default Order;
