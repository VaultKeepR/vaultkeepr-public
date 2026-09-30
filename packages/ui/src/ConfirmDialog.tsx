import { Button } from "./Button";
import { Modal } from "./Modal";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body?: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive?: boolean;
  confirmTestId?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function confirmBusyState(busy: boolean): boolean {
  return busy;
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel,
  destructive = false,
  confirmTestId,
  busy = false,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      {body ? <p className="text-sm text-vk-muted">{body}</p> : null}
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" onClick={onCancel} variant="secondary">
          {cancelLabel}
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          data-testid={confirmTestId}
          variant={destructive ? "destructive" : "default"}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
