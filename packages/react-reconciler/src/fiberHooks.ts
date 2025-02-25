import { FiberNode } from './fiber';
import internals from 'shared/internals';
// 当前正在render的fiber
let currentlyRenderingFiber: FiberNode | null = null;
const workInProgressHook: Hook | null = null;

const { currentDispatcher } = internals;
interface Hook {
	// FC fiberNode中的memoizedState指向的事hooks的链表。
	// 每一个hook中的memoizedState保存着hook的值
	memoizedState: any;
	updateQueue: unknown;
	next: Hook | null;
}

export function renderWithHooks(wip: FiberNode) {
	// 赋值操作
	currentlyRenderingFiber = wip;
	wip.memoizedState = null;

	const current = wip.alternate;
	if (current !== null) {
		// update
	} else {
		// mount
		currentDispatcher.current = '';
	}

	const Component = wip.type; // 函数组件的函数
	const props = wip.pendingProps; // 获取props
	const children = Component(props); // 执行函数组件，返回reactElement

	// 重置操作
	currentlyRenderingFiber = null;
	return children;
}
