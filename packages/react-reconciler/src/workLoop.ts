import { beginWork } from './beginWork';
import { commitMutationEffects } from './commitWork';
import { completeWork } from './completeWork';
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber';
import { MutationMask, NoFlags } from './fiberFlags';
import { HostRoot } from './workTags';

// 完整的工作循环文件

let workInProgress: FiberNode | null = null; // 一个指针指向当前正在工作的fiberNode

// 初始化，让workInProgress指向遍历的第一个fiberNode
function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {});
}

// 在fiber中调度update，连接 container 和 renderRoot方法
export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// @TODO 调度功能
	// 从当前更新的fiber遍历到fiberRootNode
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
}

// 从当前节点遍历到根节点
function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;
	while (parent !== null) {
		// !== null就说明当前节点是普通的fiberNode
		node = parent;
		parent = node.return;
	}
	// 跳出循环,一般就是到了hostRootFiber
	if (node.tag === HostRoot) {
		return node.stateNode; // 就是fiberRootNode
	}
	return null;
}

function renderRoot(root: FiberRootNode) {
	prepareFreshStack(root);
	// 执行递归流程
	do {
		try {
			workLoop();
			break;
		} catch (e) {
			if (__DEV__) {
				console.warn('workLoop 发生错误', e);
			}
			workInProgress = null;
		}
	} while (true);
	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;
	// wip fiberNode树 树中的flags
	commitRoot(root);
}

function commitRoot(root: FiberRootNode) {
	const finishedWork = root.finishedWork;
	if (finishedWork === null) {
		return;
	}
	if (__DEV__) {
		console.warn('commit阶段开始', finishedWork);
	}
	// 重置
	root.finishedWork = null;
	// 判断是否存在3个子阶段要执行的操作
	// root 本身的flags    root的subtreeFlags
	const subtreeHasEffect =
		(finishedWork.subtreeFlags & MutationMask) !== NoFlags;
	const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;

	if (subtreeHasEffect || rootHasEffect) {
		// beforeMutation
		// mutation Placement
		commitMutationEffects(finishedWork);
		root.current = finishedWork;
		// layout
	} else {
		root.current = finishedWork;
	}
}

// 只要workInProgress不是null就可以一直执行
function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

function performUnitOfWork(fiber: FiberNode) {
	const next = beginWork(fiber);
	fiber.memoizedProps = fiber.pendingProps;
	if (next === null) {
		// 说明递归的递到最深层了，开始归阶段
		completeUnitOfWork(fiber);
	} else {
		workInProgress = next;
	}
}

// 遍历兄弟节点
function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;
	do {
		completeWork(node);
		const sibling = node.sibling; // 获取兄弟节点
		// 如果兄弟节点存在，赋值给workInprogress
		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		// 不存在递归往上
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}
