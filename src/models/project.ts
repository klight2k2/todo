import api from '@/api';
import { Project } from '@/api/project';
import { message } from 'antd';
import { useCallback, useState } from 'react';

export default () => {
  const [listProject, setListProject] = useState<Project[]>([]);
  const addProject = useCallback(async (newProject: Project) => {
    const id = await api.projectApi.create(newProject);
    if(id) {
      message.success("Tạo dự án thành công!");
      setListProject((oldProject) => {
        return [...oldProject, {...newProject,id}]
      });
    }else {
      message.error("Có lỗi khi tạo, vui lòng thử lại!");
    }
  }, []);

  const removeProject = useCallback(async (id: string) => {
    const res=await api.projectApi.del(id);
      setListProject((listProject)=>listProject.filter((project: Project) => {
        return project.id !== id
      }))
      message.success("Xóa dự án thành công!");
      
   
  }, []);
  const editProject = useCallback((newProject: Project) => {
    setListProject(listProject.map((project: Project) => {
      if (project.id === newProject.id) {
        return newProject;
      }
      return project
    }))
  }, []);

  const addMember = useCallback(async (projectId: string, member:string) => {
    const res = await api.projectApi.addMember(member,projectId);
    if(res) {
      setListProject((listProj) => {
        return listProj.map((project) => {
          if(project.id === projectId) {
            project.members?.push(member);
          }
          return project;
        })
      });
      message.success("Thêm thành công thành viên vào dự án!");

    }else {
      message.error("Có lỗi xảy ra, vui lòng thửu lại");
    }
  }, []);
  // const addMember = useCallback(async (member: string,id:string) => {
  //   const res=await api.projectApi.addMember(member,id);
  //   if(res){
  //     setListProject((listProject) => {
  //       return  listProject.map((project: Project) => {
  //         if (project.id === id) {
  //           console.log("added",member)
  //         project.members.push(member);
  //         }
  //         return project
  //       })
  //     })
  //     message.success("Thêm thành công thành viên vào dự án!");
  //   } else{
  //     message.error("Có lỗi xảy ra, xin vui lòng thử lại!");
  //   }
  // }, []);
  const deleteMemberProject = useCallback(async (member: string,id:string) => {
    const res=await api.projectApi.deleteMember(member,id);
    if(res){

      setListProject((listProject) => {
        return listProject.map((project: Project) => {
          if (project.id === id) {
          project.members=project.members.filter((mem) => mem!==member)
          }
          return project
        })
      })
      message.success("Đã xóa thành viên khỏi dự án!");
    } else{
      
      message.error("Có lỗi xảy ra, xin vui lòng thử lại!");
    }

  }, []);

  return { listProject, editProject, removeProject,addProject, setListProject,addMember,deleteMemberProject}

};
