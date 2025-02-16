- react（宿主环境无关的公用方法）
- react-reconciler（协调器的实现，宿主环境无关）
- 各种宿主环境的包
- shared（公用辅助方法，宿主环境无关）

##### jsx转换的是什么

react17之前jsx转换的是React.createElement,之后是 \_jsx()。

编译由babel编译
运行时的jsx方法或React.createElement方法需要实现

## reconciler

协调器，核心模块，协调就是diff算法的意思。

### 核心模块消费JSX的过程

已知的数据结构ReactElement。
ReactElement无法表达节点之间的关系，字段有限不好扩展。
因此需要1个新的数据结构（FiberNode）：

- 介于ReactElement和真实UI节点之间
- 能够表达节点之间的关系
- 方便扩展，作为数据存储单元，也能作为工作单元

reconciler工作方式
比较其ReactElement 与 fiberNode,生成子fiberNode.根据结果生成不同标记（删除、插入、移动...），对应不同宿主环境API的执行。
当所有ReactElement比较完后，会生成一棵fiberNode树，一共会存在2棵。

- current: 与视图真实UI对应
- workInProgress: 触发更新后，正在reconciler中计算的fiberNode树

### 如何触发更新

触发更新的方式：

1. React.createRoot().render(老版就是ReactDOM.render)
2. this.setState
3. useState 的dispatch方法

##### 更新机制的组成部分：

代表更新的数据结构——Update
消费update的数据结构UpdateQueue

需要考虑的：

1. 更新可能发生于任意组件，而更新流程是从根节点递归的
2. 需要1个统一的根节点保存通用信息
   ![alt text](../imgs/react/createRoot.png)

## mount流程

目的：

1. 生成wip fiberNode树
2. 标记副作用flags

更新流程：
递： beginWork
归： completeWork

### beginWork

当进入A组件的beginWork，会对比B的current fiberNode 和 B reactElement，生成B对应的wip fiberNode
会标记2类与**结构变化**相关的flags（placement和childDeletion）
不包含与**属性变化**相关的flag（Update）

#### HostRoot的beginWork

1. 计算状态的最新值
2. 创造子fiberNode

#### HostComponent的beginWork

1. 创造子fiberNode

#### HostText

没有beginWork工作流程，因为没有子节点

> beginWork性能优化策略：
> 构建好离屏DOM树，执行一次Placement操作

### completeWork

1. 对于host类型fiberNode，构建离屏DOM树
2. 标记Update flag

> completeWork性能优化
> flags分布在不同fiberNode中，可以利用completeWork向上遍历的流程，将子fiberNode的flags冒泡到父fiberNode
