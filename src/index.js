#!/usr/bin/env node
// fallhome-us-mcp · MCP stdio server wrapping fallhome-us-sdk · MIT · AI-Native Solutions
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server({ name: 'fallhome-us-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });

const TOOLS = [
  {
    name: 'fallhome-us_load_config',
    description: 'loadConfig · from fallhome-us-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { loadConfig } = await import('@ai-native-solutions/fallhome-us-sdk');
      return typeof loadConfig === 'function' ? await loadConfig(args) : { error: 'loadConfig not callable' };
    }
  },
  {
    name: 'fallhome-us_save_config',
    description: 'saveConfig · from fallhome-us-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { saveConfig } = await import('@ai-native-solutions/fallhome-us-sdk');
      return typeof saveConfig === 'function' ? await saveConfig(args) : { error: 'saveConfig not callable' };
    }
  },
  {
    name: 'fallhome-us_$',
    description: '$ · from fallhome-us-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { $ } = await import('@ai-native-solutions/fallhome-us-sdk');
      return typeof $ === 'function' ? await $(args) : { error: '$ not callable' };
    }
  },
  {
    name: 'fallhome-us_esc',
    description: 'esc · from fallhome-us-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { esc } = await import('@ai-native-solutions/fallhome-us-sdk');
      return typeof esc === 'function' ? await esc(args) : { error: 'esc not callable' };
    }
  },
  {
    name: 'fallhome-us_ai_tier',
    description: 'aiTier · from fallhome-us-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { aiTier } = await import('@ai-native-solutions/fallhome-us-sdk');
      return typeof aiTier === 'function' ? await aiTier(args) : { error: 'aiTier not callable' };
    }
  },
  {
    name: 'fallhome-us_render_ai_chip',
    description: 'renderAiChip · from fallhome-us-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { renderAiChip } = await import('@ai-native-solutions/fallhome-us-sdk');
      return typeof renderAiChip === 'function' ? await renderAiChip(args) : { error: 'renderAiChip not callable' };
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ handler, ...rest }) => rest)
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const t = TOOLS.find(x => x.name === req.params.name);
  if (!t) throw new Error('unknown tool: ' + req.params.name);
  const result = await t.handler(req.params.arguments || {});
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

await server.connect(new StdioServerTransport());
console.error('fallhome-us-mcp v1.0.0 · stdio ready');
