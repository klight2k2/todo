import { CheckOutlined, EditOutlined, StopOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, DatePicker, Descriptions, Divider, Form, Input, List, Modal, Row, Select, Space, Tag, Tooltip } from 'antd';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import React, { useState } from 'react';
import CategoryTags from './Tag/CategoryTags';
import MemberTags from './Tag/MemberTags';
import { DEFAULT_AVATAR, getAvatar, priorityOptions, rateOptions, statusOptions, typeOptions } from './Options';
import { Comment, Task } from '@/api/task';
import dayjs from 'dayjs';
import { useModel } from '@umijs/max';
import api from '@/api';
import { User } from '@/api/auth';

export type CustomType = {
  task: Task,
  children: React.ReactNode;
}

const TaskDetailModal: React.FC<CustomType> = ({ task, children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(task?.name);
  const [assignee, setAssignee] = useState<string[]>(task?.assignee);
  const [assigner, setAssigner] = useState<string>(task?.assigner);
  const [tags, setTags] = useState<string[]>(task?.tags||[]);
  const [startTime, setStartTime] = useState<string>(task?.startTime);
  const [endTime, setEndTime] = useState<string>(task?.endTime);
  const [priority, setPriority] = useState<number>(task?.priority);
  const [status, setStatus] = useState<number>(task?.status);
  const [description, setDescription] = useState<string>(task?.description);
  const [comments, setComments] = useState<Comment[]>(task?.comments||[])
  const [curCmt, setCurCmt] = useState<string>('');
  const [rate, setRate] = useState<string>(task?.rate ||'');
  const [members, setMembers] = useState<User[]>([]);

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const { editTask, addComment, listTask } = useModel('listTask');

  React.useEffect(() => {
    const getProjectMembers = async () => {
      const emails = await api.projectApi.getMembers(task.projectId)
      const users = await api.authApi.getUsersByEmail(emails)
      if(users)
        setMembers(users)
    }
    getProjectMembers()
  }, []);

  const showModal = () => {
    setOpen(true);
  };

  const getTaskData = () => {
    const data = {
      id: task.id,
      name,
      assignee,
      assigner,
      tags,
      startTime,
      endTime,
      priority,
      status,
      description,
      comments,
      rate,
      projectId:task?.projectId || "private",
      projectName: task.projectName
    };
    return data as Task;
  }

  const handleConfirmEdit = async () => {
    const data = getTaskData();
    const res = await editTask(data);
    setDisabled(true);
  };

  const handleMarkAsDone = async () => {
    const data = getTaskData();
    data.status = 3;
    const res = await editTask(data);
    setDisabled(true);
  }

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

  const handleAddMessage = async () => {
    console.log("Add message");
    
    if(curCmt && currentUser?.email && task?.id) {
      const curCmtDetail: Comment = {
        email: currentUser.email,
        photoURL: currentUser.photoURL,
        content: curCmt,
        timestamp: new Date().toISOString(),
      }
      const res = await addComment(task.id, curCmtDetail);
      setCurCmt('');
      // setComments([curCmtDetail, ...comments]);
    }
  }

  const Title = () => {
    return disabled ? (
      <Space>
        <Button
          icon={<EditOutlined/>}
          size='small'
          onClick={() => {setDisabled(false)}}
        >
          Chỉnh sửa công việc
        </Button>
        <Button
          icon={<CheckOutlined/>}
          size='small'
          onClick={handleMarkAsDone}
          disabled={status === 3}
        >
          Đánh dấu đã hoàn thành
        </Button>
      </Space>
    ) : (
      <Space>
        <Button
          icon={<StopOutlined/>}
          size='small'
          onClick={() => {setDisabled(true)}}
        >
          Hủy chỉnh sửa
        </Button>
        <Button
          icon={<CheckOutlined/>}
          size='small'
          onClick={handleConfirmEdit}
        >
          Xác nhận
        </Button>
      </Space>
    )
  }

  return (
    <>
      <span onClick={showModal}>
        {children}
      </span>
      <Modal
      footer={null}
        title={<Title />}
        open={open}
        onOk={handleCancel}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        bodyStyle={{ borderTop: 'solid 1px #000000', paddingTop: '12px' }}
      >
        {disabled ? (
          <>
            <Descriptions title={name} column={1}>
              <Descriptions.Item label='Dự án'>{task.projectName}</Descriptions.Item>
              <Descriptions.Item label='Người thực hiện'>
                {assignee?.map((mem) => <Tag className='mt-8' icon={<UserOutlined/>} key={mem}>{mem}</Tag>)}
              </Descriptions.Item>
              <Descriptions.Item label='Người tạo'>
                <Tag icon={<UserOutlined/>}>{assigner}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label='Nhóm công việc'>
                {tags.map((cat) => <Tag key={cat}>{cat}</Tag>)}
              </Descriptions.Item>
              <Descriptions.Item label='Ngày bắt đầu'>{startTime.replaceAll("-","/").replaceAll(" "," - ")}</Descriptions.Item>
              <Descriptions.Item label='Ngày hết hạn'>{endTime.replaceAll("-","/").replaceAll(" "," - ")}</Descriptions.Item>
              <Descriptions.Item label='Độ ưu tiên'>{priorityOptions[priority-1]?.label}</Descriptions.Item>
              <Descriptions.Item label='Trạng thái'>{statusOptions[status-1]?.label}</Descriptions.Item>
              <Descriptions.Item label='Mô tả'>{description}</Descriptions.Item>
              <Descriptions.Item label='Đánh giá'>{rate}</Descriptions.Item>
            </Descriptions>
            <Space direction='vertical' style={{ width:'100%' }}>
              <Divider orientation='left'>Nhận xét</Divider>
              <div style={{ padding:'0 2px', border:'solid 1px #e4e6eb', borderRadius:'4px' }}>
                <List
                  itemLayout='horizontal'
                  style={{ overflowY:'scroll', maxHeight:'150px' }}
                  size='small'
                  dataSource={listTask.find((t) => t?.id === task?.id)?.comments || []}
                  renderItem={(item) => (
                    <List.Item style={{ border:'none' }}>
                      <List.Item.Meta
                        avatar={<Tooltip title={item.email} placement='bottom'><Avatar src={getAvatar(item.email) || DEFAULT_AVATAR}/></Tooltip>}
                        description={<div style={{ backgroundColor:'#e4e6eb', padding:'8px 12px', borderRadius:'12px', color:'#000', width:'fit-content' }}>{item.content}</div>}
                      />
                    </List.Item>
                  )}
                >
                  
                </List>
              </div>
              <Row justify='space-between'>
                <Col span={2}>
                  <Avatar src={currentUser?.photoURL || DEFAULT_AVATAR} />
                </Col>
                <Col span={19}>
                  <Input
                    placeholder='Tin nhắn mới...'
                    value={curCmt}
                    onChange={(e)=>{setCurCmt(e.target.value)}}
                  />
                </Col>
                <Col span={2}>
                  <Button onClick={handleAddMessage}>Gửi</Button>
                </Col>
              </Row>
            </Space>
          </>
        ) : (
          <Form
            name="project-create"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            autoComplete="off"
          >
            <Form.Item
            name="name"
              label="Tên công việc"
              rules={[{ required: true, message: 'Hãy nhập tên công việc' }]}
            >
              <Input
                placeholder="Tên công việc..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                defaultValue={name}
              />
            </Form.Item>
            <Form.Item label="Dự án" name="type">
              <Tag>{task.projectName}</Tag>
            </Form.Item>
            <Form.Item label="Thành viên">
              <MemberTags
                tags={assignee}
                setTags={(tags) => {
                  setAssignee(tags);
                }}
                members={members}
                disabled={task.projectId === "private"}
              />
            </Form.Item>
            <Form.Item label="Người tạo" name="creator">
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
            <Form.Item label="Ngày bắt đầu" name="startDate" rules={[{ required: true, message: 'Hãy chọn ngày bắt đầu công việc' }]}>
              <DatePicker
                showTime
                onChange={(val, date) => {
                  onTimeChange(val, date, 'begin');
                }}
                defaultValue={startTime?dayjs(startTime) :dayjs(new Date().toISOString())}
              />
            </Form.Item>
            <Form.Item label="Ngày hết hạn" name="endDate" rules={[{ required: true, message: 'Hãy chọn ngày hết hạn của công việc' }]}>
              <DatePicker
                showTime
                onChange={(val, date) => {
                  onTimeChange(val, date, 'end');
                }}
                defaultValue={endTime?dayjs(endTime)  : dayjs(new Date().toISOString())}
              />
            </Form.Item>
            <Form.Item label="Độ ưu tiên" name="priority" rules={[{ required: true, message: 'Hãy chọn độ ưu tiên công việc' }]}>
              <Select
                value={priority}
                options={priorityOptions}
                onChange={(val) => {setPriority(val)}}
                defaultValue={priority}

              />
            </Form.Item>
            <Form.Item label="Trạng thái" >
              <Select
                value={status}
                options={statusOptions}
                onChange={(val) => {setStatus(val)}}
                defaultValue={status}

              />
            </Form.Item>
            <Form.Item label="Mô tả" >
              <Input.TextArea
                rows={2}
                placeholder="Mô tả dự án..."
                maxLength={200}
                value={description}
                defaultValue={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  
                }}
              />
            </Form.Item>
            <Form.Item label="Đánh giá">
            <Select
                value={rate}
                options={rateOptions}
                onChange={(val) => {setRate(val)}}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default TaskDetailModal;
