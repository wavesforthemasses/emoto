<script lang="ts">
    import { onMount } from 'svelte';
    import { registerServiceWorker, subscribeToPushNotifications } from '$lib/utils/pwa';

    let notificationStatus: 'default' | 'granted' | 'denied' = 'default';
    let loading = false;
    let error = '';
    let registration: ServiceWorkerRegistration | null = null;

    onMount(async () => {
        if ('Notification' in window) {
            notificationStatus = Notification.permission;
        }
    });

    async function handleEnableNotifications() {
        if (!('Notification' in window)) {
            error = 'Push notifications are not supported in your browser';
            return;
        }

        loading = true;
        error = '';

        try {
            // Register service worker if not already registered
            if (!registration) {
                registration = await registerServiceWorker();
                if (!registration) {
                    throw new Error('Failed to register service worker');
                }
            }

            // Request notification permission
            const permission = await Notification.requestPermission();
            notificationStatus = permission;

            if (permission === 'granted') {
                // Subscribe to push notifications
                const subscription = await subscribeToPushNotifications(registration);
                if (!subscription) {
                    throw new Error('Failed to subscribe to push notifications');
                }
            }
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to enable notifications';
        } finally {
            loading = false;
        }
    }
</script>

<div class="notification-opt-in">
    {#if notificationStatus === 'default'}
        <button 
            class="btn-primary"
            on:click={handleEnableNotifications}
            disabled={loading}
        >
            {loading ? 'Enabling...' : 'Enable Push Notifications'}
        </button>
    {:else if notificationStatus === 'granted'}
        <p class="status success">
            <span class="icon">✓</span>
            Push notifications are enabled
        </p>
    {:else}
        <p class="status warning">
            <span class="icon">!</span>
            Push notifications are blocked
        </p>
    {/if}

    {#if error}
        <p class="error">{error}</p>
    {/if}
</div>

<style>
    .notification-opt-in {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
        align-items: center;
    }

    .btn-primary {
        background-color: var(--color-primary);
        color: white;
        border: none;
        padding: var(--spacing-2) var(--spacing-4);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: background-color var(--transition);
        font-size: var(--font-size-base);
    }

    .btn-primary:hover:not(:disabled) {
        background-color: var(--color-primary-dark);
    }

    .btn-primary:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .status {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
        font-size: var(--font-size-sm);
        padding: var(--spacing-2) var(--spacing-4);
        border-radius: var(--border-radius);
    }

    .success {
        background-color: var(--color-success);
        color: white;
    }

    .warning {
        background-color: var(--color-warning);
        color: white;
    }

    .icon {
        font-weight: bold;
    }

    .error {
        color: var(--color-danger);
        font-size: var(--font-size-sm);
    }
</style> 