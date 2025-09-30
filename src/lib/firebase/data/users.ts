import { doc, setDoc, getDoc, updateDoc, getDocs, collection, FieldValue, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { UserCredential } from "firebase/auth";

interface User {
    email: string;
    uid: string;
    pronouns: string;
    username: string;
    dateOfBirth: string;
    created?: FieldValue;
    updated?: FieldValue;
}

export async function getUser(userId: any) {
    if (!db) {
        throw new Error("Firestore not initialized");
    }
    return (await getDoc(doc(db, `users/${userId}`))).data();
}

export default async function addUser(userObj: User) {
    if (!db) {
        throw new Error("Firestore not initialized");
    }
    try {
        await setDoc(
            doc(db, "users", userObj.uid),
            { ...userObj, conversations: [], created: serverTimestamp() }
        ).then(async () => {
            return await getUser(userObj.uid);
        });
    } catch (e) {
        return e;
    }
}

export const fetchUserData = async (userCredential: UserCredential): Promise<any> => {
    if (!db) {
        throw new Error("Firestore not initialized");
    }
    const { user } = userCredential
    const userDocRef = doc(db, "users", user?.uid || "abc");
    const docSnap = await getDoc(userDocRef);
    try {
        if (docSnap.exists()) {
            return docSnap.data();
        }
        else {
            await addUser({
                email: user.email || "",
                uid: user.uid || "",
                pronouns: "",
                username: "",
                dateOfBirth: "",
                created: serverTimestamp()
            });
        }
    } catch (e) {
        return e;
    }
};

export const getUserProfile = async (userId: string): Promise<any> => {
    if (!db) {
        throw new Error("Firestore not initialized");
    }
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);
    return docSnap.data()
}

export const updateUserProfile = async (userId: string, userInfo: Partial<User>): Promise<any> => {
    if (!db) {
        throw new Error("Firestore not initialized");
    }
    return await updateDoc(doc(db, "users", userId), { ...userInfo, updated: serverTimestamp() }).then(async () => {
        return await getUserProfile(userId)
    });
}