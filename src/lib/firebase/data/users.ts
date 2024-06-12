import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { UserCredential } from "firebase/auth";

interface User {
    email: string;
    uid: string;
    pronouns: string;
    username: string;
    dateOfBirth: string;
}

export async function getUser(userId: any) {
    return (await getDoc(doc(db, `users/${userId}`))).data();
}

export default async function addUser(userObj: User) {
    try {
        await setDoc(
            doc(db, "users", userObj.uid),
            { ...userObj, conversations: [] }
        ).then(async () => {
            return await getUser(userObj.uid);
        });
    } catch (e) {
        return e;
    }
}

export const fetchUserData = async (userCredential: UserCredential): Promise<any> => {
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
            });
        }
    } catch (e) {
        return e;
    }
};

export const getUserProfile = async (userId: string): Promise<any> => {
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);
    return docSnap.data()
}

export const updateUserProfile = async (userId: string, userInfo: Partial<User>): Promise<any> => {
    return await updateDoc(doc(db, "users", userId), userInfo).then(async () => {
        return await getUserProfile(userId)
    });
}