import { Dispatch } from 'react/src/currentDispatcher';
import { Action } from 'shared/ReactTypes';

export interface Update<State> {
	action: Action<State>;
}

export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
	dispatch: Dispatch<State> | null; // 保存hooks的dispatch
}

// 代表更新的数据结构Update
export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
	};
};

//消费Update的数据结构UpdateQueue: UpdateQueue里面有一个shared.pending这个字段，这个字段指向update
export const createUpdateQueue = <State>() => {
	return {
		shared: {
			pending: null
		},
		dispatch: null
	} as UpdateQueue<State>;
};

// 往UpdateQueue里增加Update
export const enqueueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	updateQueue.shared.pending = update;
};

// UpdateQueue消费Update的方法
export const processUpdateQueue = <State>(
	baseState: State, // 初始的状态
	pendingUpdate: Update<State> | null // 消费的Update
): { memoizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState // 一开始工作完之后的memoizedState是原先的State
	};
	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;
		// 2种更新方式:1. setState((pre)=>{return newSTate})
		if (action instanceof Function) {
			result.memoizedState = action(baseState);
		} else {
			// 2种更新方式:2. setState(123)
			result.memoizedState = action;
		}
	}
	return result;
};
