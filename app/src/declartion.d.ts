import { AriaAttributes, DOMAttributes } from "react";

declare module 'react-router-dom'

declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        class?: string
    }
}