import api from '@/api';
import { Task } from '@/api/task';
import ModalCustom from '@/components/ModalCustom';
import { getDate, getDayPeriod, isOverdue } from '@/utils';
import { AimOutlined, CheckOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Link, useModel } from '@umijs/max';
import { Avatar, Button, Divider, Empty, List, Space, Image } from 'antd';
import { useEffect, useState } from 'react';
import TaskComponent from './Task';
import './home.css';
import TaskDetailModal from '@/components/ModalCustom/TaskDetailModal';
import CustomAvatar from '@/components/CustomAvatar';
// type ChildProps = {
//     email: string[]
// }
// const CustomAvatar: React.FC<ChildProps> = ({ email }) => {
//     const [users, setUsers] = useState<any>([])
//     const test = async (email) => {
//         const member = await api.authApi.getUsersByEmail(email);
//         setUsers(member);
//     }
//     useEffect(() => {
//         (test(email))
//     }, []);
//     if (users) return <>{users.map((user, id) => (<Tooltip key={id} title={user.name} placement="top">
//         <Avatar style={{ backgroundColor: '#87d068' }} src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=4" />
//     </Tooltip>))}</>
//     return <></>
// }
const Home: React.FC = () => {
    const { initialState } = useModel('@@initialState');
    const { currentUser } = initialState || {};

    const { listTask, addTask, setListTask } = useModel('listTask');
    const { listProject, addProject, setListProject } = useModel('project');
    useEffect(() => {
        const getMyTasks = async () => {
            if (!currentUser?.email) return;
            const tasks = await api.taskApi.getMyTasks(currentUser.email);
            if (tasks) setListTask(tasks);
        };
        const getMyProjects = async () => {
            if (!currentUser?.email) return;
            let projects = await api.projectApi.getMyProjects(currentUser.email);

            if (projects) {

                setListProject(projects);
            }
        };
        getMyTasks();
        getMyProjects();
    }, []);
    const doingTask = listTask
        .filter((task: Task) => task.status === 2 && !isOverdue(task))
    const todoTask = listTask
        .filter((task: Task) => task.status === 1 && !isOverdue(task))
    console.log("projects", listProject)
    const doneTask = listTask
        .filter((task: Task) => task.status === 3)

    const overdueTask: Task[] = listTask
        .filter((task: Task) => isOverdue(task))
    const tasksInWeek = (tasks: Task[]) => {
        const currentDate = new Date();
        const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
        const endOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6));

        // Bước 2: Lọc danh sách các Task trong tuần này
        const tasksInCurrentWeek = tasks.filter(task => {
            const taskStartTime = new Date(task.startTime);
            const taskEndTime = new Date(task.endTime);
            const currentDate = new Date();
            if (currentDate >= taskEndTime && task.status !== 3) {
                return false;
            }
            return taskStartTime >= startOfWeek || taskEndTime <= endOfWeek;
        });

        return tasksInCurrentWeek
    }



    return (
        <PageContainer pageHeaderRender={false}>
            <ProCard headerBordered title="Trang chủ">
                <Space align="center" direction="vertical" style={{ width: '100%' }}>
                    <h3>{getDate()}</h3>
                    <h4>{` Chào ${getDayPeriod()}, ${currentUser?.displayName}`}</h4>

                    <Space className="home-count" size={32} align="center">
                        <div>Tuần này</div>
                        <Divider
                            type="vertical"
                            style={{ height: '36px', margin: 0, padding: '8px 0' }}
                        ></Divider>
                        <div className="done">
                            <CheckOutlined /> {tasksInWeek(doneTask).length} Đã hoàn thành
                        </div>
                        <div className="doing">
                            {' '}
                            <FieldTimeOutlined /> {tasksInWeek(doingTask).length} Đang thực hiện
                        </div>
                        <div className="do">
                            {' '}
                            <AimOutlined /> {tasksInWeek(todoTask).length} Chưa làm
                        </div>

                    </Space>
                </Space>
            </ProCard>
            <ProCard gutter={[16, 16]}>
                <ProCard
                    colSpan={14}
                    tabs={{
                        type: 'line',
                    }}
                    title="Nhiệm vụ của tôi"
                    // extra={<ModalCustom key={1} type="task-create" />}
                    bordered
                >
                    <ProCard.TabPane key="overdue" tab="Quá hạn">
                        <Space direction="vertical" className="list-task">
                            {overdueTask.length > 0 ? overdueTask.map((task: Task) =>
                                <TaskComponent key={task.id} task={task} />
                            ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                        </Space>
                    </ProCard.TabPane>
                    <ProCard.TabPane key="do" tab="Chưa thực hiện">
                        <Space direction="vertical" className="list-task">
                            {todoTask.length > 0 ? todoTask.map((task: Task) =>
                                <TaskComponent key={task.id} task={task} />
                            ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                        </Space>
                    </ProCard.TabPane>
                    <ProCard.TabPane key="doing" tab="Đang thực hiện" style={{ padding: 0 }}>
                        <Space direction="vertical" className="list-task">
                            {doingTask.length > 0 ? doingTask.map((task: Task) =>
                                <TaskComponent key={task.id} task={task} />
                            ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                        </Space>
                    </ProCard.TabPane>
                    <ProCard.TabPane key="done" tab="Hoàn thành">
                        <Space direction="vertical" className="list-task">
                            {doneTask.length > 0 ? doneTask.map((task: Task) =>
                                <TaskComponent key={task.id} task={task} />
                            ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                        </Space>
                    </ProCard.TabPane>
                </ProCard>
                <ProCard
                    colSpan={10}
                    title="Dự án của tôi"
                    extra={
                        <ModalCustom key={1} type="project-create" />
                    }
                    bordered
                    headerBordered
                >
                    <List
                        dataSource={listProject}
                        itemLayout="horizontal"
                        pagination={{
                            onChange: (page) => {
                                console.log(page);
                            },
                            pageSize: 5,
                        }}
                        renderItem={(project, id) => (
                            <Link to={`/project/${project.id}`}>
                                <List.Item
                                    key={id}
                                    extra={

                                        <CustomAvatar email={project.members}></CustomAvatar>
                                    }
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Image preview={false} width={40}
                                                height={40} src="https://cdn.memiah.co.uk/blog/wp-content/uploads/counselling-directory.org.uk/2019/04/shutterstock_1464234134-1024x684.jpg" />
                                        }
                                        title={project.name}
                                        description={project?.description}
                                    />
                                </List.Item>
                            </Link>
                        )}
                    ></List>
                    {/* <Row>

                    <Col>
                        Image nhóm
                    </Col>
                    <Col>
                    </Col>
                    <Col>
                        <Avatar.Group maxCount={1} maxStyle={{ color: '#fff', backgroundColor: '#7942fe' }}>
                            <Tooltip title="Ant User" placement="top">
                                <Avatar style={{ backgroundColor: '#87d068' }} src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=3" />
                            </Tooltip>
                            <Tooltip title="Ant User" placement="top">
                                <Avatar style={{ backgroundColor: '#87d068' }} src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=4" />
                            </Tooltip>
                        </Avatar.Group>
                    </Col>
                </Row> */}
                </ProCard>
            </ProCard>
        </PageContainer>
    );
};

export default Home;
