import handler, { createScheduledHandler, PluginBridge } from '@emdash-cms/cloudflare/worker';

export { PluginBridge };

export default {
  ...handler,
  // Cron trigger (wrangler.jsonc) drives scheduled publishing and maintenance.
  scheduled: createScheduledHandler(),
} satisfies ExportedHandler;
