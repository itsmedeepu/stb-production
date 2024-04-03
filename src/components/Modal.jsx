import React, { useRef, useImperativeHandle, forwardRef } from "react";
import CloseIcon from "@mui/icons-material/Close";

const Modal = forwardRef(function Modal({ children, handleCloseModal }, ref) {
  // Create a ref for the dialog element
  const dialogRef = useRef(null);

  // Expose methods of the modal component to the parent component
  useImperativeHandle(ref, () => ({
    // Method to open the modal
    openModal: () => {
      if (dialogRef.current) {
        dialogRef.current.showModal();
      }
    },
    // Method to close the modal
    closeModal: () => {
      if (dialogRef.current) {
        dialogRef.current.close();
      }
    },
  }));

  const CloseModal = () => {
    handleCloseModal();
    ref.current.closeModal();
  };

  return (
    <dialog ref={dialogRef} style={{ width: 350, height: 350 }}>
      <CloseIcon
        onClick={CloseModal}
        style={{ position: "absolute", right: 0, top: 0, cursor: "pointer" }}
      ></CloseIcon>

      {children}
    </dialog>
  );
});

export default Modal;
