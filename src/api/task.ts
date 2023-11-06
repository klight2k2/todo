import { db } from "@/firebase"
import { addDoc, collection, deleteDoc, doc, setDoc } from "firebase/firestore"

export type Comment = {
    email: string,
    photoURL?: string,
    content: string,
    timestamp: string,
}

export type Task = {
    id: string,
    name: string,
    assignee: string[],  //user_id
    assigner: string,    //user_id
    tags?: string[],
    startTime: string,
    endTime: string,
    priority: number,
    status: number,
    rate?: string,
    description: string,
    comments?: Comment[],
    projectId: string,
    projectName: string,
}

const create = async(payload: Task) => {
    try {
        const newTask= await addDoc(collection(db, "tasks"), payload);
        console.log("newTask",newTask.id)
        return newTask.id;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const update = async (payload: Task) => {
    try {
        if(!payload?.id) return null;
        console.log(payload);
        
        const taskRef = doc(db, "tasks", payload.id);
        let docx =await setDoc(taskRef, payload);
        console.log(docx);
        return true;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const del = (id: string) => {
    try {
        const taskRef = doc(db, "tasks", id);
        return deleteDoc(taskRef);
    } catch (error) {
        console.log(error);
        return null;
    }
}

const taskApi = {
    create,
    update,
    del
};
  
export default taskApi;