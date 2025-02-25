- react（宿主环境无关的公用方法）
- react-reconciler（协调器的实现，宿主环境无关）
- 各种宿主环境的包
- shared（公用辅助方法，宿主环境无关）

##### jsx 转换的是什么

react17 之前 jsx 转换的是 React.createElement,之后是 \_jsx()。

编译由 babel 编译
运行时的 jsx 方法或 React.createElement 方法需要实现

## reconciler

协调器，核心模块，协调就是 diff 算法的意思。

### 核心模块消费 JSX 的过程

已知的数据结构 ReactElement。
ReactElement 无法表达节点之间的关系，字段有限不好扩展。
因此需要 1 个新的数据结构（FiberNode）：

- 介于 ReactElement 和真实 UI 节点之间
- 能够表达节点之间的关系
- 方便扩展，作为数据存储单元，也能作为工作单元

reconciler 工作方式
比较其 ReactElement 与 fiberNode,生成子 fiberNode.根据结果生成不同标记（删除、插入、移动...），对应不同宿主环境 API 的执行。
当所有 ReactElement 比较完后，会生成一棵 fiberNode 树，一共会存在 2 棵。

- current: 与视图真实 UI 对应
- workInProgress: 触发更新后，正在 reconciler 中计算的 fiberNode 树

### 如何触发更新

触发更新的方式：

1. React.createRoot().render(老版就是 ReactDOM.render)
2. this.setState
3. useState 的 dispatch 方法

##### 更新机制的组成部分：

代表更新的数据结构——Update
消费 update 的数据结构 UpdateQueue

需要考虑的：

1. 更新可能发生于任意组件，而更新流程是从根节点递归的
2. 需要 1 个统一的根节点保存通用信息
   ![alt text](../imgs/react/createRoot.png)

## mount 流程

目的：

1. 生成 wip fiberNode 树
2. 标记副作用 flags

更新流程：
递： beginWork
归： completeWork

### beginWork

当进入 A 组件的 beginWork，会对比 B 的 current fiberNode 和 B reactElement，生成 B 对应的 wip fiberNode
会标记 2 类与**结构变化**相关的 flags（placement 和 childDeletion）
不包含与**属性变化**相关的 flag（Update）

#### HostRoot 的 beginWork

1. 计算状态的最新值
2. 创造子 fiberNode

#### HostComponent 的 beginWork

1. 创造子 fiberNode

#### HostText

没有 beginWork 工作流程，因为没有子节点

> beginWork 性能优化策略：
> 构建好离屏 DOM 树，执行一次 Placement 操作

### completeWork

1. 对于 host 类型 fiberNode，构建离屏 DOM 树
2. 标记 Update flag

> completeWork 性能优化
> flags 分布在不同 fiberNode 中，可以利用 completeWork 向上遍历的流程，将子 fiberNode 的 flags 冒泡到父 fiberNode

## RectDOM

react 内部 3 个阶段：

1. schedule 阶段
2. render 阶段(beginWork completeWork)
3. commit 阶段（commitWork）

#### commit 阶段

- beforeMutation 阶段
- mutation 阶段
- layout 阶段

commit 阶段要执行的任务：

1. fiber 树的切换
2. 执行 Placement 对应操作

##### 如何支持 FC？

FC 的工作同样植根于 beginWork 和 completeWork

### 实现 useState

Q: hook 如何知道在另一个 hook 的上下文环境内执行？

Q: hook 怎么知道当前是 mount 还是 update?

解决方案：在不同上下文中调用的 hook 不是同一个函数
![alt text](../imgs/react/hooks.jpg)

> react 中实际调用的不是 hooks 的实现，而是 hooks 的集合。

hook 如何知道自身数据保存在哪里?
可以记录当前正在 render 的 FC 对应 fiberNode,在 fiberNode 中保存 hook 数据
