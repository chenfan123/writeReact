import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode, FiberRootNode } from './fiber';
import { Container } from 'hostConfig';
import {
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	UpdateQueue
} from './updateQueue';
import { HostRoot } from './workTags';
import { scheduleUpdateOnFiber } from './workLoop';
/**
 * ReactDOM.createRoot().render()
 * 调用createRoot()方法之后，内部会执行createContainer
 * container是根节点
 *
 */
export function createContainer(container: Container) {
	// hostRootFiber的tag是3
	const hostRootFiber = new FiberNode(HostRoot, {}, null);
	// root是一个FiberRootNode，container是根节点，current指向了hostRootFiber，并让hostRootFiber的stateNode指向了root
	const root = new FiberRootNode(container, hostRootFiber);
	hostRootFiber.updateQueue = createUpdateQueue();
	return root;
}
/**
 * ReactDOM.createRoot().render()
 * 执行render方法之后，在render方法内部就会执行updateContainer方法
 * 返回的element对于reactDom.createRoot(root).render(<App/>)来说，App组件对应的ReactElement就是这个element
 */
export function updateContainer(
	element: ReactElementType | null,
	root: FiberRootNode
) {
	const hostRootFiber = root.current;
	const update = createUpdate<ReactElementType | null>(element); // 创建1个update，这次更新跟element相关的
	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
		update
	);
	scheduleUpdateOnFiber(hostRootFiber);
	return element;
}
