import { create } from "zustand";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/config";

export const useUserStore = create((set, get) => ({
  users: [],
  loading: false,

  // Create user
  addUser: async (userData) => {
    try {
      set({ loading: true });
      const docRef = await addDoc(collection(db, "users"), {
        ...userData,
        createdAt: new Date().toISOString(),
      });
      set((state) => ({
        users: [...state.users, { id: docRef.id, ...userData }],
        loading: false,
      }));
    } catch (error) {
      console.error("Error adding user:", error);
      set({ loading: false });
    }
  },

  // Read all users
  fetchUsers: async () => {
    try {
      set({ loading: true });
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = [];
      querySnapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      set({ users: usersList, loading: false });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ loading: false });
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      set({ loading: true });
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, userData);
      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId ? { ...user, ...userData } : user
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Error updating user:", error);
      set({ loading: false });
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      set({ loading: true });
      await deleteDoc(doc(db, "users", userId));
      set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
        loading: false,
      }));
    } catch (error) {
      console.error("Error deleting user:", error);
      set({ loading: false });
    }
  },
}));
