const menuList = [
  {
    title: "首页", // 菜单标题名称
    key: "/home/admin", // 对应的path
    icon: "<HomeOutlined/>" // 图标名称
  },
  {
    title: "商品",
    key: "/home/products",
    icon: "appstore",
    children: [
      // 子菜单列表
      {
        title: "品类管理",
        key: "/home/products/Category",
        icon: "bars"
      },
      {
        title: "商品管理",
        key: "/home/products/products",
        icon: "tool"
      }
    ]
  },

  {
    title: "用户管理",
    key: "/home/user",
    icon: "user"
  },
  {
    title: "角色管理",
    key: "/home/role",
    icon: "safety"
  }

  // {
  //   title: '图形图表',
  //   key: '/charts',
  //   icon: 'area-chart',
  //   children: [
  //     {
  //       title: '柱形图',
  //       key: '/home/charts/bar',
  //       icon: 'bar-chart'
  //     },
  //     {
  //       title: '折线图',
  //       key: '/home/charts/line',
  //       icon: 'line-chart'
  //     },
  //     {
  //       title: '饼图',
  //       key: '/home/charts/pie',
  //       icon: 'pie-chart'
  //     },
  //   ]
  // },
];

export default menuList;
