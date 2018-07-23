/**
 * AppCard - component for showing off an App
 */
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as PropTypes from "prop-types";
import * as React from "react";
import { Thing } from "../../types/Thing";

const styles = {
	card: {
		maxWidth: 345,
	},
	mediaWrapper: {
		padding: "1em",
	},
	media: {
		height: 0,
		paddingTop: "100%", // 16:9
		backgroundSize: "contain",
	},
};

type ThingCardClasses = {
	card: string;
	media: string;
	mediaWrapper: string;
};

type Props = {
	thing: Thing;
	classes: ThingCardClasses;
};

const UnstyledAppCard: React.SFC<Props> = (props: Props) => {
	const classes = props.classes || {};
	const thing = props.thing;
	return (
		<Card className={classes.card}>
			<div className={classes.mediaWrapper}>
				<CardMedia
					className={classes.media}
					image={thing.icon}
					title={thing.name}
				/>
			</div>
			<CardContent>
				<Typography variant="headline">{thing.name}</Typography>
				<Typography gutterBottom />
				<Typography>{thing.summary}</Typography>
			</CardContent>
			<CardActions>
				{/* {thing.installable && <Button color="primary">Install</Button>} */}
				{/* {
          thing.url &&
          <Button color="primary" href={thing.url} target="_blank" >
              Learn More
          </Button>
        } */}
			</CardActions>
		</Card>
	);
};

UnstyledAppCard.propTypes = {
	classes: PropTypes.object.isRequired,
};

export const AppCard = withStyles(styles)(UnstyledAppCard);
export default AppCard;
