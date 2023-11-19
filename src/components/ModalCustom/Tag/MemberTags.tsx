import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Select, Tag } from 'antd';
import React from 'react';
import AddMemberPopover from '../Popover/AddMemberPopover';
import { User } from '@/api/auth';
import api from '@/api';
const options = [{ value: 'gold' }, { value: 'lime' }, { value: 'green' }, { value: 'cyan' }];

const tagRender : React.FC<any>= (props: CustomTagProps) => {
  const { label, value, closable, onClose } = props;
  const [user, setUser] = React.useState<any[]|null>(null);
  React.useEffect(() =>{
    const getUserInfo=async()=>{
       const user= await api.authApi.findByEmail(label)
       console.log("hello",user)
      setUser(user)
    }
    getUserInfo()

  },[])
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3,
      padding:'2px 4px' }}
      icon={<Avatar size={18} src={user?.photoURL}></Avatar>}
    >

      {user?.displayName}
    </Tag>
  );
};
export type InputType = {
  tags: string[];
  setTags: (tags: string[]) => void;
  disabled?: boolean;
  members?:User[],
};

const MemberTags: React.FC<InputType> = ({ tags, setTags, disabled=false,members}) => {
  const [modifiedTags, setModifiedTags] = React.useState<User[]|null>(null);
  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };

  React.useEffect(() => {
    const getTagInfo = async () => {
      if(tags.length === 0)
        setModifiedTags([]);
      const users = await api.authApi.getUsersByEmail(tags);
      if(users)
        setModifiedTags(users);
    }
    getTagInfo();
  }, [tags])

 

  return (
    <>
      {modifiedTags && modifiedTags.map((tag) => {
        const tagElem = (
          <Tag
            closable={!disabled}
            onClose={(e) => {
              e.preventDefault();
              handleClose(tag.email);
            }}
            style={
              {
              padding:'2px 4px'
              }
            }
            icon={<Avatar size={18} src={tag?.photoURL}></Avatar> }
          >
            {tag.displayName}
          </Tag>
        );
        return (
          <span key={tag.email} style={{ display: 'inline-block' }}>
            {tagElem}
          </span>
        );
      })}
      {!disabled && (
        <AddMemberPopover tags={tags} setTags={setTags} members={members}>
          <Tag style={{ cursor:'pointer' }}>
            Thêm
          </Tag>
        </AddMemberPopover>
      )}
     
    </>
  );
};

export default MemberTags;