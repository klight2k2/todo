import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  // 拂晓蓝
  colorPrimary: '#7942FE',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'Todolist',
  siderWidth:220,
  pwa: true,
  logo: '/icons/todo.png',
  iconfontUrl: '',
  token: {
      colorBgAppListIconHover: 'rgba(0,0,0,0.06)',
      colorTextAppListIconHover: 'rgba(255,255,255,0.95)',
      colorTextAppListIcon: 'rgba(255,255,255,0.85)',
      sider: {
        colorMenuBackground:'#fff',
        colorBgMenuItemHover:'#EFE9FF',
        colorBgMenuItemSelected:'#EFE9FF',
        colorTextMenuSelected:'#7942FE'
      },
    },
    siderMenuType: 'group'
};

export default Settings;
