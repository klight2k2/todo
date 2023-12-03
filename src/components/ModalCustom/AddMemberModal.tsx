import api from '@/api';
import { User } from '@/api/auth';
import { CloseCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useModel, useParams } from '@umijs/max';
import { Avatar, Button, Divider, Input, List, Modal, Space, message } from 'antd';
import React, { useEffect, useState } from 'react';

export type CustomType = {
  children: React.ReactNode;

}


const AddMemberModal: React.FC<CustomType> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [members, setMembers] = useState<User[]>([]);
  const [checkAdd, setCheckAdd] =useState(false);
  const [currentProject, setCurrentProject] =useState()
  const params=useParams();
  const {listProject,addComment,deleteMemberProject}= useModel('project')
  useEffect(()=>{
    const getProjectDetail= async(id:string)=>{
        const project= await api.projectApi.get(id);
        console.log("hello project",project)
        if (project?.members){
          const mem = await api.authApi.getUsersByEmail(project.members);
          console.log("get mem",mem)
          setMembers(mem);
        }
        setCurrentProject(project)

    }
    getProjectDetail(params.id)
  },[checkAdd])


  const hanldeDeleteMember = async (deleteEmail:string) => {
    if(deleteEmail)
    await deleteMemberProject(deleteEmail,params.id);
    setCheckAdd((value)=>!value)

  }

  const handleAddMember = async () => {
    const mem= await api.authApi.findByEmail(inviteEmail);
    if(mem){
        await addComment(params.id,inviteEmail)
        // setMembers([]);
        // emailMembers=emailMembers?.filter(member=>member!=inviteEmail)
        setCheckAdd((value)=>!value)
    }else{
      message.error("Không tìm thấy người dùng!")
    }
  }

  const showModal = () => {
    setOpen(true);
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
        title="Thành viên"
        open={open}
        onCancel={handleCancel}
        bodyStyle={{ borderTop: 'solid 1px #000000', paddingTop: '12px' }}
        footer={null}
      >
        <Space.Compact style={{ width: '100%' }}>
          <Input placeholder="Nhập email người muốn mời..." value={inviteEmail} onChange={(e) => {setInviteEmail(e.target.value)}}/>
          {/* Gợi ý người dùng khi nhập xog mail */}
          <Button onClick={handleAddMember}>Mời</Button>
        </Space.Compact>
        <Divider/>
        <List
          itemLayout='horizontal'
          size='small'
          dataSource={members}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined/>}/>}
                title={item.name}
                description={item.email}
              />
              {item.email=== currentProject?.creator? (
                <div>Người tạo</div>
              ) : (
                <Space>
                  <div>Thành viên</div>
                  <Button onClick={()=>hanldeDeleteMember(item.email)} icon={<CloseCircleOutlined />}>


                  </Button>
                </Space>
              )}
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default AddMemberModal;
