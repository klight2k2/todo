import { PageContainer, ProCard } from '@ant-design/pro-components';
import './group.css';

import { Avatar, Button, Image, List, Popconfirm, Space, Tooltip } from 'antd';
import { Link, useModel } from '@umijs/max';
import { useEffect, useState } from 'react';
import api from '@/api';
import CustomAvatar from '@/components/CustomAvatar';
import ModalCustom from '@/components/ModalCustom';
import { DEFAULT_PROJECT_AVT } from '@/components/ModalCustom/Options';
import Search from 'antd/es/input/Search';
import { DeleteOutlined } from '@ant-design/icons';

export default function index() {
  // const listProject = [
  //   {
  //     title: 'UI/UX',
  //     members: [
  //       {
  //         name: 'Quân Vũ',
  //         avatar:
  //           'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/3b/3bfa8ba0fbdc979020fde30dc727b5a5e85dd6e3.jpg',
  //       },
  //       {
  //         name: 'Đào Minh',
  //         avatar:
  //           'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/3b/3bfa8ba0fbdc979020fde30dc727b5a5e85dd6e3.jpg',
  //       },
  //     ],
  //   },
  //   {
  //     title: 'UI/UX',
  //     members: [
  //       {
  //         name: 'Quân Vũ',
  //         avatar:
  //           'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/3b/3bfa8ba0fbdc979020fde30dc727b5a5e85dd6e3.jpg',
  //       },
  //       {
  //         name: 'Đào Minh',
  //         avatar:
  //           'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/3b/3bfa8ba0fbdc979020fde30dc727b5a5e85dd6e3.jpg',
  //       },
  //     ],
  //   },
  //   {
  //     title: 'UI/UX',
  //     members: [
  //       {
  //         name: 'Quân Vũ',
  //         avatar:
  //           'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/3b/3bfa8ba0fbdc979020fde30dc727b5a5e85dd6e3.jpg',
  //       },
  //       {
  //         name: 'Đào Minh',
  //         avatar:
  //           'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/3b/3bfa8ba0fbdc979020fde30dc727b5a5e85dd6e3.jpg',
  //       },
  //     ],
  //   },
  //   {
  //     title: 'UI/UX',
  //     members: [
  //       {
  //         name: 'Quân Vũ',
  //         avatar:
  //           'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/3b/3bfa8ba0fbdc979020fde30dc727b5a5e85dd6e3.jpg',
  //       },
  //       {
  //         name: 'Đào Minh',
  //         avatar:
  //           'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/3b/3bfa8ba0fbdc979020fde30dc727b5a5e85dd6e3.jpg',
  //       },
  //     ],
  //   },
  // ];
  const { listProject,setListProject,removeProject } = useModel('project')
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [searchData, setSearchData] = useState('')

  const handleFilter=()=>{
    return listProject.filter(project=> searchData==='' || project?.name.includes(searchData))
  }
  useEffect(() => {
    const getAllProject = async () => {
      if(currentUser?.email){
        const projects = await api.projectApi.getMyProjects(currentUser?.email)
        setListProject(projects);
      }

    }
    getAllProject()

  }, [])
  return (
    <PageContainer pageHeaderRender={false}>
      <ProCard
        headerBordered
        title={
          <div>
            {/* <Image preview={false}
              height={40} src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" /> */}
            Dự án của tôi
          </div>
        }
        extra={
          <ModalCustom type='project-create'/>
                  }
      >
        <Space direction='vertical' style={{width:'100%'}}>

         <Search
            placeholder="Nhập công việc bạn muốn tìm kiếm"
            allowClear
            onSearch={(searchValue) => setSearchData(searchValue)}
            style={{ width: 304 }}
            />
        <List
          itemLayout="horizontal"
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 6,
          }}
          dataSource={handleFilter()}
          renderItem={(project, index) => (
            <List.Item
                extra={
                  <Space>

                  <CustomAvatar email={project.members}></CustomAvatar>
                  <Popconfirm
            title="Xoá công việc"
            description="Bạn có chắc muốn xóa công việc này chứ"
            onConfirm={(e) => {
              e?.stopPropagation()
              removeProject(project.id)
            }}
            okText="Xóa"
            cancelText="Hủy"
          >

            <Button danger icon={<DeleteOutlined />} onClick={(e) => {
              e.stopPropagation()
            }}></Button>
          </Popconfirm>
                  </Space>

                }
              >
              <Link to={`/project/${project.id}`}>
                <List.Item.Meta
                style={{width:'100% !important'}}
                  avatar={
                    <Image
                      preview={false}
                      height={40}
                      src={project?.avatar || DEFAULT_PROJECT_AVT}
                    />
                  }
                  title={project.name}
                  description={project?.description}
                />
            </Link>
              </List.Item>
          )}
        />
        </Space>
      </ProCard>
    </PageContainer>
  );
}
