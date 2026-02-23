export const ONBOARDING_KEY = 'onboarding_seen';

function isWeb() {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export async function setOnboardingSeen() {
    if (isWeb()) {
        window.localStorage.setItem(ONBOARDING_KEY, 'true');
        return;
    }
    try {
        const AsyncStorage = await import('@react-native-async-storage/async-storage');
        await AsyncStorage.default.setItem(ONBOARDING_KEY, 'true');
    } catch { }
}

export async function hasSeenOnboarding() {
    if (isWeb()) {
        return window.localStorage.getItem(ONBOARDING_KEY) === 'true';
    }
    try {
        const AsyncStorage = await import('@react-native-async-storage/async-storage');
        const value = await AsyncStorage.default.getItem(ONBOARDING_KEY);
        return value === 'true';
    } catch {
        return false;
    }
}
