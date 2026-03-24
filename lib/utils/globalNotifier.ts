let notify: ((msg: string, type?: "success" | "error") => void) | null = null;

export function registerNotifier(
    fn: (msg: string, type?: "success" | "error") => void
) {
    notify = fn;
}

export function notifyGlobal(
    msg: string,
    type: "success" | "error" = "success"
) {
    notify?.(msg, type);
}