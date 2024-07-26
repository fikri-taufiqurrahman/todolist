import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBali2zQJ5LIIISP0px06vp9rMKYvTiWAo",
  authDomain: "todo-list-6b24f.firebaseapp.com",
  projectId: "todo-list-6b24f",
  storageBucket: "todo-list-6b24f.appspot.com",
  messagingSenderId: "618119615878",
  appId: "1:618119615878:web:1eb586993331d07e304807",
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Initialize Firestore
const db = getFirestore(app);

const saveTask = async (task, deadline) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User is not logged in");

    const taskWithUserIdAndTimestamp = {
      ...task,
      userId: user.uid,
      createdAt: serverTimestamp(),
      deadline: deadline ? Timestamp.fromDate(new Date(deadline)) : null, // Convert to Firestore Timestamp
    };
    const docRef = await addDoc(
      collection(db, "tasks"),
      taskWithUserIdAndTimestamp
    );
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const getTasks = async (user) => {
  try {
    if (!user) throw new Error("User is not logged in");

    const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(tasks);
    return tasks;
  } catch (e) {
    console.error("Error fetching tasks: ", e);
    return [];
  }
};

const updateTask = async (taskId, updatedTask) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      ...updatedTask,
      deadline: updatedTask.deadline
        ? Timestamp.fromDate(new Date(updatedTask.deadline))
        : null, // Convert to Firestore Timestamp
    });
  } catch (e) {
    console.error("Error updating document: ", e);
  }
};
const updateTaskDnD = async (taskId, updatedTask) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      ...updatedTask,
    });
  } catch (e) {
    console.error("Error updating document: ", e);
  }
};

const deleteTask = async (taskId) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await deleteDoc(taskRef);
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
};

export {
  auth,
  provider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  db,
  saveTask,
  getTasks,
  deleteTask,
  updateTask,
  updateTaskDnD,
  updateProfile,
};
