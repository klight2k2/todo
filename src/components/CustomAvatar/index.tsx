import api from "@/api"
import { Avatar, Tooltip } from "antd"
import { useEffect, useState } from "react"
import { DEFAULT_AVATAR } from "../ModalCustom/Options"

type ChildProps = {
    email: string[]
}
const CustomAvatar: React.FC<ChildProps> = ({ email }) => {
    const [users, setUsers] = useState<any>([])
    const test = async (email: string[]) => {
        const member = await api.authApi.getUsersByEmail(email);
        setUsers(member);
    }
    useEffect(() => {
        (test(email))
    }, []);
    if (users) return <Avatar.Group maxCount={1} maxStyle={{ color: '#fff', backgroundColor: '#7942fe' }}>
        {users.map((user, id) => (<Tooltip key={id} title={user.displayName} placement="top">
            <Avatar style={{ backgroundColor: '#87d068' }} src={user.photoURL || DEFAULT_AVATAR} />
        </Tooltip>))}
    </Avatar.Group>
    return <></>
}

export default CustomAvatar;