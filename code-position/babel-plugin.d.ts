import { PluginObj, PluginPass } from '@babel/core';

export interface InspectorBabelPluginOptions {
  /**
   * Current working directory
   */
  cwd?: string;
  /**
   * Array of file/directory patterns to exclude from processing
   * @default []
   */
  excludes?: string[];
}

/**
 * Babel plugin for react-dev-inspector
 * @param babel - Babel instance
 * @param options - Plugin options
 * @returns Babel plugin object
 */
declare function InspectorBabelPlugin(
  babel: typeof import('@babel/core'),
  options?: InspectorBabelPluginOptions
): PluginObj<PluginPass>;

export default InspectorBabelPlugin;
