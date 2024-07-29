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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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

    // Mengelompokkan tugas berdasarkan status
    const groupedTasks = {
      "mandatory-urgent": {
        title: "Mandatory Urgent",
        items: [],
      },
      "mandatory-not-urgent": {
        title: "Mandatory, But Not Urgent",
        items: [],
      },
      "unmandatory-urgent": {
        title: "Urgent, But Not Mandatory",
        items: [],
      },
      "unmandatory-not-urgent": {
        title: "Not Urgent and Not Mandatory",
        items: [],
      },
    };

    tasks.forEach((task) => {
      if (groupedTasks[task.status]) {
        groupedTasks[task.status].items.push(task);
      }
    });

    console.log(groupedTasks);
    return groupedTasks;
  } catch (e) {
    console.error("Error fetching tasks: ", e);
    return {};
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
const updateTaskDnD = async (taskId, status) => {
  const taskDoc = doc(db, "tasks", taskId);
  await updateDoc(taskDoc, { status });
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
