/**
 * Types related to Things.
 * Things are just a generic thing I made up to demo this repo.
 */
export interface Thing {
	name: string;
	summary: string;
	url: string;
	icon: string;
	uuid: string;
	slug: string;
	tag: Tag[];
}

interface Tag {
	name: string;
}
