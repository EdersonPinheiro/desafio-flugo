import { collection, doc, setDoc, query, orderBy, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { Collaborator } from '../types/collaborator';

const COLLECTION_NAME = 'collaborators';



export const subscribeToCollaborators = (callback: (collaborators: Collaborator[]) => void) => {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
    return onSnapshot(q, (querySnapshot) => {
        const collaborators: Collaborator[] = [];
        querySnapshot.forEach((doc) => {
            collaborators.push({ id: doc.id, ...doc.data() } as Collaborator);
        });
        callback(collaborators);
    }, (error) => {
        console.error("Error listening to collaborators: ", error);
        callback([]);
    });
};

export const saveCollaborator = async (collaborator: Omit<Collaborator, 'id'>): Promise<string> => {
    try {
        const newDocRef = doc(collection(db, COLLECTION_NAME));

        setDoc(newDocRef, collaborator).catch(err => {
            console.error("Error syncing new collaborator to server:", err);
        });

        return newDocRef.id;
    } catch (error) {
        console.error("Error preparing document: ", error);
        throw error;
    }
};


export const getCollaborator = async (id: string): Promise<Collaborator | null> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Collaborator;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting document: ", error);
        return null;
    }
};

export const updateCollaborator = async (id: string, collaborator: Partial<Collaborator>): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await setDoc(docRef, collaborator, { merge: true });
    } catch (error) {
        console.error("Error updating document: ", error);
        throw error;
    }
};

const AVATAR_API = 'https://api.dicebear.com/9.x/notionists/svg';

export const getRandomAvatar = (name?: string): string => {
    const seed = name ? encodeURIComponent(name) : Math.random().toString(36).substring(7);
    return `${AVATAR_API}?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
};
