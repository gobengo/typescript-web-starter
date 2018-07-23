/**
 * Matches come back in response to searching with some Filters
 */
export interface Match {
	_id: string;
	display_name: string;
	age: number;
	job_title: string;
	height_in_cm: number;
	city: {
		name: string;
		location: {
			lat: number;
			lon: number;
		};
	};
	main_photo: string;
	compatibility_score: number;
	contacts_exchanged: number;
	favourite: boolean;
	religion: string;
}
