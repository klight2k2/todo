import { Button, Input, Popover, Space } from 'antd';
import React from 'react';

export type CustomType = {
  tags: string[];
  setTags: (tags: string[]) => void;
  children?: React.ReactNode;
};

const AddCategoryPopover: React.FC<CustomType> = ({ tags, setTags, children }) => {
  const [category, setCategory] = React.useState<string>('');
  const [open, setOpen] = React.useState<boolean>(false);

  const hide = () => setOpen(false);
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const reset = () => {
    setCategory('');
  };

  const handleAddCategory = () => {
    if (tags.findIndex((tag) => tag === category) === -1) {
      setTags([...tags, category]);
    }
    hide();
    reset();
  };

  const content = (
    <Space direction="vertical">
      <Space>
        <Input
          placeholder="Tên nhóm..."
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        />
        <Button onClick={handleAddCategory}>Thêm</Button>
      </Space>
    </Space>
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

export default AddCategoryPopover;
