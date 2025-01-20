
import { ToastType } from "../../context/ToastContext"
import Toast from "./Toast"

const ToastContainer = ({toasts}:{toasts:ToastType[]}) => {

    return (
        <div className="toast-container">
            {toasts.map((toast) => (
            <Toast
                key={toast.id}
                message={toast.message}
                variant={toast.variant}
                id={toast.id}
            />
            ))}
        </div>
    )
}

export default ToastContainer