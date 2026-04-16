import {
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/config";

// 根据页面开关动态生成导航栏配置
const getDynamicNavBarConfig = (): NavBarConfig => {
	// 按目标站点顺序配置导航栏
	const links: NavBarLink[] = [
		{
			name: "首页",
			url: "/",
			icon: "material-symbols:home",
		},
		{
			name: "项目",
			url: "/projects/",
			icon: "material-symbols:deployed-code",
		},
		{
			name: "归档",
			url: "/archive/",
			icon: "material-symbols:archive",
		},
		{
			name: "照片墙",
			url: "/photowall/",
			icon: "material-symbols:photo-library",
		},
		{
			name: "杂谈",
			url: "/chatter/",
			icon: "material-symbols:chat-outline",
		},
		{
			name: "友链",
			url: "/friends/",
			icon: "material-symbols:group",
		},
		{
			name: "关于",
			url: "/about/",
			icon: "material-symbols:person",
		},
	];

	// 仅返回链接，其它导航搜索相关配置在模块顶层常量中独立导出
	return { links } as NavBarConfig;
};

// 导航搜索配置
export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
