# SRHelper

一个全新的，几乎完全基于前端技术实现的《崩坏·星穹铁道》辅助工具

## 使用方法

1. 在本地7841端口打开一个指向https://api.mihomo.me的反向代理
    - 请注意，该反向代理的作用是为了使用原本不带有CORS头的mihomo
      API，因此该反向代理应该正确设置Access-Control-Allow-Origin使得SRHelper的访问不会产生CORS Error
2. 打开shell，输入以下代码
   ```shell
   npm run dev
   ```
3. 在浏览器中打开http://localhost:5173/