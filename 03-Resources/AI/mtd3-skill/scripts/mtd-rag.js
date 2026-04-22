#!/usr/bin/env node
/**
 * MTD RAG MCP 命令行工具
 *
 * 封装 @ss/mtd-rag-mcp，通过终端直接查询 MTD 组件库信息。
 *
 * 工具列表:
 *   query_components         - 查询 MTD 组件（自动识别意图）
 *   query_components_direct  - 直接查询指定组件文档
 *   get_all_components       - 获取所有组件名称列表
 *   friday_query_components  - Friday 智能体专用查询
 *   health                   - 检查服务健康状态
 *
 * 使用示例:
 *   node mtd-rag.js health
 *   node mtd-rag.js get_all_components --library=React
 *   node mtd-rag.js query_components_direct --components=Button,Table --target=mtd-react --version=0.12.9
 *   node mtd-rag.js query_components --prompt="我要开发一个登录页面" --target=mtd-react --version=0.12.9
 *   node mtd-rag.js friday_query_components --prompt="如何使用Button组件" --target=mtd-react --version=0.12.9
 */

const { spawn } = require('child_process');

const NPX_BIN = process.execPath.replace(/node$/, 'npx');
const MCP_PACKAGE = '@ss/mtd-rag-mcp@latest';
const MCP_REGISTRY = 'http://r.npm.sankuai.com';

/**
 * 通过 stdio 协议与 MCP 进程通信，调用指定工具
 */
function callMcpTool(toolName, toolArgs) {
  return new Promise((resolve, reject) => {
    const mcpProcess = spawn(NPX_BIN, [
      '-y',
      `--registry=${MCP_REGISTRY}`,
      MCP_PACKAGE,
    ], {
      env: { ...process.env },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let initialized = false;

    mcpProcess.stdout.on('data', (chunk) => {
      stdout += chunk.toString();

      const lines = stdout.split('\n');
      stdout = lines.pop(); // 保留不完整的最后一行

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        let msg;
        try {
          msg = JSON.parse(trimmed);
        } catch {
          continue;
        }

        // initialize 响应 → 发送 initialized 通知 + tools/call 请求
        if (msg.id === 1 && msg.result) {
          initialized = true;
          const initNotification = JSON.stringify({
            jsonrpc: '2.0',
            method: 'notifications/initialized',
            params: {},
          });
          const toolCall = JSON.stringify({
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/call',
            params: {
              name: toolName,
              arguments: toolArgs,
            },
          });
          mcpProcess.stdin.write(initNotification + '\n');
          mcpProcess.stdin.write(toolCall + '\n');
        }

        // tools/call 响应 → 提取结果
        if (msg.id === 2) {
          mcpProcess.stdin.end();
          mcpProcess.kill();

          if (msg.result?.isError) {
            const errText = msg.result?.content?.[0]?.text || '未知错误';
            reject(new Error('MCP 返回错误: ' + errText));
            return;
          }

          const content = msg.result?.content;
          if (!content || content.length === 0) {
            reject(new Error('MCP 响应中没有内容'));
            return;
          }

          // 合并所有 text 内容
          const text = content.map(c => c.text || '').join('\n');
          try {
            resolve(JSON.parse(text));
          } catch {
            resolve(text);
          }
        }
      }
    });

    mcpProcess.stderr.on('data', () => {
      // 静默忽略 MCP 的 stderr 日志
    });

    mcpProcess.on('error', (err) => {
      reject(new Error('启动 MCP 进程失败: ' + err.message));
    });

    mcpProcess.on('close', (code) => {
      if (!initialized) {
        reject(new Error('MCP 进程异常退出，退出码: ' + code));
      }
    });

    // 发送 initialize 握手
    const initRequest = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'mtd-rag-cli', version: '1.0.0' },
      },
    });
    mcpProcess.stdin.write(initRequest + '\n');
  });
}

/**
 * 解析命令行参数 --key=value 或 --key value
 */
function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const eqIdx = arg.indexOf('=');
      if (eqIdx !== -1) {
        const key = arg.slice(2, eqIdx);
        args[key] = arg.slice(eqIdx + 1);
      } else {
        const key = arg.slice(2);
        if (argv[i + 1] && !argv[i + 1].startsWith('--')) {
          args[key] = argv[i + 1];
          i++;
        } else {
          args[key] = true;
        }
      }
    }
  }
  return args;
}

