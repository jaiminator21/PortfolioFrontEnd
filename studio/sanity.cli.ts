import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: 'eplgy6nk',
    dataset: 'production',
  },
  /**
   * Standalone Studios auto-update to the latest Sanity release, so bugfixes
   * and features land without a dependency bump or redeploy.
   */
  autoUpdates: true,
});
