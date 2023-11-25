import api from '@/api';
import { User } from '@/api/auth';
import { LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Input, List, Popover, Space } from 'antd';
import React from 'react';

export type CustomType = {
  tags: string[];
  setTags: (tags: string[]) => void;
  children?: React.ReactNode;
  members?:User[]
};

const AddMemberPopover: React.FC<CustomType> = ({ tags, setTags, children ,members}) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const [search,setSearch] = React.useState<string>('')

  const hide = () => setOpen(false);
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const content = (

        <List
          itemLayout='horizontal'
          size='small'
        >
          <Input onChange={(e)=>setSearch(e.target.value)}></Input>
          {
            members?.filter((member) => !tags.includes(member.email) && member.email.includes(search) ).map((member)=>{
              return   <List.Item
              style={{
                cursor: 'pointer'
              }}
              onClick={()=>{
                setTags([...tags, member.email])
                hide();
              }}
              >
              <List.Item.Meta
                avatar={<Avatar size={32} src={member?.photoURL} />}
                title={member.displayName}
                description={member.email}
                style={{ alignItems:'center' }}
              />

            </List.Item>
            }

            )
          }

        </List>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottom"
      open={open}
      onOpenChange={handleOpenChange}
    >
      {children}
    </Popover>
  );
};

export default AddMemberPopover;
