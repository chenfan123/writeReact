import {
	appendInitialChild,
	createInstance,
	createTextInstance,
	Container
} from 'hostConfig';
import { FiberNode } from './fiber';
import {
	HostComponent,
	HostText,
	HostRoot,
	FunctionComponent
} from './workTags';
import { NoFlags, Update } from './fiberFlags';

function markUpdate(fiber: FiberNode) {
	fiber.flags |= Update;
}

// 递归中的归
export const completeWork = (wip: FiberNode) => {
	const newProps = wip.pendingProps;
	const current = wip.alternate;
	switch (wip.tag) {
		case HostComponent:
			if (current !== null && wip.stateNode) {
				// update
			} else {
				// mount
				// 构建离屏的DOM树
				// 1. 构建DOM
				const instance = createInstance(wip.type);
				// 2. 将DOM插入到DOM树中
				appendAllChildren(instance, wip);
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null;
		case HostText:
			if (current !== null && wip.stateNode) {
				// update
				const oldText = current.memoizedProps.content;
				const newText = newProps.content;
				if (oldText !== newText) {
					markUpdate(wip);
				}
			} else {
				// mount
				// 构建离屏的DOM树
				// 1. 构建DOM
				const instance = createTextInstance(newProps.content);
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null;
		case HostRoot:
			bubbleProperties(wip);
			return null;
		case FunctionComponent:
			bubbleProperties(wip);
			return null;
		default:
			if (__DEV__) {
				console.log('未处理的complete情况', wip);
			}
			break;
	}
};

/**
 * 希望在parent节点下插入wip这个节点
 * 但是wip本身可能不是一个dom节点，所以需要递归，寻找hostComponent或者hostText节点
 *
 * @param parent
 * @param wip
 * @returns
 */
function appendAllChildren(parent: Container, wip: FiberNode) {
	let node = wip.child;
	while (node !== null) {
		if (node.tag === HostComponent || node.tag === HostText) {
			// 如果找到了执行appendChild的操作
			appendInitialChild(parent, node?.stateNode);
		} else if (node.child !== null) {
			// 如果没有找到就继续往下找
			node.child.return = node;
			node = node.child;
			continue;
		}
		if (node === wip) {
			return;
		}
		// 往上找
		while (node.sibling === null) {
			if (node.return === null || node.return === wip) {
				// 回到了原点
				return;
			}
			node = node?.return;
		}
		node.sibling.return = node.return;
		node = node.sibling;
	}
}

// 将当前节点的子节点和子节点的兄弟节点中的flags冒泡到当前节点的SubtreeFlags
function bubbleProperties(wip: FiberNode) {
	let subtreeFlags = NoFlags;
	let child = wip.child;
	while (child !== null) {
		subtreeFlags |= child.subtreeFlags; // subtreeFlags就包含了当前节点的子节点的subtreeFlags
		subtreeFlags |= child.flags; // 以及child本身的flags
		child.return = wip;
		child = child.sibling;
	}
	wip.subtreeFlags |= subtreeFlags;
}
