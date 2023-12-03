import CustomTag from '@/components/CustomTag';
import Kanban from '@/components/Kanban';
import { DeleteOutlined, ShareAltOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Avatar, Button, Col, Collapse, CollapseProps, Row, Space, Image, Popconfirm, Select } from 'antd';
import './projectDetail.css';
import Schedule from '@/components/Schedule';
import { useModel, useParams } from '@umijs/max';
import { Task } from '@/api/task'
import React, { useEffect, useState } from 'react'
import TaskDetailModal from '@/components/ModalCustom/TaskDetailModal';
import { DEFAULT_PROJECT_AVT, priorityOptions, typeOptions } from '@/components/ModalCustom/Options';
import ModalCustom from '@/components/ModalCustom';
import api from '@/api';
import Search from 'antd/es/input/Search';

type Childnode = {
  task: Task
}
const TaskLine: React.FC<Childnode> = ({ task }) => {
  const { removeTask } = useModel('listTask')

  return (
    <TaskDetailModal task={task}>
      <Row gutter={[16, 16]} align="middle" className="task">
        <Col span={11}>{task?.name}</Col>
        <Col span={6}>
          {task?.tags?.map((tag, id) => <CustomTag content={tag} key={id} />)}
          <CustomTag content={priorityOptions[task.priority - 1]?.label} />
        </Col>
        <Col span={5}> Deadline:{task?.endTime}</Col>

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


const ProjectDetail: React.FC = () => {
  const { listTask, removeTask, setListTask } = useModel('listTask')
  const [currentProject, setCurrentProject] = useState()
  const { listProject, addMember } = useModel('project')
  const [searchData, setSearchData] = useState('')
  const [orderBy,setOrder] = useState(false)
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
    if (searchData === '' || task.name.includes(searchData)) {

      if (task.status === 1) {
        todoTask.push(<TaskLine task={task}></TaskLine>)
      } else if (task.status === 2) {
        doingTask.push(<TaskLine task={task}></TaskLine>)
      } else {
        doneTask.push(<TaskLine task={task}></TaskLine>)
      }
    }

  })
  const params = useParams();
  useEffect(() => {
    const getProjectDetail = async (id: string) => {
      const project = await api.projectApi.get(id);
      const tasks = await api.taskApi.getByProject(id)
      console.log("project detail", project)
      console.log("project detail", tasks)
      setListTask(tasks)
      setCurrentProject(project)

    }
    getProjectDetail(params.id)
  }, [listProject])

  console.log("memberr", currentProject?.members)

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
            <Image preview={false} height={40} width={40} src={currentProject?.avatar || DEFAULT_PROJECT_AVT} />
            <span className='ml-16'>{currentProject?.name}</span>
          </div>
        }
        extra={
          <Space>
            <ModalCustom type='add-member' />
            <ModalCustom type='task-create' projectId={params.id} projectName={currentProject?.name} />
          </Space>
        }
        tabs={{
          type: 'line',
        }}
      >
        <ProCard.TabPane key="list" tab="Danh sách">
          <Space direction='vertical' style={{ width: '100%' }}>
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
      onChange={(e)=>{
        console.log(e)
        setOrder(e)}}
      options={[{ value: true, label: 'Cao xuống thấp'},{ value: false, label: 'Thấp lên thấp'}]}
    />
            </Space>
            <Collapse items={items} defaultActiveKey={['1']}></Collapse>
          </Space>
        </ProCard.TabPane>
        <ProCard.TabPane key="board" tab="Bảng">
          <Kanban></Kanban>
        </ProCard.TabPane>
        <ProCard.TabPane key="calendar" tab="Lịch">

          <Schedule></Schedule>
        </ProCard.TabPane>
      </ProCard>
    </PageContainer>
  );
};

export default ProjectDetail;
