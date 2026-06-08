import { Plugin, Notice, addIcon } from 'obsidian';

import * as echarts from 'echarts';

import { GitSettings, DEFAULT_SETTINGS, GitSettingsTab } from './settings';
import { pullGit, pushGit, commitGit, syncGit } from './utils';

export default class Main extends Plugin {
    echarts: typeof echarts;
    settings!: GitSettings;

    constructor(app: any, manifest: any) {
        super(app, manifest);
        this.echarts = echarts;
    }

    loadGit() {
        addIcon('github', `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
</svg>`);
        this.addCommand({
            id: 'git-pull',
            name: 'Git Pull',
            callback: () => {
                pullGit(this.app.vault.adapter.getBasePath())
                    .then(() => new Notice('Git Pull successful'))
                    .catch((error) => new Notice(`Git Pull failed: ${error.message}`))
            }
        });
        this.addCommand({
            id: 'git-push',
            name: 'Git Push',
            callback: () => {
                pushGit(this.app.vault.adapter.getBasePath())
                    .then(() => new Notice('Git Push successful'))
                    .catch((error) => new Notice(`Git Push failed: ${error.message}`))
            }
        });
        this.addCommand({
            id: 'git-commit',
            name: 'Git Commit',
            callback: () => {
                commitGit(this.app.vault.adapter.getBasePath(), this.settings.pathSpec)
                    .then(() => new Notice('Git Commit successful'))
                    .catch((error) => new Notice(`Git Commit failed: ${error.message}`))
            }
        });
        this.addCommand({
            id: 'git-sync',
            name: 'Git Sync',
            callback: () => {
                syncGit(this.app.vault.adapter.getBasePath(), this.settings.pathSpec)
                    .then(() => new Notice('Git Sync successful'))
                    .catch((error) => new Notice(`Git Sync failed: ${error.message}`))
            }
        });

        this.addRibbonIcon('github', 'Git Sync', () => {
            syncGit(this.app.vault.adapter.getBasePath(), this.settings.pathSpec)
                .then(() => new Notice('Git Sync successful'))
                .catch((error) => new Notice(`Git Sync failed: ${error.message}`))
        })
    }

    loadECharts() {
        this.registerMarkdownCodeBlockProcessor('echart', async (source) => {
            eval(`${source}
                el.style.width = '100%'
                el.style.aspectRatio = '16 / 9'

                setTimeout(() => {
                    const chart = this.echarts.init(el)
                    chart.setOption(option)
                })
                `
            )
        });
    }

    async onload() {
        console.log('Loading plugin: ' + this.manifest.name);
        await this.loadSettings();
        this.addSettingTab(new GitSettingsTab(this.app, this));

        this.loadGit()
        this.loadECharts()

    }

    async onunload() {
        await this.saveSettings();
        console.log('Unloading plugin: ' + this.manifest.name);
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }
    async saveSettings() {
        await this.saveData(this.settings);
    }
}
