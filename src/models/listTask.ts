import api from '@/api';
import { Comment, Task } from '@/api/task';
import { message } from 'antd';
import { useCallback, useState } from 'react';

export default () => {
  const [listTask, setListTask] = useState<Task[]>([]);

  const addTask = useCallback(async (newTask:Task) => {
    const id = await api.taskApi.create(newTask);
    if(id) {
      message.success("Thêm công việc thành công!");
      setListTask((listTask) => {
        return [...listTask, {...newTask,id}]
      });
    }else {
      message.error("Thêm công việc thất bại!");
    }
  }, []);

  const removeTask = useCallback(async (id: string) => {
    console.log("id",id)
     await api.taskApi.del(id);

      setListTask(((oldTask) =>
      {
        return oldTask.filter(task => task.id !== id)
      }))
      message.success("Xóa công việc thành công!");

  }, []);

  const editTask = useCallback(async (newTask: Task) => {
    const res = await api.taskApi.update(newTask);
    if(res) {
      setListTask((listTask) => {
        return listTask.map((task) => {
          if(task.id === newTask.id) return newTask;
          return task;
        })
      });
      message.success("Chỉnh sửa công việc thành công!");
    }else {
      message.error("Chỉnh sửa công việc thất bại!");
    }
  }, []);

  const addComment = useCallback(async (taskId: string, newComment: Comment) => {
    const res = await api.taskApi.addComment(taskId, newComment);
    if(res) {
      setListTask((listTask) => {
        return listTask.map((task) => {
          if(task.id === taskId) {
            task.comments?.push(newComment);
          }
          return task;
        })
      });
    }else {
      message.error("Gửi tin nhắn không thành công");
    }
  }, []);

  return {
    listTask,
    addTask,
    setListTask,
    removeTask,
    editTask,
    addComment,
  };
};
