- react（宿主环境无关的公用方法）
- react-reconciler（协调器的实现，宿主环境无关）
- 各种宿主环境的包
- shared（公用辅助方法，宿主环境无关）

##### jsx转换的是什么

react17之前jsx转换的是React.createElement,之后是 \_jsx()。

编译由babel编译
运行时的jsx方法或React.createElement方法需要实现
