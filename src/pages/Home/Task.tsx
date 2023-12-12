import { Task } from "@/api/task";
import CustomTag from "@/components/CustomTag";
import { priorityOptions } from "@/components/ModalCustom/Options";
import TaskDetailModal from "@/components/ModalCustom/TaskDetailModal";
import { isOverdue } from "@/utils";
import { Col, Row } from "antd";

type CustomInput = {
  task: Task;
}

const TaskComponent: React.FC<CustomInput> = ({ task }) => {
 
  return (
    <TaskDetailModal task={task}>
      <Row gutter={[16, 16]} align="middle" className={isOverdue(task)?"task overdue":"task"} >
          <Col span={12}>{task.name}</Col>
          <Col span={6}>{task.endTime.split(' ')[0].replaceAll("-", "/")}</Col>
          <Col span={6} className="d-flex justify-center align-center" >  <CustomTag content={priorityOptions[task.priority-1].label}/></Col>
      </Row>
    </TaskDetailModal>
  )
}


export default TaskComponent;