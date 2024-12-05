import { writable } from 'svelte/store';
import type { BeforeInstallPromptEvent } from './types';
import { checkInstallability, listenForInstallPrompt } from './pwa';

interface PWAState {
    canInstall: boolean;
    isInstalling: boolean;
    deferredPrompt: BeforeInstallPromptEvent | null;
}

function createPWAStore() {
    const { subscribe, set, update } = writable<PWAState>({
        canInstall: false,
        isInstalling: false,
        deferredPrompt: null
    });

    return {
        subscribe,
        init: async () => {
            const canInstall = await checkInstallability();
            
            if (canInstall) {
                const deferredPrompt = await listenForInstallPrompt();
                update(state => ({ ...state, canInstall: true, deferredPrompt }));
            }
        },
        promptInstall: async () => {
            update(state => {
                if (!state.deferredPrompt) return state;

                state.deferredPrompt.prompt();
                state.isInstalling = true;

                state.deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    } else {
                        console.log('User dismissed the install prompt');
                    }
                    update(s => ({ ...s, deferredPrompt: null, isInstalling: false }));
                });

                return state;
            });
        },
        reset: () => {
            set({
                canInstall: false,
                isInstalling: false,
                deferredPrompt: null
            });
        }
    };
}

export const pwaStore = createPWAStore(); 