# 部署手册 · ljh-portfolio → Vercel → ljhwmm.top

## ✅ 已完成

- GitHub 仓库已建：https://github.com/reeoi/ljh-portfolio
- 代码已首次推送到 `main` 分支
- 本地 `.env.local` 已配置 `GITHUB_PAT`，`/edit` 保存会自动 commit 到仓库

## 🔜 剩余步骤

### Step 1 · Vercel 导入项目（5 分钟）

1. 打开 https://vercel.com/new
2. 用 **GitHub 账号登录**（首次会要求授权 Vercel GitHub App）
3. 授权时选 **Only select repositories** → 勾选 `reeoi/ljh-portfolio` → Install
4. 回到 Import 页面，找到 `ljh-portfolio` → 点击 **Import**
5. **Framework Preset** 会自动识别为 Next.js
6. **Root Directory** 保持默认（`./`）
7. 展开 **Environment Variables**，逐条添加：

   | Name | Value | 备注 |
   |---|---|---|
   | `EDIT_PASSWORD` | `<set in Vercel dashboard>` | /edit 登录密码 |
   | `SESSION_SECRET` | `<64-char random, set in Vercel>` | 会话签名（生产独立） |
   | `GITHUB_PAT` | `<ghp_xxx, set in Vercel>` | /edit 保存时提交用 |
   | `GITHUB_OWNER` | `reeoi` | |
   | `GITHUB_REPO` | `ljh-portfolio` | |
   | `GITHUB_BRANCH` | `main` | |
   | `GITHUB_FILE` | `src/content/site.json` | |

8. 点击 **Deploy**，约 1–2 分钟首次构建完成
9. 你会得到类似 `https://ljh-portfolio-xxxx.vercel.app` 的临时域名，可直接访问测试

### Step 2 · 绑定域名 ljhwmm.top

在 Vercel 项目中：

1. 进入 **Project → Settings → Domains**
2. 输入 `ljhwmm.top` → Add
3. 再添加 `www.ljhwmm.top`（Vercel 会建议 301 → 根域）
4. Vercel 会给出 DNS 记录，一般是：
   - 根域 `ljhwmm.top`：**A 记录** 指向 `76.76.21.21`
   - `www`：**CNAME** 指向 `cname.vercel-dns.com`

### Step 3 · 阿里云 DNS 配置

1. 登录 https://dns.console.aliyun.com/
2. 找到域名 `ljhwmm.top` → 解析设置
3. 注意：`novi.ljhwmm.top` 已经在用，**不要动它**
4. 添加记录：
   - 类型 `A`，主机记录 `@`（即根域），记录值 `76.76.21.21`，TTL 600
   - 类型 `CNAME`，主机记录 `www`，记录值 `cname.vercel-dns.com`，TTL 600
5. 等 DNS 生效（几分钟~几小时，一般 10 分钟内）
6. 回到 Vercel Domains 页面，状态会从 `Invalid Configuration` 变成 `Valid`，HTTPS 证书自动签发

### Step 4 · 上线后验收清单

- [ ] `https://ljhwmm.top/` 打开首页
- [ ] `https://ljhwmm.top/about` 可访问
- [ ] `https://ljhwmm.top/works` 可访问
- [ ] `https://ljhwmm.top/edit` 要求输密码，登录后能改内容
- [ ] 改 heroTagline → 保存 → 约 1 分钟后（Vercel rebuild）首页更新
- [ ] 检查 GitHub 仓库 commit 记录多了一条 `chore(content): ...`

## 🆘 故障排查

- **Vercel build 失败**：查看 Build Logs，多半是某个依赖没声明。`package.json` 已包含 `@octokit/rest`。
- **/edit 在生产登不上**：Vercel 环境变量 `EDIT_PASSWORD` 没设置或没 redeploy。改完环境变量需要手动触发 Redeploy。
- **保存后仓库没更新**：检查 `GITHUB_PAT` 是否正确、scope 含 `repo`。
- **DNS 不生效**：`nslookup ljhwmm.top 8.8.8.8` 看是否返回 `76.76.21.21`。