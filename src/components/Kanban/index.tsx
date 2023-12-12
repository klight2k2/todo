import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ProCard } from "@ant-design/pro-components";
import { Avatar, Button, Col, Popconfirm, Row, Select, Space, Tag, Tooltip } from "antd";
import CustomTag from "@/components/CustomTag";
import { DeleteOutlined } from "@ant-design/icons";
import { useModel } from "@umijs/max";
import { DEFAULT_AVATAR, getAvatar, priorityOptions, typeOptions } from "@/components/ModalCustom/Options";
import './kanban.css'
import Search from "antd/es/input/Search";
import TaskDetailModal from "../ModalCustom/TaskDetailModal";
import { isOverdue } from "@/utils";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "white" : "white",

  // styles we need to apply on draggables
  ...draggableStyle
});
const getListStyle = (isDraggingOver: any) => ({
  // background: isDraggingOver ? "#efe9ff" : "rgb(235 236 240)",
  padding: grid,
  // transition: 'background-color 0.2s ease',
  width: "100%"
});


const Group: React.FC = () => {
  const [state, setState] = useState({
    todo: [],
    doing: [],
    done: []
  });
  const { listTask, editTask, removeTask } = useModel('listTask')
  const [searchData, setSearchData] = useState('')
  const [orderBy, setOrder] = useState(false)

  const listTable = [{ title: 'Chưa thực hiện', key: 'todo', color: '#FFFDF1' },
  { title: 'Đang thực hiện', key: 'doing', color: '#FFF1F1' },
  { title: 'Đã hoàn thành', key: 'done', color: '#F5FFF1' },]

  useEffect(() => {
    let todoTask = []
    let doingTask = []
    let doneTask = []
    listTask.sort((a, b) => {
      if (orderBy) {
        return b.priority - a.priority
      } else {
        return a.priority - b.priority
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
          todoTask.push(task)
        } else if (task.status === 2) {
          doingTask.push(task)
        } else {
          doneTask.push(task)
        }
      }
    })
  
    setState({
      todo: todoTask,
      doing: doingTask,
      done: doneTask
    })

  }, [listTask, searchData, orderBy])
  function onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    const sInd = source.droppableId;
    const dInd = destination.droppableId;


    if (sInd === dInd) {
      const column = state[sInd]
      const [removed] = column.splice(source.index, 1);
      column.splice(destination.index, 0, removed);
      setState({
        ...state,
        [sInd]: column,
      });
    } else {
      const srcColumn = state[sInd];
      const destColumn = state[dInd];
      const [removed] = srcColumn.splice(source.index, 1);
      destColumn.splice(destination.index, 0, removed);
      editTask({ ...removed, status: dInd === 'todo' ? 1 : dInd === 'doing' ? 2 : 3 })
      setState({
        ...state,
        [sInd]: srcColumn,
        [dInd]: destColumn
      })
    }
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
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

      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={[16, 16]}>

          {listTable.map((lane, ind) => {
            const el = state[lane.key];
            return (
              <Col span={8} key={ind} >
                <Droppable key={ind} droppableId={`${lane.key}`} className='d-flex'>
                  {(provided, snapshot) => (
                    <ProCard
                      title={<div>{`${lane.title} `} <Tag color="purple">{el.length}</Tag></div>}
                      bodyStyle={
                        {
                          padding: 0,
                          minHeight: '500px',
                          overflowY: 'auto',
                          maxHeight: '500px'
                        }
                      }
                      headStyle={{ padding: 0, marginBottom: 4 }}
                      ref={provided.innerRef}
                      style={{ ...getListStyle(snapshot.isDraggingOver), backgroundColor: `${lane.color}`, borderRadius: '12px' }}
                      {...provided.droppableProps}
                      key={ind}
                    >
                      {el.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <TaskDetailModal task={item}>

                              <ProCard
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  ), backgroundColor: '#EFE9FF', borderRadius: '12px'
                                }}
                                bodyStyle={{
                                  padding: 0,
                                }}
                                key={item.id}
                              >
                                <Space
                                  direction="vertical"
                                  style={{ width: '100%' }}
                                >
                                  <h4>{item.name}</h4>
                                  <span>{item?.description}</span>
                                  <div>

                                    <CustomTag content={priorityOptions[item.priority - 1]?.label} />
                                    {
                                      item?.tags?.map(tag => <CustomTag content={tag} />)
                                    }
                                    {isOverdue(item) && <CustomTag content="overdue" color='#c1beb9' />}
                                    {/* <CustomTag content={typeOptions[item.type - 1]?.label}></CustomTag> */}
                                  </div>
                                  <div className="d-flex justify-between">
                                    <Space>
                                      <Tooltip title={item.assignee}>

                                        <Avatar src={getAvatar(item.assignee) || DEFAULT_AVATAR} size={24} />
                                      </Tooltip>
                                      Deadline: {item.endTime.replaceAll("-", "/").split(" ")[0]}
                                    </Space>
                                    <Popconfirm
                                      title="Xoá công việc"
                                      description="Bạn có chắc muốn xóa công việc này chứ"
                                      onConfirm={(e) => {
                                        e?.stopPropagation()
                                        removeTask(item.id)
                                      }}
                                      okText="Xóa"
                                      onCancel={
                                        (e) => {
                                          e?.stopPropagation()
                                        }
                                      }
                                      cancelText="Hủy"
                                    >
                                      <Button
                                        size="small"
                                        onClick={(e) => e.stopPropagation()}

                                        danger icon={<DeleteOutlined />}
                                        style={{ borderRadius: '8px' }}
                                      >
                                      </Button>
                                    </Popconfirm>
                                  </div>
                                </Space>
                              </ProCard>
                            </TaskDetailModal>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ProCard>
                  )}
                </Droppable>
              </Col>
            )
          })}
        </Row>
      </DragDropContext>
    </Space>
  );
}

export default Group;
