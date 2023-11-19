import { PlusOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';
import AddCategoryPopover from '../Popover/AddCategoryPopover';

export type InputType = {
  tags: string[];
  setTags: (tags: string[]) => void;
  disabled?: boolean;
};

const CategoryTags: React.FC<InputType> = ({ tags, setTags, disabled=false }) => {
  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };

  return (
    <>
      {tags.map((tag) => {
        const tagElem = (
          <Tag
            closable
            onClose={(e) => {
              e.preventDefault();
              handleClose(tag);
            }}
          >
            {tag}
          </Tag>
        );
        return (
          <span key={tag} style={{ display: 'inline-block' }}>
            {tagElem}
          </span>
        );
      })}
      {!disabled && (
        <AddCategoryPopover tags={tags} setTags={setTags}>
          <Tag style={{ cursor:'pointer' }}>
            <PlusOutlined /> Thêm
          </Tag>
        </AddCategoryPopover>
      )}
    </>
  );
};

export default CategoryTags;
