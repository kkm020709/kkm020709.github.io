<script lang="ts">
	import { onMount } from "svelte";
	import { getPostUrlBySlug } from "@/utils/url-utils";
	import { processCoverImageSync } from "@/utils/image-utils";

	export let panelTitle = "归档";
	export let enableFilters = true;
	export let tags: string[] = [];
	export let categories: string[] = [];
	export let sortedPosts: Post[] = [];

	interface Post {
		id: string;
		data: {
			title: string;
			description?: string;
			image?: string;
			tags: string[];
			category?: string | null;
			published: Date | string;
		};
	}

	interface RenderPost {
		id: string;
		title: string;
		description: string;
		publishedText: string;
		tags: string[];
		category: string;
		url: string;
		coverUrl: string;
		requestedCover: boolean;
	}

	let allPosts: RenderPost[] = [];
	let filteredPosts: RenderPost[] = [];
	let categoryOptions: string[] = [];
	let tagOptions: string[] = [];
	let selectedCategory = "all";
	let selectedTag = "";
	let keyword = "";
	let failedCoverIds = new Set<string>();
	let categoryDropdownOpen = false;
	let dropdownRef: HTMLDivElement;
	let mounted = false;

	const params = new URLSearchParams(window.location.search);
	tags = params.has("tag") ? params.getAll("tag") : tags;
	categories = params.has("category") ? params.getAll("category") : categories;
	const uncategorized = params.get("uncategorized");

	function toDate(value: Date | string) {
		return value instanceof Date ? value : new Date(value);
	}

	function formatDate(date: Date | string) {
		const normalizedDate = toDate(date);
		if (Number.isNaN(normalizedDate.getTime())) return "";
		const year = normalizedDate.getFullYear();
		const month = (normalizedDate.getMonth() + 1).toString().padStart(2, "0");
		const day = normalizedDate.getDate().toString().padStart(2, "0");
		return `${year}-${month}-${day}`;
	}

	function normalizeCover(image: string | undefined, id: string) {
		const raw = processCoverImageSync(image, id);
		if (!raw) return "";
		if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/")) {
			return raw;
		}
		return "";
	}

	function normalizeCategory(value?: string | null) {
		const text = (value || "").trim();
		return text.length > 0 ? text : "未分类";
	}

	function applyClientFilters() {
		const keywordText = keyword.trim().toLowerCase();
		filteredPosts = allPosts.filter((post) => {
			const matchedCategory = selectedCategory === "all" || post.category === selectedCategory;
			if (!matchedCategory) return false;
			if (selectedTag && !post.tags.includes(selectedTag)) return false;
			if (!keywordText) return true;
			const tagText = post.tags.join(" ").toLowerCase();
			return (
				post.title.toLowerCase().includes(keywordText) ||
				post.description.toLowerCase().includes(keywordText) ||
				tagText.includes(keywordText)
			);
		});
	}

	function selectCategory(cat: string) {
		selectedCategory = cat;
		categoryDropdownOpen = false;
		// 切换分类后：若当前选中的标签在新分类中不再存在，则清空
		if (selectedTag) {
			const postsInCategory = allPosts.filter(
				(p) => cat === "all" || p.category === cat,
			);
			const tagsAvailable = new Set<string>();
			for (const p of postsInCategory) {
				for (const t of p.tags) tagsAvailable.add(t);
			}
			if (!tagsAvailable.has(selectedTag)) {
				selectedTag = "";
			}
		}
		applyClientFilters();
	}

	function toggleCategoryDropdown() {
		categoryDropdownOpen = !categoryDropdownOpen;
	}

	function selectTag(tag: string) {
		selectedTag = selectedTag === tag ? "" : tag;
		applyClientFilters();
	}

	function handleCoverError(postId: string) {
		if (failedCoverIds.has(postId)) return;
		failedCoverIds = new Set([...failedCoverIds, postId]);
	}

	function handleClickOutside(event: MouseEvent) {
		if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
			categoryDropdownOpen = false;
		}
	}

	$: categoryLabel = selectedCategory === "all" ? "全部分类" : selectedCategory;

	// 标签列表随当前选中分类动态变化：只展示该分类下文章中出现过的标签，按出现次数降序排列
	$: tagOptions = (() => {
		if (!mounted) return [] as string[];
		const postsInCategory =
			selectedCategory === "all"
				? allPosts
				: allPosts.filter((p) => p.category === selectedCategory);
		const tagCount = new Map<string, number>();
		for (const p of postsInCategory) {
			for (const t of p.tags) {
				tagCount.set(t, (tagCount.get(t) || 0) + 1);
			}
		}
		return Array.from(tagCount.entries())
			.sort((a, b) => b[1] - a[1])
			.map(([name]) => name);
	})();

	onMount(() => {
		document.addEventListener("click", handleClickOutside, true);

		let localPosts = sortedPosts.slice();

		if (tags.length > 0) {
			localPosts = localPosts.filter(
				(post) =>
					Array.isArray(post.data.tags) && post.data.tags.some((tag) => tags.includes(tag)),
			);
		}

		if (categories.length > 0) {
			localPosts = localPosts.filter(
				(post) => post.data.category && categories.includes(post.data.category),
			);
		}

		if (uncategorized) {
			localPosts = localPosts.filter((post) => !post.data.category);
		}

		allPosts = localPosts
			.sort((a, b) => toDate(b.data.published).getTime() - toDate(a.data.published).getTime())
			.map((post) => {
				const coverUrl = normalizeCover(post.data.image, post.id);
				return {
					id: post.id,
					title: post.data.title,
					description: (post.data.description || "").trim(),
					publishedText: formatDate(post.data.published),
					tags: post.data.tags || [],
					category: normalizeCategory(post.data.category),
					url: getPostUrlBySlug(post.id),
					coverUrl,
					requestedCover: coverUrl.length > 0,
				};
			});
		categoryOptions = Array.from(new Set(allPosts.map((p) => p.category))).sort((a, b) =>
			a.localeCompare(b, "zh-CN"),
		);
		// 触发响应式 tagOptions 重新计算
		mounted = true;
		applyClientFilters();

		return () => {
			document.removeEventListener("click", handleClickOutside, true);
		};
	});
