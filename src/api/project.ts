import { db } from "@/firebase"
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";

export type Project = {
  id?: string,
  name: string,
  members: string[],  
  creator: string,    
  description: string,
  task_ids?: string[],
}

const create = async (payload: Project) => {
  try {
    const projectRef =await  addDoc(collection(db, "projects"), payload);
    return projectRef.id;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const get = async (id: string) => {
  try {
    const projectRef = doc(db, "projects", id);
    const res = await getDoc(projectRef);
      return {
        id: res.id,
        ...res.data(),
      }
  } catch (error) {
    console.log(error);
    return null;
  }
}

const update = (id: string, payload: Project) => {
  try {
    const projectRef = doc(db, "projects", id);
    return setDoc(projectRef, payload, { merge: true });
  } catch (error) {
    console.log(error);
    return null;
  }
}

const del = async(id: string) => {
  try {
    const projectRef = doc(db, "projects", id);
    return deleteDoc(projectRef);
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getMyProjects = async (email: string) => {
  try {
    const q = query(collection(db, "projects"), where("members", "array-contains", email));
    const res = await getDocs(q);
    const projects = res.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      }
    });
    return projects as Project[];
  } catch (error) {
    console.log(error);
    return null;
  }
}

const addMember = async ( member: string, id: string) => {
  try {
    const taskRef = doc(db, "projects", id);
    await setDoc(taskRef, {
      members: arrayUnion(member),
    }, {merge:true});
    return true;
  } catch (error) {
    console.log(error);
    return null;
  }
}
const deleteMember = async ( member: string, id: string) => {
  try {
    const taskRef = doc(db, "projects", id);
    await setDoc(taskRef, {
      members: arrayRemove(member),
    },{merge:true});
    return true;
  } catch (error) {
    console.log(error);
    return null;
  }
}
const getMembers = async (id: string) => {
  try {
    const projectRef = doc(db, "projects", id);
    const res = await getDoc(projectRef);
      return res.data()?.members as string[]
  } catch (error) {
    console.log(error);
    return [];
  }
}
const projectApi = {
  create,
  get,
  update,
  del,
  getMyProjects,
  addMember,
  deleteMember,
  getMembers
};

export default projectApi;