import React from 'react';
import ProjectCreateModal from './ProjectCreateModal';
import TaskCreateModal from './TaskCreateModal';
import TaskDetailModal from './TaskDetailModal';
import { Button } from 'antd';
import { PlusOutlined, ShareAltOutlined, UserAddOutlined } from '@ant-design/icons';
import AddMemberModal from './AddMemberModal';

type CustomType =
  | 'project-create'
  | 'task-create'
  | 'task-detail'
  | 'add-member';
export type ModalType = {
  type?: CustomType;
  projectId?: string;
  projectName?: string;
};

const ModalCustom: React.FC<ModalType> = ({ type ,projectId="private", projectName="Cá nhân"}) => {
  switch (type) {
  
    case 'project-create':
      return (
        <ProjectCreateModal>
          <Button ghost type='primary' key="1" icon={<PlusOutlined />}> Tạo dự án</Button>
        </ProjectCreateModal>
      );
    case 'task-create':
      return (
        <TaskCreateModal projectId={projectId} projectName={projectName}>
          <Button ghost type='primary' key="2" icon={<PlusOutlined />}> Tạo công việc</Button>
        </TaskCreateModal>
      );
    case 'add-member':
      return (
        <AddMemberModal  >
          <Button ghost type='primary' key="3" icon={<UserAddOutlined />}> Thêm thành viên</Button>
        </AddMemberModal>
      );
    default:
      break;
  }
};

export default ModalCustom;
