import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // hoặc "#__next" nếu dùng Next.js

const CommonModal = ({ isOpen, onClose, title = "Thông báo", children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={title}
      className="bg-white p-6 pb-2 rounded-xl shadow-xl max-w-md w-full mx-auto outline-none"
      overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    >
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="mb-4">{children}</div>
    </Modal>
  );
};

export default CommonModal;
