import type { ReactNode } from "react";
import './styles/header-card.css'

export function HeaderCard({ title, children } : { title: string, children: ReactNode }) {
    return (
        <>
            <h1>{title}</h1>
            <div className='card-simple'>
                {children}
            </div>
        </>
    );
}