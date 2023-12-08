import { DatePicker, Form, Input, Modal, Select, Tag } from 'antd';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import React, { useState } from 'react';
import CategoryTags from './Tag/CategoryTags';
import MemberTags from './Tag/MemberTags';
import { priorityOptions, statusOptions } from './Options';
import { useModel } from '@umijs/max';
import { User } from 'mock/data_type';
import api from '@/api';
import { auth } from '@/firebase';

export type CustomType = {
  children: React.ReactNode;
  projectId: string;
  projectName?: string;
}

const TaskCreateModal: React.FC<CustomType> = ({ children,projectId="private", projectName="Cá nhân"}) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [name, setName] = useState<string>('');
  const [assignee, setAssignee] = useState<string[]>([]);
  const [assigner, setAssigner] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [priority, setPriority] = useState<number>(1);
  const [status, setStatus] = useState<number>(1);

  const [description, setDescription] = useState<string>('');

  const [members,setMembers] = useState<User[]>([]);
  const { addTask } = useModel('listTask');
  
  const fetchMembers=async ()=>{
    let mems:any=await api.projectApi.getMembers(projectId);
    mems=await api.authApi.getUsersByEmail(mems);
    setMembers(mems as User[]);
  }
  React.useEffect(() => {
    setName('');
    // setType(1);
    setTags([]);
    setStartTime('');
    setEndTime('');
    setPriority(1);
    setStatus(1);
    setDescription('');
    fetchMembers()
    const user = auth.currentUser;
    if(user?.email) {
      setAssigner(user.email);
      setAssignee([user.email]);
    }
  }, [open]);
  
  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    console.log(form.submit());
    
  };
  const onFinish = async () => {
    setConfirmLoading(true);
    const data = {
      name,
      assignee,
      assigner,
      tags,
      startTime,
      endTime,
      priority,
      status,
      description,
      comments:[],
      projectId,
      projectName
    };
    
    const res = await addTask(data);
    setOpen(false);
    setConfirmLoading(false);
  };
  
  const onFinishFailed = () => {
    // message.error('Submit failed!');
  };
  const [form] = Form.useForm();
  const handleCancel = () => {
    setOpen(false);
  };
  const onTimeChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: string,
    name: string,
  ) => {
    switch (name) {
      case 'begin':
        setStartTime(dateString);
        break;
      case 'end':
        setEndTime(dateString);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <span onClick={showModal}>
        {children}
      </span>
      <Modal
        title="Tạo công việc"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}

        bodyStyle={{ borderTop: 'solid 1px #000000', paddingTop: '12px' }}
      >
        <Form
        form={form}
          name="project-create"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Tên công việc"
            name="name"
            rules={[{ required: true, message: 'Hãy nhập tên công việc' }]}
          >
            <Input
              placeholder="Tên công việc..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item label="Dự án" name="type">
            <Tag>{projectName}</Tag>
          </Form.Item>
          <Form.Item label="Người thực hiện" name="assignee">
            <MemberTags
              members={members}
              tags={assignee}
              setTags={(tags) => {
                setAssignee(tags);
              }}
              disabled={projectId === "private"}
            />
          </Form.Item>
          <Form.Item label="Người tạo">
            <Tag>{assigner}</Tag>
          </Form.Item>
          <Form.Item label="Nhóm công việc">
            <CategoryTags
              tags={tags}
              setTags={(tags) => {
                setTags(tags);
              }}
              disabled={false}
            />
          </Form.Item>
          <Form.Item label="Ngày bắt đầu" name="startDate"   rules={[{ required: true, message: 'Hãy chọn ngày bắt đầu công việc' }]}>
            <DatePicker
              showTime
              onChange={(val, date) => {
                onTimeChange(val, date, 'begin');
              }}
            />
          </Form.Item>
          <Form.Item label="Ngày hết hạn" name="endDate" rules={[{ required: true, message: 'Hãy chọn ngày hết hạn của công việc' }]}>
            <DatePicker
              showTime
              onChange={(val, date) => {
                onTimeChange(val, date, 'end');
              }}
            />
          </Form.Item>
          <Form.Item label="Độ ưu tiên" name="priority" rules={[{ required: true, message: 'Hãy chọn độ ưu tiên công việc' }]}>
            <Select 
              value={priority}
              options={priorityOptions}
              onChange={(val) => {setPriority(val)}}
            />
          </Form.Item>
          <Form.Item label="Trạng thái">
            <Select 
              value={status}
              options={statusOptions} 
              disabled 
              onChange={(val) => {setStatus(val)}}
            />
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

export default TaskCreateModal;