import React, { useEffect, useState } from 'react'
import { DeleteOutlined, ShareAltOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Avatar, Button, Col, Collapse, CollapseProps, Popconfirm, Row, Select, Space, Tag } from 'antd';
import { useModel } from '@umijs/max';
import Search from 'antd/es/input/Search';
import './task.css';
import { Task } from '@/api/task'
import Schedule from '@/components/Schedule';
import Kanban from '@/components/Kanban';
import CustomTag from '@/components/CustomTag';
import TaskDetailModal from '@/components/ModalCustom/TaskDetailModal';
import { DEFAULT_AVATAR, priorityOptions, typeOptions } from '@/components/ModalCustom/Options';
import ModalCustom from '@/components/ModalCustom';
import api from '@/api';
import { isOverdue } from '@/utils';

type Childnode = {
  task: Task
}
const TaskLine: React.FC<Childnode> = ({ task }) => {
 
  const { removeTask } = useModel('listTask')

  return (
    <TaskDetailModal task={task}>
      <Row gutter={[16, 16]} align="middle"  className={"task"}>
        <Col span={11}>{task?.name}</Col>
        <Col span={6}>
          <CustomTag content={task.projectName} color='cyan' />
          {isOverdue(task)&& <CustomTag content="overdue" color='#c1beb9' />}
          <CustomTag  content={priorityOptions[task.priority - 1]?.label} />
          {task?.tags?.map((tag, id) => <CustomTag  content={tag} key={id} />)}

        </Col>
        <Col span={5}>Deadline: {task?.endTime.replaceAll("-","/").split(" ")[0]}</Col>

        <Col span={2} className="d-flex justify-center align-center">
          {' '}

          <Popconfirm
            title="Xoá công việc"
            description="Bạn có chắc muốn xóa công việc này chứ"
            onConfirm={(e) => {
              e?.stopPropagation()
              removeTask(task.id)
            }}
            okText="Xóa"
            cancelText="Hủy"
          >

            <Button danger icon={<DeleteOutlined />} onClick={(e) => {
              e.stopPropagation()
            }}></Button>
          </Popconfirm>
        </Col>
      </Row>
    </TaskDetailModal>
  )
}


const MyTask: React.FC = () => {
  const { listTask, setListTask } = useModel('listTask')
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [searchData, setSearchData] = useState('')
  const [orderBy,setOrder] = useState(false)

  useEffect(() => {
    const getMyTasks = async () => {
      if (!currentUser?.email) return;
      const tasks = await api.taskApi.getMyTasks(currentUser.email);
      if (tasks) setListTask(tasks);
    };
    getMyTasks()
  }, [])
  let todoTask = []
  let doingTask = []
  let doneTask = []
  listTask.sort((a,b)=>{
    if(orderBy){
      return b.priority-a.priority
    }else{
      return a.priority-b.priority
    }
  })
  listTask.forEach(task => {
    console.log(task)
    let tags:string[]=[...task.tags] ||[]
    tags.push(priorityOptions[task.priority - 1]?.label)
    tags.push(task.projectName)
    if(isOverdue(task)) tags.push("overdue"); 
    if (searchData === '' || task.name.toLowerCase().includes(searchData.toLowerCase()) || tags.some(tag=>tag.toLowerCase().includes(searchData.toLowerCase()))) {
      if (task.status === 1) {
        todoTask.push(<TaskLine task={task} key={task.id}></TaskLine>)
      } else if (task.status === 2) {
        doingTask.push(<TaskLine task={task} key={task.id}></TaskLine>)
      } else {
        doneTask.push(<TaskLine task={task} key={task.id}></TaskLine>)
      }
    }
  })

  console.log("listTask", listTask)

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Chưa thực hiện',
      children: (
        <Space className="list-task" direction="vertical">
          {todoTask}
        </Space>
      ),
    },
    {
      key: '2',
      label: 'Đang thực hiện',
      children: <Space className="list-task" direction="vertical">
        {doingTask}
      </Space>,
    },
    {
      key: '3',
      label: 'Đã hoàn thành',
      children: <Space className="list-task" direction="vertical">
        {doneTask}
      </Space>,
    },
  ];
  return (
    <PageContainer pageHeaderRender={false}>
      <ProCard
        title={
          <div>
            <Avatar src={currentUser?.photoURL || DEFAULT_AVATAR} />
            <span className="ml-16">Nhiệm vụ của tôi</span>
          </div>
        }
        extra={
          <Space>
            <ModalCustom type='task-create' />
            {/* <ModalCustom type='share' /> */}
          </Space>
        }
        tabs={{
          type: 'line',
        }}
      >
        <ProCard.TabPane key="list" tab="Danh sách">
          <Space direction='vertical' style={{width:'100%'}}>
          <Space>
            <Search
              placeholder="Nhập công việc bạn muốn tìm kiếm"
              allowClear
              onSearch={(searchValue) => setSearchData(searchValue)}
              style={{ width: 304 }}
            />
            <Select
              placeholder="Sắp xếp theo độ ưu tiên"
              allowClear
              style={{ width: 200 }}
              onChange={(e) => {
                console.log(e)
                setOrder(e)
              }}
              options={[{ value: true, label: 'Cao xuống thấp' }, { value: false, label: 'Thấp lên thấp' }]}
            />
          </Space>
          <Collapse items={items} defaultActiveKey={['1']}></Collapse>
            </Space>
        </ProCard.TabPane>
        <ProCard.TabPane key="board" tab="Bảng" >
          <Kanban></Kanban>
        </ProCard.TabPane>
        <ProCard.TabPane key="calendar" tab="Lịch">

          <Schedule></Schedule>
        </ProCard.TabPane>
      </ProCard>
    </PageContainer>
  );
};

export default MyTask;
