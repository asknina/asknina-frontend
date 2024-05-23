import { createUser, signInWithEmail, signInWithGoogle, signOut } from '@/lib/firebase/auth'
import addUser, { fetchUserData } from '@/lib/firebase/data/users'
import { createStore } from 'zustand/vanilla'

interface User {
    email: string,
    displayName: string,
    uid: string
    accessToken: string
}

export type AuthState = {
    user: User
    isLoggedIn: boolean
    isLoadingAuth: boolean
    loginError: string
}

export type AuthActions = {
    setIsLoadingAuth: (value: boolean) => void
    setUser: (user: User) => void
    setIsLoggedIn: (value: boolean) => void
    loginWithEmail: (email: string, password: string) => Promise<void>
    loginWithGoogle: () => Promise<void>
    createUser: (email: string, password: string, username: string, dateOfBirth: string, pronouns: string) => Promise<void>
    logout: () => void
}

export type AuthStore = AuthState & AuthActions

export const defaultInitState: AuthState = {
    user: {
        email: "",
        displayName: "",
        uid: "",
        accessToken: ""
    },
    isLoggedIn: false,
    isLoadingAuth: true,
    loginError: ""
}

export const createAuthStore = (
    initState: AuthState = defaultInitState,
) => {
    return createStore<AuthStore>()((set) => ({
        ...initState,
        setIsLoadingAuth: (value) => set((state) => ({ isLoadingAuth: value })),
        setUser: (user) => set(() => ({ user: user })),
        setIsLoggedIn: (value) => set(() => ({ isLoggedIn: value })),
        loginWithEmail: async (email, password) => {
            await signInWithEmail(email, password).then(async (authUser) => {
                if (authUser) {
                    const fetchedUser = await fetchUserData(authUser)
                    set({
                        user: {
                            ...authUser.user,
                            email: authUser.user || "",
                            displayName: fetchedUser.displayName || "",
                        }
                    })
                }
            }).catch((e) => {
                set({ loginError: e.message })
            })
        },
        loginWithGoogle: async () => {
            await signInWithGoogle().then(async (authUser) => {
                if (authUser) {
                    const fetchedUser = await fetchUserData(authUser)
                    const token = await authUser.user.getIdToken()
                    set({
                        user: {
                            ...authUser.user,
                            email: authUser.user.email || "",
                            displayName: fetchedUser.displayName || "",
                            accessToken: token || ""
                        }
                    })
                }
            }).catch((e) => {
                set({ loginError: e.message })
            })
        },
        createUser: async (email, password, username, dateOfBirth, pronouns) => {
            await createUser(email, password).then(async (userCred) => {
                if (userCred) {
                    const { user } = userCred
                    await addUser({
                        email: user.email || "",
                        uid: user.uid,
                        pronouns,
                        username,
                        dateOfBirth
                    })
                    set({
                        user: {
                            ...userCred.user,
                            email: user.email || "",
                            displayName: user.displayName || "",
                        }
                    })
                }
            }).catch((e) => { return e })
        },
        logout: async () => {
            await signOut().then(() => {
                set(defaultInitState)
            })
        }
    }))
}