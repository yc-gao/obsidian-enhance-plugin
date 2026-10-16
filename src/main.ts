import { App, Plugin, PluginSettingTab } from 'obsidian';

import { ECHARTS_DEFAULT_SETTINGS, EChartsPlugin } from './echart';
import { GIT_DEFAULT_SETTINGS, GitPlugin } from './git';
import { FOLDER_NOTE_DEFAULT_SETTINGS, FolderNotePlugin } from './folder_note';

const DEFAULT_SETTINGS = {
    git: GIT_DEFAULT_SETTINGS,
    eCharts: ECHARTS_DEFAULT_SETTINGS,
    folderNote: FOLDER_NOTE_DEFAULT_SETTINGS,
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
        this.plugin.folderNotePlugin.displaySettings(containerEl);
    }
}

export default class Main extends Plugin {
    settings!: typeof DEFAULT_SETTINGS;
    eChartsPlugin!: EChartsPlugin;
    gitPlugin!: GitPlugin;
    folderNotePlugin!: FolderNotePlugin;


    async onload() {
        console.log('Loading plugin: ' + this.manifest.name);
        await this.loadSettings();

        this.gitPlugin = new GitPlugin(this, this.settings.git);
        this.eChartsPlugin = new EChartsPlugin(this, this.settings.eCharts);
        this.folderNotePlugin = new FolderNotePlugin(this, this.settings.folderNote);

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