</script>

<section class="archive-grid-shell card-base px-5 py-5 md:px-6 md:py-6">
	<div class="archive-grid-header">
		<h2>{panelTitle}</h2>
		<p>{filteredPosts.length} 篇文章</p>
	</div>

	{#if enableFilters}
		<div class="archive-filter-bar">
			<input
				type="search"
				placeholder="搜索文章标题、摘要或标签..."
				bind:value={keyword}
				on:input={applyClientFilters}
				aria-label="搜索文章"
			/>
			<div class="category-dropdown" bind:this={dropdownRef}>
				<button
					class="category-trigger"
					on:click={toggleCategoryDropdown}
					aria-expanded={categoryDropdownOpen}
					aria-haspopup="listbox"
				>
					<span class="category-trigger-text">{categoryLabel}</span>
					<svg class="category-chevron" class:open={categoryDropdownOpen} viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
						<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
					</svg>
				</button>
				{#if categoryDropdownOpen}
					<div class="category-panel" role="listbox">
						<button
							class="category-option {selectedCategory === 'all' ? 'active' : ''}"
							on:click={() => selectCategory('all')}
							role="option"
							aria-selected={selectedCategory === 'all'}
						>全部分类</button>
						{#each categoryOptions as cat}
							<button
								class="category-option {selectedCategory === cat ? 'active' : ''}"
								on:click={() => selectCategory(cat)}
								role="option"
								aria-selected={selectedCategory === cat}
							>{cat}</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		{#if tagOptions.length > 0}
			<div class="archive-tag-bar">
				{#each tagOptions as tag}
					<button
						class="tag-pill {selectedTag === tag ? 'active' : ''}"
						on:click={() => selectTag(tag)}
					>#{tag}</button>
				{/each}
			</div>
		{/if}
	{/if}

	{#if filteredPosts.length > 0}
		<div class="archive-grid">
			{#each filteredPosts as post}
				{@const showCover = post.requestedCover && !failedCoverIds.has(post.id)}
				<a
					href={post.url}
					class="archive-card {showCover ? 'has-cover' : post.requestedCover ? 'is-fallback' : 'no-cover'}"
					aria-label={post.title}
				>
					{#if showCover}
						<div class="archive-card-cover">
							<img
								src={post.coverUrl}
								alt={post.title}
								loading="lazy"
								on:error={() => handleCoverError(post.id)}
							/>
							<div class="archive-card-mask"></div>
						</div>
					{/if}
					<div class="archive-card-content">
						<div class="archive-card-date">{post.publishedText}</div>
						<h3>{post.title}</h3>
						{#if post.description}
							<p>{post.description}</p>
						{/if}
						{#if post.tags.length > 0}
							<div class="archive-tags">
								{#each post.tags.slice(0, 3) as tag}
									<span>#{tag}</span>
								{/each}
							</div>
						{/if}
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<div class="archive-empty">当前条件下没有可显示的文章。</div>
	{/if}
</section>

<style>
	.archive-grid-shell {
		display: grid;
		gap: 1rem;
		color: var(--text-color, inherit);
	}

	.archive-grid-header h2 {
		font-size: 1.45rem;
		font-weight: 700;
		line-height: 1.2;
		color: var(--btn-content);
	}

	.archive-grid-header p {
		margin-top: 0.35rem;
		font-size: 0.88rem;
		color: var(--btn-content);
		opacity: 0.72;
	}

	.archive-filter-bar {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.6rem;
	}

	@media (min-width: 900px) {
		.archive-filter-bar {
			grid-template-columns: 1fr 14rem;
		}
	}

	.archive-filter-bar input {
		height: 2.5rem;
		border-radius: 0.75rem;
		border: 1px solid var(--line-divider);
		background: var(--btn-regular-bg);
		color: var(--btn-content);
		padding: 0 0.85rem;
		outline: none;
		font-size: 0.9rem;
	}

	.archive-filter-bar input::placeholder {
		color: var(--btn-content);
		opacity: 0.5;
	}

	.archive-filter-bar input:focus {
		border-color: var(--primary);
	}

	.category-dropdown {
		position: relative;
	}

	.category-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 2.5rem;
		border-radius: 0.75rem;
		border: 1px solid var(--line-divider);
		background: var(--btn-regular-bg);
		padding: 0 0.85rem;
		font-size: 0.9rem;
		color: var(--btn-content);
		cursor: pointer;
		transition: border-color 0.15s ease;
		text-align: left;
	}

	.category-trigger:hover {
		border-color: var(--primary);
	}

	.category-trigger-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex: 1;
	}

	.category-chevron {
		flex-shrink: 0;
		margin-left: 0.4rem;
		opacity: 0.55;
		transition: transform 0.2s ease;
	}

	.category-chevron.open {
		transform: rotate(180deg);
	}

	.category-panel {
		position: absolute;
		top: calc(100% + 0.35rem);
		left: 0;
		right: 0;
		z-index: 50;
		background: var(--card-bg);
		border: 1px solid var(--line-divider);
		border-radius: var(--radius-large);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
		padding: 0.35rem;
		max-height: 16rem;
		overflow-y: auto;
		animation: dropdownFadeIn 0.15s ease;
	}

	:global(.dark) .category-panel {
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
	}

	@keyframes dropdownFadeIn {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.category-option {
		display: block;
		width: 100%;
		text-align: left;
		padding: 0.5rem 0.75rem;
		border: none;
		background: none;
		font-size: 0.88rem;
		color: var(--btn-content);
		border-radius: calc(var(--radius-large) - 2px);
		cursor: pointer;
		transition: background 0.12s ease, color 0.12s ease;
	}

	.category-option:hover {
		background: var(--btn-plain-bg-hover);
	}

	.category-option.active {
		color: var(--primary);
		font-weight: 600;
		background: var(--btn-plain-bg-hover);
	}

	.archive-tag-bar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		padding: 0.5rem 0;
	}

	.tag-pill {
		font-size: 0.78rem;
		padding: 0.22rem 0.65rem;
		border-radius: 999px;
		border: 1px solid var(--line-divider);
		background: var(--btn-regular-bg);
		color: var(--btn-content);
		cursor: pointer;
		transition: all 0.15s ease;
		opacity: 0.82;
	}

	.tag-pill:hover {
		border-color: var(--primary);
		opacity: 1;
	}

	.tag-pill.active {
		background: var(--primary);
		color: #fff;
		border-color: var(--primary);
		opacity: 1;
	}

	.archive-grid {
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 1fr));
		gap: 0.9rem;
	}

	@media (min-width: 900px) {
		.archive-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.archive-card {
		display: flex;
		flex-direction: column;
		border-radius: var(--radius-large);
		overflow: hidden;
		border: 1px solid var(--line-divider);
		background: var(--card-bg);
		transition: transform 0.18s ease, border-color 0.18s ease;
	}

	.archive-card:hover {
		transform: translateY(-2px);
		border-color: var(--primary);
	}

	.archive-card.has-cover {
		min-height: 286px;
	}

	.archive-card.is-fallback {
		min-height: 286px;
	}

	.archive-card.no-cover {
		min-height: 145px;
	}

	.archive-card-cover {
		position: relative;
		height: 132px;
	}

	.archive-card-cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.archive-card-mask {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.32));
	}

	.archive-card-content {
		padding: 0.85rem 0.95rem 0.95rem;
		display: grid;
		gap: 0.5rem;
	}

	.archive-card.is-fallback .archive-card-content {
		min-height: 286px;
		align-content: center;
	}

	.archive-card-date {
		font-size: 0.74rem;
		color: var(--btn-content);
		opacity: 0.68;
	}

	.archive-card h3 {
		font-size: 1.05rem;
		font-weight: 700;
		line-height: 1.35;
		color: var(--btn-content);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.archive-card p {
		font-size: 0.84rem;
		color: var(--btn-content);
		opacity: 0.75;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.archive-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		margin-top: 0.2rem;
	}

	.archive-tags span {
		font-size: 0.72rem;
		padding: 0.12rem 0.42rem;
		border-radius: 999px;
		background: var(--btn-regular-bg);
		color: var(--btn-content);
		opacity: 0.82;
	}

	.archive-empty {
		border-radius: var(--radius-large);
		padding: 1rem;
		background: var(--btn-regular-bg);
		border: 1px dashed var(--line-divider);
		font-size: 0.9rem;
		color: var(--btn-content);
		opacity: 0.78;
	}
</style>