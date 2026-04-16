import type { ProfileConfig } from "../types/config";

export const profileConfig: ProfileConfig = {
	// 头像
	avatar: "https://bu.dusays.com/2026/03/24/69c1e38ac1846.jpg",

	// 名字
	name: "XingHuiSama",

	// 个人签名
	bio: "在代码、学术与分子动力学模拟间穿梭的普通人。近期正埋头于 GROMACS 模拟研究与神经网络计算。",

	// 链接配置
	// 已经预装的图标集：fa7-brands，fa7-regular，fa7-solid，material-symbols，simple-icons
	// 访问https://icones.js.org/ 获取图标代码，
	// 如果想使用尚未包含相应的图标集，则需要安装它
	// `pnpm add @iconify-json/<icon-set-name>`
	// showName: true 时显示图标和名称，false 时只显示图标
	links: [
		{
			name: "Bilibli",
			icon: "fa7-brands:bilibili",
			url: "https://github.com/heiehiehi",
			showName: false,
		},
		{
			name: "X",
			icon: "fa7-brands:github",
			url: "https://github.com/heiehiehi",
			showName: false,
		},
		{
			name: "Mail",
			icon: "fa7-solid:envelope",
			url: "mailto:bilibiliwuwuwu@gmail.com",
			showName: false,
		},
		{
			name: "RSS",
			icon: "fa7-solid:rss",
			url: "/rss/",
			showName: false,
		},
	],
};
