/**
 * A bunch of Apps! Use this as fixtures for things that render Apps
 */
import * as slug from "slug";
import { Thing } from "../types/Thing";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

const ensureSlug = (thing: Omit<Thing, "slug">): Thing => ({
	slug: slug(thing.name, slug.defaults.modes.rfc3986),
	...thing,
});

export const things: Thing[] = [
	{
		name: "WordPress",
		tag: [
			{
				name: "Blogging",
			},
		],
		summary:
			"WordPress is open source software you can use to create a beautiful website, blog, or app.",
		url: "https://wordpress.org",
		icon: "https://s.w.org/style/images/about/WordPress-logotype-wmark.png",
		uuid: "bd49294f-c7c7-4727-959f-b5fe8463a342",
	},
	{
		name: "node-solid-server",
		summary:
			"Solid is an exciting new project led by Prof. Tim Berners-Lee, inventor of the World Wide Web, taking place at MIT. The project aims to radically change the way Web applications work today, resulting in true data ownership as well as improved privacy.",
		url: "https://solid.mit.edu/",
		icon: "https://avatars3.githubusercontent.com/u/14262490?s=400&v=4",
		uuid: "d0d9baa1-1347-4e99-b7e4-5320f5eb4e88",
	},
	{
		name: "Jenkins",
		summary:
			"The leading open source automation server, Jenkins provides hundreds of plugins to support building, deploying and automating any project.",
		url: "https://jenkins.io/",
		icon:
			"https://wiki.jenkins.io/download/attachments/2916393/headshot.png?version=1&modificationDate=1302753947000&api=v2",
		uuid: "8ced2661-d345-452f-8f48-13c3e8abdca7",
	},
	{
		name: "GitLab CE",
		url: "https://about.gitlab.com/GitLab/CE",
		icon:
			"https://gitlab.com/gitlab-com/gitlab-artwork/raw/master/logo/logo.png",
		summary:
			"GitLab is the leading integrated product for modern software development. Connecting issue management, version control, code review, CI, CD, and monitoring into a single, easy-to-install application, we help teams go faster from planning to monitoring.",
		uuid: "9b28faa6-e73d-47b7-b3b4-365901016275",
	},
	{
		name: "Launchpad",
		url: "https://launchpad.net/",
		icon:
			"https://pbs.twimg.com/profile_images/454151804/31817-96-20081211154314_400x400.png",
		summary:
			"Launchpad is a web application and website that allows users to develop and maintain software, particularly open-source software.",
		uuid: "62309123-1065-45b0-8bb0-6b39d14043d0",
	},
	{
		name: "Odoo Website Builder",
		url: "https://www.odoo.com/page/website-builder",
		icon:
			"https://c1.iggcdn.com/indiegogo-media-prod-cld/image/upload/f_auto,t_iPhone_retina/v1412696042/s2y7qdz6zh8qqfgeoxg1.png",
		summary:
			"Make a website for free in minutes. Mobile, SEO friendly, awesome with Odoo CMS. Easy, simple website builder for everyone.",
		uuid: "81f3605d-cf5b-4770-a712-a98300b2ee41",
	},
].map(ensureSlug);
