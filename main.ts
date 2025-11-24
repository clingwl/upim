import { App, Plugin, PluginSettingTab, Setting, TFile, Notice, Modal, ButtonComponent } from 'obsidian';

interface UPIMSettings {
	apiUrl: string;
	token: string;
}

const DEFAULT_SETTINGS: UPIMSettings = {
	apiUrl: '',
	token: ''
}

export default class UPIMPlugin extends Plugin {
	settings: UPIMSettings;

	async onload() {
		await this.loadSettings();

		// 添加侧边栏按钮
		this.addRibbonIcon('image', 'Upload Image', () => {
			this.uploadImage();
		});

		// 添加设置标签页
		this.addSettingTab(new UPIMSettingTab(this.app, this));
	}

	onunload() {
		// 清理资源
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async uploadImage() {
		// 检查设置
		if (!this.settings.apiUrl || !this.settings.token) {
			new Notice('请先在设置中配置API地址和Token');
			return;
		}

		// 打开文件选择器
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.multiple = true;

		input.onchange = async (event) => {
			const files = (event.target as HTMLInputElement).files;
			if (!files || files.length === 0) return;

			await this.processFiles(Array.from(files));
		};

		input.click();
	}

	async processFiles(files: File[]) {
		let successCount = 0;
		let failCount = 0;

		for (const file of files) {
			try {
				new Notice(`正在上传: ${file.name}`);
				const result = await this.uploadToEasyImage(file);
				if (result) {
					this.insertImageLink(result);
					successCount++;
				}
			} catch (error) {
				console.error(`Upload failed for ${file.name}:`, error);
				new Notice(`上传失败 ${file.name}: ${error.message}`);
				failCount++;
			}
		}

		if (successCount > 0) {
			new Notice(`成功上传 ${successCount} 个文件${failCount > 0 ? `，失败 ${failCount} 个` : ''}`);
		} else if (failCount > 0) {
			new Notice(`所有文件上传失败`);
		}
	}

	async uploadToEasyImage(file: File): Promise<string | null> {
		const formData = new FormData();
		formData.append('image', file);
		formData.append('token', this.settings.token);

		try {
			const response = await fetch(`${this.settings.apiUrl}/api/index.php`, {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();

			// 根据EasyImages2.0 API响应格式
			if (data.result === 'success' && data.code === 200 && data.url) {
				return data.url;
			} else {
				throw new Error('上传失败：' + (data.msg || '未知错误'));
			}
		} catch (error) {
			console.error('Upload error:', error);
			throw error;
		}
	}

	async insertImageLink(imageUrl: string) {
		const activeView = this.app.workspace.getActiveViewOfType(import('obsidian').MarkdownView);
		if (!activeView) {
			new Notice('请先打开一个markdown文件');
			return;
		}

		const editor = activeView.editor;
		const cursor = editor.getCursor();

		// 从URL中提取文件名作为alt文本
		const urlParts = imageUrl.split('/');
		const fileName = urlParts[urlParts.length - 1];
		const altText = fileName.split('.')[0] || 'image';

		// 插入markdown格式的图片链接
		editor.replaceRange(`![${altText}](${imageUrl})\n`, cursor);
	}

	async testConnection(): Promise<boolean> {
		try {
			// EasyImages2.0 没有专门的测试接口，我们尝试访问根路径
			const response = await fetch(this.settings.apiUrl, {
				method: 'GET',
			});

			if (response.ok) {
				new Notice('API地址连接成功，请确保Token正确');
				return true;
			} else {
				new Notice(`API连接测试失败: HTTP ${response.status}`);
				return false;
			}
		} catch (error) {
			new Notice(`API连接测试失败: ${error.message}`);
			return false;
		}
	}
}

class UPIMSettingTab extends PluginSettingTab {
	plugin: UPIMPlugin;

	constructor(app: App, plugin: UPIMPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();

		containerEl.createEl('h2', {text: 'UPIM 设置'});

		new Setting(containerEl)
			.setName('API 地址')
			.setDesc('EasyImages2.0 图床的完整URL地址（例如：https://your-domain.com）')
			.addText(text => text
				.setPlaceholder('https://your-domain.com')
				.setValue(this.plugin.settings.apiUrl)
				.onChange(async (value) => {
					this.plugin.settings.apiUrl = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Token')
			.setDesc('EasyImages2.0 的访问Token（在tokenList文件中获取）')
			.addText(text => text
				.setPlaceholder('your-token-here')
				.setValue(this.plugin.settings.token)
				.onChange(async (value) => {
					this.plugin.settings.token = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('测试连接')
			.setDesc('测试与API的连接')
			.addButton(button => button
				.setButtonText('测试')
				.setCta()
				.onClick(async () => {
					await this.plugin.testConnection();
				}));
	}
}
