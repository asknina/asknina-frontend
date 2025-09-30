import { atom } from 'jotai';
import { createUser, signInWithEmail, signInWithGoogle, signOut } from '@/lib/firebase/auth';
import addUser, { fetchUserData, getUserProfile, updateUserProfile } from '@/lib/firebase/data/users';

interface User {
    email: string;
    displayName: string;
    uid: string;
    accessToken: string;
}

export interface ProfileDetails {
    username: string;
    dateOfBirth: string;
    pronouns: string;
}

export const defaultUser: User = {
    email: "",
    displayName: "",
    uid: "",
    accessToken: ""
};

export const defaultProfile: ProfileDetails = {
    username: "",
    dateOfBirth: "",
    pronouns: ""
};

// Base atoms
export const userAtom = atom<User>(defaultUser);
export const isLoggedInAtom = atom<boolean>(false);
export const isLoadingAuthAtom = atom<boolean>(true);
export const loginErrorAtom = atom<string>("");
export const profileAtom = atom<ProfileDetails>(defaultProfile);

// Action atoms
export const loginWithEmailAtom = atom(
    null,
    async (get, set, { email, password }: { email: string; password: string }) => {
        try {
            const authUser = await signInWithEmail(email, password);
            if (authUser && authUser.user) {
                const fetchedUser = await fetchUserData(authUser);
                const token = await authUser.user.getIdToken();
                set(userAtom, {
                    email: authUser.user.email || "",
                    displayName: fetchedUser.displayName || "",
                    uid: authUser.user.uid,
                    accessToken: token || ""
                });
                set(isLoggedInAtom, true);
                return true;
            }
            return false;
        } catch (e: any) {
            set(loginErrorAtom, e.message);
            return false;
        }
    }
);

export const loginWithGoogleAtom = atom(
    null,
    async (get, set) => {
        try {
            const authUser = await signInWithGoogle();
            if (authUser && authUser.user) {
                const fetchedUser = await fetchUserData(authUser);
                const token = await authUser.user.getIdToken();
                set(userAtom, {
                    email: authUser.user.email || "",
                    displayName: fetchedUser.displayName || "",
                    uid: authUser.user.uid,
                    accessToken: token || ""
                });
                set(isLoggedInAtom, true);
            }
        } catch (e: any) {
            set(loginErrorAtom, e.message);
        }
    }
);

export const createUserAtom = atom(
    null,
    async (get, set, { email, password, username, dateOfBirth, pronouns }: {
        email: string;
        password: string;
        username: string;
        dateOfBirth: string;
        pronouns: string;
    }) => {
        try {
            const userCred = await createUser(email, password);
            if (userCred && userCred.user) {
                const { user } = userCred;
                await addUser({
                    email: user.email || "",
                    uid: user.uid,
                    pronouns,
                    username,
                    dateOfBirth
                });
                const token = await user.getIdToken();
                set(userAtom, {
                    email: user.email || "",
                    displayName: user.displayName || "",
                    uid: user.uid,
                    accessToken: token || ""
                });
                set(isLoggedInAtom, true);
            }
        } catch (e: any) {
            set(loginErrorAtom, e.message);
            throw e;
        }
    }
);

export const logoutAtom = atom(
    null,
    async (get, set) => {
        await signOut();
        set(userAtom, defaultUser);
        set(isLoggedInAtom, false);
        set(profileAtom, defaultProfile);
        set(isLoadingAuthAtom, false);
    }
);

export const getUserProfileAtom = atom(
    null,
    async (get, set) => {
        const user = get(userAtom);
        if (user.uid) {
            const userProfile = await getUserProfile(user.uid);
            set(profileAtom, userProfile);
        }
    }
);

export const updateUserProfileAtom = atom(
    null,
    async (get, set, userInfo: Partial<ProfileDetails>) => {
        const user = get(userAtom);
        if (user.uid) {
            const updatedUser = await updateUserProfile(user.uid, userInfo);
            set(profileAtom, updatedUser);
        }
    }
);