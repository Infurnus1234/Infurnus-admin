"use client";
import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!isOpen) {
      dialog.close();
      return;
    }
    const previous = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previous;
    };
  }, [isOpen]);
  return (
    <dialog
      ref={ref}
      className={"workspace-dialog dialog-" + size}
      aria-labelledby={id}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <header className="dialog-header">
        <div>
          <h2 id={id}>{title || "Details"}</h2>
          {description && <p>{description}</p>}
        </div>
        <button type="button" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>
      </header>
      <div className="dialog-content">{children}</div>
      {footer && <footer className="dialog-footer">{footer}</footer>}
    </dialog>
  );
}
