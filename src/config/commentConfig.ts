import type { CommentConfig } from "../types/config";

export const commentConfig: CommentConfig = {
	// 评论系统类型: none, twikoo, waline, giscus, disqus, artalk, livere, changyan
	type: "changyan",

	//twikoo评论系统配置
	twikoo: {
		envId: "https://twikoo.vercel.app",
		// 设置 Twikoo 评论系统语言
		lang: "zh-CN",
		// 是否启用文章访问量统计功能
		visitorCount: true,
	},

	//waline评论系统配置
	waline: {
		// waline 后端服务地址
		serverURL: "https://waline.vercel.app",
		// 设置 Waline 评论系统语言
		lang: "zh-CN",
		// 评论登录模式。可选值如下：
		//   'enable'   —— 默认，允许访客匿名评论和用第三方 OAuth 登录评论，兼容性最佳。
		//   'force'    —— 强制必须登录后才能评论，适合严格社区，关闭匿名评论。
		//   'disable'  —— 禁止所有登录和 OAuth，仅允许匿名评论（填写昵称/邮箱），适用于极简留言。
		login: "enable",
		// 是否启用文章访问量统计功能
		visitorCount: true,
	},

	// artalk评论系统配置
	artalk: {
		// artalk后端程序 API 地址
		server: "https://artalk.example.com/",
		// 设置 Artalk 语言
		locale: "zh-CN",
		// 是否启用文章访问量统计功能
		visitorCount: true,
	},

	//giscus评论系统配置
	giscus: {
		repo: "kkm020709/kkm020709.github.io",
		repoId: "R_kgDOOTaRlw",
		category: "General",
		categoryId: "DIC_kwDOOTaRl84CljPo",
		mapping: "pathname",
		strict: "0",
		reactionsEnabled: "1",
		emitMetadata: "0",
		inputPosition: "top",
		lang: "zh-CN",
		loading: "lazy",
	},

	//disqus评论系统配置
	disqus: {
		// 获取 Disqus 评论系统
		shortname: "firefly",
	},

	// 来必力评论系统配置
	livere: {
		clientId: "Hg10QI9zkzDIkj5057p8",
	},

	// 畅言云评评论系统配置
	changyan: {
		appid: "cyytf2mpR",
		conf: "prod_78a8d14b1f4c69156018901bbdf9571f",
	},
};
