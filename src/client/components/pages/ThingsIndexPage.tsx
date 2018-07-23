/**
 * ThingsIndexPage: Where an end-user can browse all the Things
 */
import {
	createStyles,
	Grid,
	Theme,
	Typography,
	withStyles,
	WithStyles,
} from "@material-ui/core";
import * as React from "react";
import { things } from "../../../etc/things";
import ThingCard from "../ThingCard";

const styles = (theme: Theme) =>
	createStyles({
		thingCard: {
			width: "100%",
			// linkifying whole card, so we don't want everything underlined
			textDecoration: "inherit",
		},
	});

interface Props extends WithStyles<typeof styles> {
	// title?: string
}

export const ThingsIndexPage = withStyles(styles)((props: Props) => (
	<div>
		<Typography variant="display2" gutterBottom>
			Things
		</Typography>
		<Typography paragraph>
			Learn about web apps that you can use in your projects and groups.
		</Typography>
		<Typography paragraph>
			Every app here includes free, public source code. You can run the app
			wherever you want, instead of having to trust the app developer to keep
			your data safe. Anyone, not just one company, can add features and fix
			security holes.
		</Typography>
		<Typography paragraph>
			We're all working together to make these apps great.
		</Typography>
		<Grid container spacing={8}>
			{things.map(thing => (
				<React.Fragment key={thing.uuid}>
					<Grid item>
						<div style={{ width: "100%" }}>
							<a
								role="button"
								href={`/things/${thing.slug}`}
								className={props.classes.thingCard}
							>
								<ThingCard thing={thing} />
							</a>
						</div>
					</Grid>
				</React.Fragment>
			))}
		</Grid>
	</div>
));
