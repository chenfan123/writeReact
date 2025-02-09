export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText;

export const FunctionComponent = 0; // 函数组件
export const HostRoot = 3; // 项目根节点
export const HostComponent = 5; // 类似于1个div对应的tag类型就是这个
export const HostText = 6; // 元素中的文本
