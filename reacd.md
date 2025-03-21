# React 技术揭秘

### JSX 和 Fiber 节点的区别？React Component 和 React Element 的区别？

JSX 是一种描述当前组件内容的数据结构，他不包含组件 schedule、reconcile、render 所需的相关信息。
Fiber 节点是 React 的虚拟 DOM 节点，用于描述 UI 的结构。以及组件 state 优先级 标记 等所需的相关信息。

React Component 是 React 的组件，用于描述 UI 的结构。
React Element 是 JSX 在 React 中运行时返回的结果。
