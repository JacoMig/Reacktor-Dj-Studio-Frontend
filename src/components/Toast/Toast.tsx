import { useEffect } from "react"
import { ToastType, useToast } from "../../context/ToastContext"
import "./Toast.css"

const Toast = (props:ToastType) => {
    const {variant, message, id} = props
    const {removeToast} = useToast()

    useEffect(() => {
        const timer = setTimeout(() => {
            removeToast(id);
        }, 3000);
        return () => clearTimeout(timer);
    }, [removeToast, id]);

    return (
        <div className={`toast ${variant}`}>
            <p>{message}</p>
        </div>
    )
}

export default Toast