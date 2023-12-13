import { PageContainer, ProCard } from "@ant-design/pro-components"
import { Alert, Avatar, Button, Divider, Form, Image, Input, Modal } from "antd"
import "./profile.css"
import { useEffect, useState } from "react";
import { CameraOutlined, PlusOutlined } from "@ant-design/icons";
import { storage } from "@/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useModel } from "@umijs/max";
import api from "@/api";
import { getAuth } from "firebase/auth";
import { flushSync } from "react-dom";
type FieldType = {
    name?: string;
    phoneNumber?: string;
    address?: string;
};

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16, },
};

const Profile: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [formType, setFormType] = useState('EDIT');
    const { initialState, setInitialState } = useModel('@@initialState');
    const { currentUser } = initialState;
    const [previewUrl, setPreviewUrl] = useState(currentUser?.photoURL);
    
    const [form] = Form.useForm();
    const [changePwForm] = Form.useForm();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };
    const handleUpload = async (values) => {
        let url = currentUser?.photoURL
        if (selectedFile) {
            console.log(selectedFile);
            const storageRef = ref(storage, `${currentUser?.email}`);
            await uploadBytesResumable(storageRef, selectedFile).then(async () => {
                await getDownloadURL(storageRef).then(async (downloadURL) => {
                    setPreviewUrl(downloadURL);
                    url = downloadURL
                    console.log(downloadURL);
                })
            })
        }
        if (currentUser) {
            console.log("currentUser", currentUser);
            
            const { uid, ...user } = currentUser
            const newUser = {...user, ...values, photoURL: url}
            console.log(newUser);
            
            const res = await api.authApi.changeInfo(newUser, uid)
            if (res) {
                flushSync(() => {
                    setInitialState((s) => ({
                      ...s,
                      currentUser: {uid, ...newUser},
                    }));
                })
            }
        }
    };
    const [isModalOpen, setIsModalOpen] = useState(false);


    const handleOk = () => {
        if(formType ==="EDIT"){

            form.submit()
        }else{
            changePwForm.submit()
        }
    
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        changePwForm.resetFields()
        setIsModalOpen(false);
    };
    const onFinishEdit = async (values: any) => {
        await handleUpload(values);
        console.log('Success:', { ...values, previewUrl });
        changePwForm.resetFields()
    };
    const onFinishChangePassword = async (values: any) => {
      await api.authApi.changePassword(values.newPassword)
      changePwForm.resetFields()
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const showModal = (formType:string) => {
        setFormType(formType);
        form.setFieldsValue({ displayName: currentUser?.displayName, phoneNumber: currentUser?.phoneNumber, address: currentUser?.address });
        setIsModalOpen(true);
    };

    const validateConfirmPassword = (_, value) => {
        const { newPassword } = changePwForm.getFieldsValue();
        
        if (value && value !== newPassword) {
          return Promise.reject(new Error('Mật khẩu mới không trùng'));
        }
        return Promise.resolve();
    };
    const validatePhoneNumber = (_, value) => {
        const phoneNumberRegex = /^(?:\+?84|0)(?:\d){9,10}$/;
        if (value && !phoneNumberRegex.test(value)) {
          return Promise.reject(new Error('Số điện thoại không hợp lệ'));
        }
        return Promise.resolve();
    };

    return <PageContainer pageHeaderRender={false}>
        <ProCard headerBordered title="Thông tin cá nhân">
            <div className="profile-header">
                <div className="info ">

                    <Avatar size={148} src={currentUser?.photoURL} />

                    <div className="ml-16">
                        <h2 className="profile-name">{currentUser?.displayName}</h2>
                        <p className="profile-email">{currentUser?.email}</p>
                    </div>
                </div>
                <div >

                    <Button onClick={()=>showModal("CHANGE_PASSWORD")} className="mr-4">Đổi mật khẩu</Button>
                    <Button type="primary" onClick={()=>showModal("EDIT")}>Chỉnh sửa</Button>
                </div>
            </div>
            <Divider />
            <div>
                <div>
                    <span className="field">Số điện thoại:</span> {currentUser?.phoneNumber}
                </div>
                <div>
                    <span className="field">Địa chỉ:</span> {currentUser?.address}
                </div>
            </div>
            <Modal title="Chỉnh sửa thông tin cá nhân" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                {
                 formType==='EDIT'?  <Form
                 form={form}
                 name="project-create"
                 labelCol={{ span: 6 }}
                 autoComplete="off"
                 onFinish={onFinishEdit}
                 onFinishFailed={onFinishFailed}
             >
                 <input type="file" onChange={handleFileChange} id="file" style={{ display: 'none' }} />
                 <div style={{ position: 'relative', display: 'inline-block' }}>

                     <Avatar size={148} src={previewUrl} className="preview-avt" >

                     </Avatar>
                     <label htmlFor="file" className="upload-icon">
                         <CameraOutlined style={{ fontSize: '20px' }} />
                     </label>
                 </div>
                 <Form.Item
                     label="Tên hiển thị"
                     name="displayName"
                     rules={[{ required: true, message: 'Hãy nhập tên hiển thị' }]}
                 >
                     <Input
                     />
                 </Form.Item>
                 <Form.Item
                     label="Số điện thoại"
                     name="phoneNumber"
                     rules={[
                        { validator: validatePhoneNumber }
                     ]}
                 >
                     <Input
                     />
                 </Form.Item>
                 <Form.Item
                     label="Địa chỉ"
                     name="address"
                 >
                     <Input
                     />
                 </Form.Item>
             </Form>:  <Form
                    form={changePwForm}
                    name="change-password"
                    labelCol={{ span: 9 }}
                    autoComplete="off"
                    onFinish={onFinishChangePassword}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[{ required: true, message: 'Bạn chưa nhập mật khẩu mới' }]}
                    >
                        <Input
                        />
                    </Form.Item>
                    <Form.Item
                        label="Xác nhận mật khẩu mới"
                        name="confirmPassword"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Bạn chưa nhập mật khẩu mới' },
                            { validator: validateConfirmPassword }
                        ]}
                    >
                        <Input
                        />
                    </Form.Item>
                  
                </Form>

                }
              
              
            </Modal>

           

        </ProCard>
    </PageContainer>
}

export default Profile