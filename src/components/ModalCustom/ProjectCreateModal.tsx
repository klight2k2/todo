import { Form, Input, Modal, Tag } from 'antd';
import React, { useState } from 'react';
import MemberTags from './Tag/MemberTags';
import api from '@/api';
import { User } from '@/api/auth';
import { Project } from '@/api/project';
import { useModel } from '@umijs/max';
import { auth } from '@/firebase';

export type CustomType = {
  children: React.ReactNode;
}

const ProjectCreateModal: React.FC<CustomType> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [name, setName] = useState<string>('');
  const [members, setMembers] = useState<string[]>([]);
  const [creator, setCreator] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [users, setUsers]= useState<User[]>([]);
  const fetchUsers=async ()=>{
    setUsers(await api.authApi.getAllUser())
  }
  const {addProject}= useModel('project')
  React.useEffect(() => {
    setName('');
    setDescription('');
    fetchUsers()
    const user = auth.currentUser;
    if(user?.email){
      setCreator(user.email);
      setMembers([user.email]);
    }

  }, [open]);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    const data: Project = {
      name,
      members,
      creator,
      description,
    };
    const res = await addProject(data);
    console.log(res);
    setOpen(false);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <span onClick={showModal}>
        {children}
      </span>
      <Modal
        title="Tạo dự án"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        bodyStyle={{ borderTop: 'solid 1px #000000', paddingTop: '12px' }}
      >
        <Form
          name="project-create"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
        >
          <Form.Item label="Tên dự án" rules={[{ required: true, message: 'Hãy nhập tên dự án' }]}>
            <Input
              placeholder="Tên dự án..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item label="Thành viên">
            <MemberTags
            members={users}
              tags={members}
              setTags={(tags) => {
                setMembers(tags);
              }}
            />
          </Form.Item>
          <Form.Item label="Người tạo">
            <Tag>{creator}</Tag>
          </Form.Item>
          <Form.Item label="Mô tả">
            <Input.TextArea
              rows={2}
              placeholder="Mô tả dự án..."
              maxLength={200}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProjectCreateModal;
