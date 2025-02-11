import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';
export class FiberNode {
	/**
	 * @param tag 就是这个FiberNode是什么类型的节点
	 * @param pendingProps 就是当前fiber接下来有哪些Props需要改变
	 * @param key
	 */
	type: any;
	tag: WorkTag;
	pendingProps: Props;
	key: Key;
	stateNode: any;
	ref: Ref;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;

	memoizedProps: Props | null;
	memoizedState: any;
	alternate: FiberNode | null;
	flags: Flags;
	updateQueue: unknown;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例
		this.tag = tag;
		this.key = key;
		this.stateNode = null; // 对于HostComponent来说如果是个div，那么这个stateNode就保存了div的DOM
		this.type = null; // fiberNode的类型，functionCom来说，type就是0

		// 构成树状结构
		this.return = null; // 指向父fiberNode
		this.sibling = null; // 指向兄弟
		this.child = null; // 指向子
		this.index = 0; // 如果同级的fiberNode有好几个，第一个就是0，第二个就是1

		this.ref = null;

		// 作为工作单元
		this.pendingProps = pendingProps; // 刚开始准备工作的时候props
		this.memoizedProps = null; // 工作完之后的props
		this.memoizedState = null;
		this.updateQueue = null;

		this.alternate = null; // 用于当前fiberNode与另一个fiberNode进行切换
		// 副作用
		this.flags = NoFlags; // 用于存储标记（删除、插入、移动等等）
	}
}

export class FiberRootNode {
	container: Container;
	current: FiberNode; // 指针指向hostRootFiber
	finishedWork: FiberNode | null; // 指向更新完成之后的hostRootFiber
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this; // hostRootFiber的stateNode指向fiberRootNode
		this.finishedWork = null;
	}
}

// 创建wip
export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate;
	// 首屏渲染的时候wip是null
	if (wip === null) {
		// mount
		wip = new FiberNode(current.tag, pendingProps, current.key);

		wip.stateNode = current.stateNode;

		wip.alternate = current;
		current.alternate = wip;
	} else {
		// update
		wip.pendingProps = pendingProps;
		// 清除副作用
		wip.flags = NoFlags;
	}
	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedState = current.memoizedState;
	wip.memoizedProps = current.memoizedProps;
	return wip;
};