function printHelp() {
  console.log(`
MTD RAG MCP 命令行工具

用法: node mtd-rag.js <命令> [选项]

命令:
  health
    检查 MTD RAG 服务健康状态
    示例: node mtd-rag.js health

  get_all_components
    获取组件库所有组件名称列表
    选项:
      --library=<React|Vue>   组件库类型（默认: React）
    示例: node mtd-rag.js get_all_components --library=React

  query_components
    查询 MTD 组件（自动意图识别）
    选项:
      --prompt=<需求描述>      必填，用户需求描述
      --target=<类型>          必填，mtd-react 或 mtd-vue
      --version=<版本号>       必填，框架版本号（如 18.0.0 / 3.0.0）
      --mtd-version=<版本号>   必填，MTD 版本号（如 0.12.9）
      --pkg-mgr=<包管理器>     必填，npm/yarn/pnpm
      --build-tool=<构建工具>  必填，vite/webpack/vue-cli
      --have-mtd=<有|没有>     必填，项目是否已安装 MTD
      --theme=<主题色>         可选，默认蓝色
    示例: node mtd-rag.js query_components \\
            --prompt="开发登录页面" --target=mtd-react \\
            --version=18.0.0 --mtd-version=0.12.9 \\
            --pkg-mgr=npm --build-tool=vite --have-mtd=有

  query_components_direct
    直接查询指定组件文档（跳过意图识别）
    选项:
      --components=<组件列表>  必填，逗号分隔，如 Button,Table
      --target=<类型>          必填，mtd-react 或 mtd-vue
      --mtd-version=<版本号>   可选，MTD 版本号（如 0.12.9），不填则默认获取最新版
    示例: node mtd-rag.js query_components_direct \\
            --components=Button,Table --target=mtd-react
          node mtd-rag.js query_components_direct \\
            --components=Button,Table --target=mtd-react --mtd-version=0.12.9

  friday_query_components
    Friday 智能体专用查询工具
    选项:
      --prompt=<问题描述>      必填，包含组件库和版本信息
      --target=<类型>          必填，mtd-react 或 mtd-vue
      --mtd-version=<版本号>   必填，MTD 版本号
    示例: node mtd-rag.js friday_query_components \\
            --prompt="使用@ss/mtd-react3@0.12.9，如何设置Button状态" \\
            --target=mtd-react --mtd-version=0.12.9

通用选项:
  --quiet / -q   只输出结果，不输出状态信息
  --help / -h    显示帮助信息
`);
}

async function main() {
  const argv = process.argv.slice(2);
  const command = argv.find(a => !a.startsWith('-'));
  const flags = parseArgs(argv.filter(a => a.startsWith('-')));

  if (!command || flags.help || flags.h) {
    printHelp();
    process.exit(command ? 0 : 1);
  }

  const quiet = flags.quiet || flags.q;

  let toolName;
  let toolArgs;

  switch (command) {
    case 'health': {
      toolName = 'health';
      toolArgs = {};
      break;
    }

    case 'get_all_components': {
      toolName = 'get_all_components';
      toolArgs = {
        component_library: flags.library || 'React',
        prompt: flags.prompt || `获取所有${flags.library || 'React'}组件列表`,
      };
      break;
    }

    case 'query_components': {
      if (!flags.prompt || !flags.target || !flags.version || !flags['mtd-version'] || !flags['pkg-mgr'] || !flags['build-tool'] || !flags['have-mtd']) {
        console.error('❌ 缺少必填参数，请查看 --help');
        process.exit(1);
      }
      toolName = 'query_components';
      toolArgs = {
        prompt: flags.prompt,
        target: flags.target,
        version: flags.version,
        mtd_version: flags['mtd-version'],
        pkg_mgr: flags['pkg-mgr'],
        build_tool: flags['build-tool'],
        have_mtd_components: flags['have-mtd'],
        theme: flags.theme || '蓝色',
        image_paths: [],
      };
      break;
    }

    case 'query_components_direct': {
      if (!flags.components || !flags.target) {
        console.error('❌ 缺少必填参数，请查看 --help');
        process.exit(1);
      }
      const componentList = flags.components.split(',').map(s => s.trim());
      toolName = 'query_components_direct';
      toolArgs = {
        components: componentList,
        target: flags.target,
        mtd_version: flags['mtd-version'] || 'latest',
        prompt: flags.prompt || `查询组件：${componentList.join('、')}`,
      };
      break;
    }

    case 'friday_query_components': {
      if (!flags.prompt || !flags.target || !flags['mtd-version']) {
        console.error('❌ 缺少必填参数，请查看 --help');
        process.exit(1);
      }
      toolName = 'friday_query_components';
      toolArgs = {
        prompt: flags.prompt,
        target: flags.target,
        mtd_version: flags['mtd-version'],
        image_paths: [],
      };
      break;
    }

    default: {
      console.error(`❌ 未知命令: ${command}`);
      printHelp();
      process.exit(1);
    }
  }

  if (!quiet) {
    console.error(`🔍 调用工具: ${toolName}`);
    console.error(`   参数: ${JSON.stringify(toolArgs)}`);
    console.error('');
  }

  const result = await callMcpTool(toolName, toolArgs);

  if (!quiet) {
    console.error('✅ 调用成功');
    console.error('='.repeat(80));
    console.error('');
  }

  if (typeof result === 'string') {
    console.log(result);
  } else {
    console.log(JSON.stringify(result, null, 2));
  }

  if (!quiet) {
    console.error('');
    console.error('='.repeat(80));
    console.error('✨ 完成');
  }
}

main().catch((err) => {
  console.error('❌ 错误: ' + err.message);
  process.exit(1);
});
