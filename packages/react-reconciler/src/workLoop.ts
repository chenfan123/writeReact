import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode } from './fiber';

// 完整的工作循环文件

let workInProgress: FiberNode | null = null; // 一个指针指向当前正在工作的fiberNode

// 初始化，让workInProgress指向遍历的第一个fiberNode
function prepareFreshStack(fiber: FiberNode) {
	workInProgress = fiber;
}

function renderRoot(root: FiberNode) {
	prepareFreshStack(root);
	// 执行递归流程
	do {
		try {
			workLoop();
			break;
		} catch (e) {
			console.warn('workLoop 发生错误', e);
			workInProgress = null;
		}
	} while (true);
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
