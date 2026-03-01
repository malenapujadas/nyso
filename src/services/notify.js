import { toast } from "vue3-toastify";

export const notify = {
  success(msg, opts = {}) {
    toast.success(msg, { autoClose: 2500, ...opts });
  },
  error(msg, opts = {}) {
    toast.error(msg, { autoClose: 3000, ...opts });
  },
  info(msg, opts = {}) {
    toast.info(msg, { autoClose: 2500, ...opts });
  },
  warning(msg, opts = {}) {
    toast.warn(msg, { autoClose: 3000, ...opts });
  },
};