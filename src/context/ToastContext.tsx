import { createContext, useContext, useState } from "react";
import ToastContainer from "../components/Toast/ToastContainer";

export type ToastType = {
    message: string,
    variant: "default" | "destructive" | "success",
    id: string
}

interface IToastContext {
    addToast: ({message, variant}:{message:string, variant:ToastType['variant']}) => void,
    removeToast: (id: string) => void
}

const ToastContext = createContext<IToastContext>({
    addToast: () => {},
    removeToast: () => {}
})


export const ToastProvider = ({children}: {children: React.ReactNode}) => {
    const [toasts, setToasts] = useState<ToastType[]>([])

    const addToast = ({message, variant}:{message:string, variant:ToastType['variant']}) => {
        setToasts([...toasts, {
            message,
            variant,
            id: Date.now().toString()
        }])
    }

    const removeToast = (id:string) => {
        setToasts(toasts.filter(t => t.id !== id))
    }
    return (
        <ToastContext.Provider value={{addToast, removeToast}}>
            {children}
            <ToastContainer toasts={toasts} />
        </ToastContext.Provider>
    )

}


export const useToast = () => {
    return useContext(ToastContext);
  };