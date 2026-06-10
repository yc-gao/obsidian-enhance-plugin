import { App, Plugin, PluginSettingTab } from 'obsidian';

import { EChartsPlugin } from './echart';
import { GIT_DEFAULT_SETTINGS, GitPlugin } from './git';

const DEFAULT_SETTINGS = {
    git: GIT_DEFAULT_SETTINGS
};

class SettingsTab extends PluginSettingTab {
    plugin: any;

    constructor(app: App, plugin: any) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        this.plugin.gitPlugin.displaySettings(containerEl);
        this.plugin.eChartsPlugin.displaySettings(containerEl);
    }
}

export default class Main extends Plugin {
    settings!: typeof DEFAULT_SETTINGS;
    eChartsPlugin!: EChartsPlugin;
    gitPlugin!: GitPlugin;


    async onload() {
        console.log('Loading plugin: ' + this.manifest.name);
        await this.loadSettings();

        this.eChartsPlugin = new EChartsPlugin(this);
        this.gitPlugin = new GitPlugin(this, this.settings.git);

        this.gitPlugin.load()
        this.eChartsPlugin.load()

        this.addSettingTab(new SettingsTab(this.app, this));
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
