/**
 * PWA registration and notification handling utilities
 */

export async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            console.log('ServiceWorker registration successful');

            // Request notification permission
            if ('Notification' in window) {
                const permission = await Notification.requestPermission();
                console.log('Notification permission:', permission);
            }

            return registration;
        } catch (error) {
            console.error('ServiceWorker registration failed:', error);
            return null;
        }
    }
    return null;
}

export async function unregisterServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.ready;
            await registration.unregister();
            console.log('ServiceWorker unregistered');
            return true;
        } catch (error) {
            console.error('ServiceWorker unregistration failed:', error);
            return false;
        }
    }
    return false;
}

export async function subscribeToPushNotifications(registration: ServiceWorkerRegistration) {
    try {
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.VAPID_PUBLIC_KEY || '')
        });

        console.log('Push notification subscription:', subscription);
        return subscription;
    } catch (error) {
        console.error('Push notification subscription failed:', error);
        return null;
    }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

// Check if the app can be installed
export function checkInstallability(): Promise<boolean> {
    return new Promise((resolve) => {
        if ('getInstalledRelatedApps' in navigator) {
            // @ts-ignore: Property 'getInstalledRelatedApps' does not exist on type 'Navigator'
            navigator.getInstalledRelatedApps().then((apps) => {
                resolve(apps.length === 0);
            }).catch(() => {
                resolve(true);
            });
        } else {
            resolve(true);
        }
    });
}

// Listen for beforeinstallprompt event
export function listenForInstallPrompt(): Promise<BeforeInstallPromptEvent> {
    return new Promise((resolve) => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            resolve(e as BeforeInstallPromptEvent);
        });
    });
}

// Interface for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
} 