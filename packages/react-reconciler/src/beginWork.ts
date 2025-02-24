import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { processUpdateQueue, UpdateQueue } from './updateQueue';
import {
	FunctionComponent,
	HostComponent,
	HostRoot,
	HostText
} from './workTags';
import { mountChildFibers, reconcileChildFibers } from './childFibers';
import { renderWithHooks } from './fiberHooks';

// 递归中的递阶段
export const beginWork = (wip: FiberNode) => {
	// 比较ReactElement 和 fiberNode，并返回子fiberNode
	switch (wip.tag) {
		case HostRoot:
			// HostRoot的beginWork流程：1. 计算状态的最新值 2. 创造子fiberNode
			return updateHostRoot(wip);
		case HostComponent:
			// 创造子fiberNode
			return updateHostComponent(wip);
		case HostText: // 没有子节点
			return null;
		case FunctionComponent:
			return updateFunctionComponent(wip);
		default:
			if (__DEV__) {
				console.log('beginWork未实现的类型');
			}
			break;
	}
	return null;
};

function updateFunctionComponent(wip: FiberNode) {
	const nextChildren = renderWithHooks(wip);
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function updateHostRoot(wip: FiberNode) {
	const baseState = wip.memoizedState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	updateQueue.shared.pending = null;
	const { memoizedState } = processUpdateQueue(baseState, pending); // memoizedState就是最新的状态,这里就是传进来的reactElement
	wip.memoizedState = memoizedState;

	const nextChildren = wip.memoizedState; // 这里就是子reactElement
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps; // 子的reactElement在父reactElement的props里（props.children）
	const nextChildren = nextProps.children;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
	const current = wip.alternate; // 因为要对比current fiberNode和reactElement,生成子节点的wip fiberNode
	if (current !== null) {
		// update
		wip.child = reconcileChildFibers(wip, current?.child, children);
	} else {
		// mount流程，此处可以优化，很多节点多次Placement可以在构建好离屏DOM树的时候执行1次Placement
		wip.child = mountChildFibers(wip, null, children);
	}
}
