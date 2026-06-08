import { PluginSettingTab, App, Setting } from 'obsidian';

export interface GitSettings {
    pathSpec: string;
}
export const DEFAULT_SETTINGS: GitSettings = {
    pathSpec: '.'
};

export class GitSettingsTab extends PluginSettingTab {
    plugin: any;

    constructor(app: App, plugin: any) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        new Setting(containerEl)
            .setName('Paths To Sync')
            .addText(text => text.setValue(this.plugin.settings.pathSpec).onChange(async (value) => {
                this.plugin.settings.pathSpec = value;
                await this.plugin.saveSettings();
            }));
    }
}