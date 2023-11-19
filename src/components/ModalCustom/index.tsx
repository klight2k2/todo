import React from 'react';
import TaskCreateModal from './TaskCreateModal';
import { Button } from 'antd';
import { EditOutlined, PlusOutlined, ShareAltOutlined, UserAddOutlined } from '@ant-design/icons';

type CustomType =
  | 'task-create'
  | 'task-detail'
export type ModalType = {
  type?: CustomType;
  projectId?: string;
  projectName?: string;
};

const ModalCustom: React.FC<ModalType> = ({ type ,projectId="private", projectName="Cá nhân"}) => {
  switch (type) {
    case 'task-create':
      return (
        <TaskCreateModal projectId={projectId} projectName={projectName}>
          <Button ghost type='primary' key="1" icon={<PlusOutlined />}> Tạo công việc</Button>
        </TaskCreateModal>
      );
    default:
      break;
  }
};

export default ModalCustom;
