<!--
 * @Descripttion: 
 * @version: v1.3.0
 * @Author: LiZeju
 * @Date: 2022-07-05 16:15:07
 * @LastEditors: LiZeju
 * @LastEditTime: 2022-07-05 17:28:15
-->

# Vue+Element

# 仿飞书表格||甘特图表格 ,搜索、筛选、字段管理、卡片管理功能

# 效果预览

## 🔈 项目启动

```
# 克隆项目
git clone
# 进入项目目录
cd zn-admin-web
# 安装项目依赖
npm install 或 cnpm install
# 运行
npm run serve
```

```

#运行代码生成机
npm run template

 1.使用时尽量使用简单单词，不要使用驼峰，驼峰会被认定为多层目录
 2.使用时文件命名切勿与已存在的文件重复，否则可能导致文件丢失
 3.如需生成多层目录，使用/间隔即可
```

## 🔗 目录结构

- ├── src
- │ ├── api # API 服务模块
- │ ├── assets # 本地静态资源
- │ │ ├── icon # 存放自定义 svg 图标 ，仅在 icon 属性为 isCustomSvg 时才会调用 svg 图标，如无必要建议使用内置图标
- │ ├── extra # 封装的小工具
- │ ├── router # 路由配置
- │ ├── store # vuex 状态管理配置
- │ ├── utils # js 工具
- │ │ |── components # 所有 zn 组件
- | | | ├── ZnCardManagementBtn # 卡片管理(参考飞书甘特图中卡片视图字段的控制)
- | | | ├── ZnDefaultPage # 列表内容区域无数据时显示、无权限时显示
- | | | ├── ZnFieldManagementBtn # 字段管理(参考飞书甘特图中字段管理对表格字段的控制)
- | | | ├── ZnFilterAlbum # card 视图(搭配数据类型为 gallery 时搭配卡片管理使用)
- | | | ├── ZnFilterTable # table 视图(搭配数据类型为 table 时搭配字段管理使用)
- | | | ├── ZnIcon # 字体 icon 组件,icons 文件夹下的 icon 调用名字以字符串形式传入
- | | | ├── ZnPagination # table 分页组件
- │ │ | ├── ZnScreenBtn # 筛选条件组件,联动下方数据,无差别视图类型
- │ │ | ├── ZnSearchBtn # 搜索条件组件,联动下方数据,无差别视图类型
- │ │ | ├── ZnScreenBtn # 筛选条件组件,联动下方数据,无差别视图类型
- | | | └── ZnViewsTabs # 视图tabs切换组件(预留增删改功能)
- │ ├── views # 页面组件
- │ │ ├── index # 首页
