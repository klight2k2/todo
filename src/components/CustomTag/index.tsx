import { Tag } from "antd";
import './tag.css'
type ChildProps={
    content?:string,
    color?:string,
}

const CustomTag: React.FC<ChildProps> = ({content, color})=>{
    switch (content) {
        case 'Trung bình':
            return  <Tag color="#F2BD27" className="mt-4 tag">Trung bình</Tag>
        case 'Thấp':
            return <Tag color="#16a34a" className="mt-4 tag">Thấp</Tag>
        case 'Cao':
            return <Tag color="#ED3939" className="mt-4 tag">Cao</Tag>
        case 'Cá nhân':
            return <Tag color="#FF60D2" className="mt-4 tag-private tag" >Cá nhân</Tag>
        case 'Nhóm':
            return <Tag color="#FF60D2" className="mt-4 tag" >Nhóm</Tag>
    }

    return <Tag className="mt-4 tag" color={color} >
        {content}
    </Tag>
}

export default CustomTag;
