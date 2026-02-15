import { collection, doc, setDoc, query, orderBy, onSnapshot, getDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { Department } from '../types/department';

const COLLECTION_NAME = 'departments';

export const subscribeToDepartments = (callback: (departments: Department[]) => void) => {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
    return onSnapshot(q, (querySnapshot) => {
        const departments: Department[] = [];
        querySnapshot.forEach((doc) => {
            departments.push({ id: doc.id, ...doc.data() } as Department);
        });
        callback(departments);
    }, (error) => {
        console.error("Error listening to departments: ", error);
        callback([]);
    });
};

export const saveDepartment = async (department: Omit<Department, 'id'>): Promise<string> => {
    try {
        const newDocRef = doc(collection(db, COLLECTION_NAME));
        setDoc(newDocRef, department).catch(err => {
            console.error("Error saving department:", err);
        });
        return newDocRef.id;
    } catch (error) {
        console.error("Error preparing department: ", error);
        throw error;
    }
};

export const getDepartment = async (id: string): Promise<Department | null> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Department;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting department: ", error);
        return null;
    }
};

export const updateDepartment = async (id: string, department: Partial<Department>): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        setDoc(docRef, department, { merge: true }).catch(err => {
            console.error("Error updating department:", err);
        });
    } catch (error) {
        console.error("Error updating department: ", error);
        throw error;
    }
};

export const deleteDepartment = async (id: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Error deleting department: ", error);
        throw error;
    }
};

export const deleteDepartments = async (ids: string[]): Promise<void> => {
    try {
        const batch = writeBatch(db);
        ids.forEach(id => {
            const docRef = doc(db, COLLECTION_NAME, id);
            batch.delete(docRef);
        });
        await batch.commit();
    } catch (error) {
        console.error("Error deleting departments: ", error);
        throw error;
    }
};
