import {
	LinkPreset,
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/config";
import { siteConfig } from "./siteConfig";

// 根据页面开关动态生成导航栏配置
const getDynamicNavBarConfig = (): NavBarConfig => {
	// 基础导航栏链接
	const links: (NavBarLink | LinkPreset)[] = [
		// 主页
		LinkPreset.Home,

		// 文章
		{
			name: "文章",
			url: "/archive/",
			icon: "material-symbols:article",
		},
	];

	// 自定义导航栏链接,并且支持多级菜单
	links.push({
		name: "链接",
		url: "/links/",
		icon: "material-symbols:link",

		// 子菜单
		children: [
			{
				name: "GitHub",
				url: "https://github.com/kkm020709/kkm020709.github.io",
				external: true,
				icon: "fa7-brands:github",
			},
			{
				name: "Bilibili",
				url: "https://space.bilibili.com/38932988",
				external: true,
				icon: "fa7-brands:bilibili",
			},
		],
	});

	// 项目页
	links.push({
		name: "项目",
		url: "/projects/",
		icon: "material-symbols:deployed-code",
	});

	// 杂谈页
	links.push({
		name: "杂谈",
		url: "/chatter/",
		icon: "material-symbols:chat-outline",
	});

	// 友链
	links.push(LinkPreset.Friends);

	// 根据配置决定是否添加留言板，在siteConfig关闭pages.guestbook时导航栏不显示留言板
	if (siteConfig.pages.guestbook) {
		links.push(LinkPreset.Guestbook);
	}

	// 关于及其子菜单
	links.push({
		name: "关于",
		url: "/content/",
		icon: "material-symbols:info",
		children: [
			...(siteConfig.pages.sponsor
				? [
						{
							name: "赞赏",
							url: "/sponsor/",
							icon: "material-symbols:favorite",
						},
					]
				: []),
			{
				name: "关于我",
				url: "/about/",
				icon: "material-symbols:person",
			},
			{
				name: "更新历史",
				url: "/updates/",
				icon: "material-symbols:history",
			},
			...(siteConfig.pages.bangumi ? [LinkPreset.Bangumi] : []),
		],
	});

	// 仅返回链接，其它导航搜索相关配置在模块顶层常量中独立导出
	return { links } as NavBarConfig;
};

// 导航搜索配置
export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
