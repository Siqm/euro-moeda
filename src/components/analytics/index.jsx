import React from "react";

export default function Analytics() {
    return (
        <>
            <script
                async
                src="https://www.googletagmanager.com/gtag/js?id=G-BZJ7FYN6NT"
            />

            <script
                dangerouslySetInnerHTML={{
                    __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                  
                    gtag('config', 'G-BZJ7FYN6NT');
                    `
                }}
            />

        </>
    )
}