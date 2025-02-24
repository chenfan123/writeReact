import { FiberNode } from './fiber';

export function renderWithHooks(wip: FiberNode) {
	const Component = wip.type; // 函数组件的函数
	const props = wip.pendingProps; // 获取props
	const children = Component(props); // 执行函数组件，返回reactElement

	return children;
}
