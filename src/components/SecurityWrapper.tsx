"use client";

import { useEffect } from 'react';

interface SecurityWrapperProps {
    children: React.ReactNode;
    enableInDevelopment?: boolean;
}

export default function SecurityWrapper({
    children,
    enableInDevelopment = false
}: SecurityWrapperProps) {

    useEffect(() => {
        // Only apply security in production or if explicitly enabled
        const isDevelopment = process.env.NODE_ENV === 'development';

        if (isDevelopment && !enableInDevelopment) {
            return;
        }

        // Clear and disable console
        const disableConsole = () => {
            // Store original console methods
            const originalConsole = { ...console };

            // Override all console methods
            Object.keys(console).forEach((key) => {
                if (typeof console[key as keyof Console] === 'function') {
                    (console as any)[key] = () => { };
                }
            });

            // Clear existing console
            if (console.clear) {
                console.clear();
            }
        };

        // Disable right-click context menu
        const disableRightClick = (e: MouseEvent) => {
            e.preventDefault();
            return false;
        };

        // Disable developer tools shortcuts
        const disableDevTools = (e: KeyboardEvent) => {
            // F12
            if (e.keyCode === 123) {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+I (Chrome DevTools)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+J (Chrome Console)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
                e.preventDefault();
                return false;
            }

            // Ctrl+U (View Source)
            if (e.ctrlKey && e.keyCode === 85) {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+C (Inspect Element)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
                e.preventDefault();
                return false;
            }

            // Ctrl+S (Save Page)
            if (e.ctrlKey && e.keyCode === 83) {
                e.preventDefault();
                return false;
            }

            // F5 dan Ctrl+R (Refresh) - Optional, bisa di-uncomment jika perlu
            // if (e.keyCode === 116 || (e.ctrlKey && e.keyCode === 82)) {
            //   e.preventDefault();
            //   return false;
            // }
        };

        // Detect and prevent DevTools opening
        const detectDevTools = () => {
            const threshold = 160;

            const detectBySize = () => {
                if (
                    window.outerHeight - window.innerHeight > threshold ||
                    window.outerWidth - window.innerWidth > threshold
                ) {
                    // DevTools might be open, redirect or show warning
                    document.body.innerHTML = `
            <div style="
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: #000;
              color: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: Arial, sans-serif;
              font-size: 24px;
              z-index: 999999;
            ">
              🔒 Access Denied - Developer Tools Detected
            </div>
          `;
                }
            };

            // Check every 500ms
            setInterval(detectBySize, 500);
        };

        // Disable text selection
        const disableTextSelection = () => {
            document.addEventListener('selectstart', (e) => {
                e.preventDefault();
                return false;
            });

            document.addEventListener('dragstart', (e) => {
                e.preventDefault();
                return false;
            });
        };

        // Disable image dragging
        const disableImageDrag = () => {
            const images = document.querySelectorAll('img');
            images.forEach((img) => {
                img.addEventListener('dragstart', (e) => {
                    e.preventDefault();
                    return false;
                });
            });
        };

        // Warning message in console
        const showConsoleWarning = () => {
            const warningStyle = 'color: red; font-size: 50px; font-weight: bold;';
            console.log('%c⚠️ STOP!', warningStyle);
            console.log('%cThis is a browser feature intended for developers. Unauthorized access is prohibited.', 'color: red; font-size: 16px;');
            console.log('%cIf someone told you to copy-paste something here, it is likely a scam.', 'color: red; font-size: 16px;');

            // Clear console after warning
            setTimeout(() => {
                if (console.clear) {
                    console.clear();
                }
            }, 3000);
        };

        // Apply all security measures
        showConsoleWarning();
        disableConsole();
        disableTextSelection();
        disableImageDrag();
        detectDevTools();

        // Add event listeners
        document.addEventListener('contextmenu', disableRightClick);
        document.addEventListener('keydown', disableDevTools);

        // Cleanup function
        return () => {
            document.removeEventListener('contextmenu', disableRightClick);
            document.removeEventListener('keydown', disableDevTools);
        };
    }, [enableInDevelopment]);

    return <>{children}</>;
} 