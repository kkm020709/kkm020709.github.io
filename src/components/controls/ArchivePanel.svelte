<script lang="ts">
import { onMount } from "svelte";

import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import { getPostUrlBySlug } from "@/utils/url-utils";

export let tags: string[] = [];
export let categories: string[] = [];
export let sortedPosts: Post[] = [];

const params = new URLSearchParams(window.location.search);
tags = params.has("tag") ? params.getAll("tag") : [];
categories = params.has("category") ? params.getAll("category") : [];
const uncategorized = params.get("uncategorized");

interface Post {
	id: string;
	data: {
		title: string;
		tags: string[];
		category?: string | null;
		published: Date | string;
	};
}

interface MonthGroup {
	month: number;
	label: string;
	posts: Post[];
}

interface YearGroup {
	year: number;
	months: MonthGroup[];
}

let groups: YearGroup[] = [];

function toDate(value: Date | string) {
	return value instanceof Date ? value : new Date(value);
}

function formatDate(date: Date | string) {
	const normalizedDate = toDate(date);
	if (Number.isNaN(normalizedDate.getTime())) return "";
	const month = (normalizedDate.getMonth() + 1).toString().padStart(2, "0");
	const day = normalizedDate.getDate().toString().padStart(2, "0");
	return `${month}-${day}`;
}

function formatMonthLabel(month: number) {
	return `${month.toString().padStart(2, "0")}月`;
}

function formatTag(tagList: string[]) {
	return tagList.map((t) => `#${t}`).join(" ");
}

function countYearPosts(group: YearGroup) {
	return group.months.reduce((sum, monthGroup) => sum + monthGroup.posts.length, 0);
}

onMount(async () => {
	let filteredPosts: Post[] = sortedPosts;

	if (tags.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) =>
				Array.isArray(post.data.tags) &&
				post.data.tags.some((tag) => tags.includes(tag)),
		);
	}

	if (categories.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) => post.data.category && categories.includes(post.data.category),
		);
	}

	if (uncategorized) {
		filteredPosts = filteredPosts.filter((post) => !post.data.category);
	}

	// 按发布时间倒序排序，确保不受置顶影响
	filteredPosts = filteredPosts
		.slice()
		.sort((a, b) => toDate(b.data.published).getTime() - toDate(a.data.published).getTime());

	const groupedByYearAndMonth = filteredPosts.reduce(
		(acc: Record<number, Record<number, Post[]>>, post) => {
			const date = toDate(post.data.published);
			const year = date.getFullYear();
			const month = date.getMonth() + 1;
			if (!acc[year]) {
				acc[year] = {};
			}
			if (!acc[year][month]) {
				acc[year][month] = [];
			}
			acc[year][month].push(post);
			return acc;
		},
		{},
	);

	groups = Object.entries(groupedByYearAndMonth)
		.map(([yearStr, monthMap]) => {
			const months = Object.entries(monthMap)
				.map(([monthStr, posts]) => ({
					month: Number.parseInt(monthStr, 10),
					label: formatMonthLabel(Number.parseInt(monthStr, 10)),
					posts,
				}))
				.sort((a, b) => b.month - a.month);
			return {
				year: Number.parseInt(yearStr, 10),
				months,
			};
		})
		.sort((a, b) => b.year - a.year);
});
</script>

<div class="card-base px-8 py-6">
    {#each groups as group}
        <div>
            <div class="flex flex-row w-full items-center h-15">
                <div class="w-[15%] md:w-[10%] transition text-2xl font-bold text-right text-75">
                    {group.year}
                </div>
                <div class="w-[15%] md:w-[10%]">
                    <div
                            class="h-3 w-3 bg-none rounded-full outline outline-(--primary) mx-auto
                  -outline-offset-2 z-50 outline-3"
                    ></div>
                </div>
                <div class="w-[70%] md:w-[80%] transition text-left text-50">
                    {countYearPosts(group)} {i18n(countYearPosts(group) === 1 ? I18nKey.postCount : I18nKey.postsCount)}
                </div>
            </div>

            {#each group.months as monthGroup}
                <div class="flex flex-row w-full items-center h-10">
                    <div class="w-[15%] md:w-[10%] transition text-sm font-semibold text-right text-50">
                        {monthGroup.label}
                    </div>
                    <div class="w-[15%] md:w-[10%]">
                        <div class="h-1.5 w-1.5 bg-(--primary) rounded-full mx-auto opacity-70"></div>
                    </div>
                    <div class="w-[70%] md:w-[80%] transition text-left text-30 text-sm">
                        {monthGroup.posts.length} 篇
                    </div>
                </div>

                {#each monthGroup.posts as post}
                    <a
                            href={getPostUrlBySlug(post.id)}
                            aria-label={post.data.title}
                            class="group btn-plain block! h-10 w-full rounded-lg hover:text-[initial]"
                    >
                        <div class="flex flex-row justify-start items-center h-full">
                            <!-- date -->
                            <div class="w-[15%] md:w-[10%] transition text-sm text-right text-50">
                                {formatDate(post.data.published)}
                            </div>

                            <!-- dot and line -->
                            <div class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
                                <div
                                        class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5
                           bg-[oklch(0.5_0.05_var(--hue))] group-hover:bg-(--primary)
                           outline outline-4 z-50
                           outline-(--card-bg)
                           group-hover:outline-(--btn-plain-bg-hover)
                           group-active:outline-(--btn-plain-bg-active)"
                                ></div>
                            </div>

                            <!-- post title -->
                            <div
                                    class="w-[70%] md:max-w-[65%] md:w-[65%] text-left font-bold
                         group-hover:translate-x-1 transition-all group-hover:text-(--primary)
                         text-75 pr-8 whitespace-nowrap text-ellipsis overflow-hidden"
                            >
                                {post.data.title}
                            </div>

                            <!-- tag list -->
                            <div
                                    class="hidden md:block md:w-[15%] text-left text-sm transition
                         whitespace-nowrap text-ellipsis overflow-hidden text-30"
                            >
                                {formatTag(post.data.tags)}
                            </div>
                        </div>
                    </a>
                {/each}
            {/each}
        </div>
    {/each}
</div>