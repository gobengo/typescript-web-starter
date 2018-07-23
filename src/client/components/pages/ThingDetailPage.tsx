/**
 * Component for AppDetailpage.
 * User can view all details for a given App.
 */
import {
	Button,
	createStyles,
	Grid,
	Paper,
	Theme,
	Typography,
	withStyles,
	WithStyles,
} from "@material-ui/core";
import { Link as WebsiteIcon } from "@material-ui/icons";
import * as classnames from "classnames";
import * as React from "react";
import { Thing } from "../../../types/Thing";

const sampleThing: Thing = {
	name: "WordPress",
	slug: "wordpress",
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
};

const styles = (theme: Theme) =>
	createStyles({
		thingCard: {
			...theme.mixins.gutters(),
			paddingTop: theme.spacing.unit * 2,
			paddingBottom: theme.spacing.unit * 2,
			width: "100%",
		},
		thingDetails: {
			marginTop: theme.spacing.unit,
		},
		icon: {
			width: "100%",
			// margin: `0 1em 0 0`,
		},
		websiteButton: {},
		button: {
			marginTop: theme.spacing.unit,
		},
		leftIcon: {
			marginRight: theme.spacing.unit,
		},
		rightIcon: {
			marginLeft: theme.spacing.unit,
		},
		iconSmall: {
			fontSize: 20,
		},
		popoverContents: {
			margin: theme.spacing.unit * 2,
		},
	});

interface Props extends WithStyles<typeof styles> {
	thing: Thing;
}

const WebsiteButton: React.SFC<{ thing: Thing } & WithStyles<typeof styles>> = ({
	thing,
	classes,
}) => (
	<Button
		href={thing.url}
		target="_blank"
		variant="outlined"
		color="default"
		className={classes.button}
	>
		Website
		<WebsiteIcon className={classnames(classes.iconSmall, classes.rightIcon)} />
	</Button>
);

type HandleClick = (event: React.MouseEvent<HTMLElement>) => void;
type HandleClose = () => void;

interface ButtonWithPopoverProps {
	children(props: {
		anchorEl: HTMLElement | null;
		handleClick(event: React.MouseEvent<HTMLElement>): void;
		handleClose(): void;
	}): React.ReactNode;
}
export const ButtonWithPopover = class extends React.Component<
	ButtonWithPopoverProps,
	{ anchorEl: HTMLElement | null }
> {
	constructor(props: ButtonWithPopoverProps) {
		super(props);
		this.state = {
			anchorEl: null,
		};
		this.handleClick = this.handleClick.bind(this) as HandleClick;
		this.handleClose = this.handleClose.bind(this) as HandleClose;
	}
	/** Event handle for when user clicks on the button. Set state that popover should be opened where clicked. */
	public handleClick(event: React.MouseEvent<HTMLElement>): void {
		this.setState({
			anchorEl: event.currentTarget,
		});
	}
	/** Called when user clicks out of an opened Popover. Set state that popover should be closed. */
	public handleClose(): void {
		this.setState({
			anchorEl: null,
		});
	}
	/** render Component to go in DOM */
	public render(): React.ReactNode {
		const { children } = this.props;
		return (
			<span>
				{children({
					handleClick: this.handleClick,
					handleClose: this.handleClose,
					anchorEl: this.state.anchorEl,
				})}
			</span>
		);
	}
};

// const LikeButton: React.SFC<{ thing: Thing } & WithStyles<typeof styles>> = ({ app, classes }) => (
// 	<Button  variant="outlined" color="secondary" className={classes.button}>
// 		Like
// 		{/* <WebsiteIcon className={classes.rightIcon} /> */}
// 	</Button>
// )

interface WishlistButtonProps {
	children(
		inWishlist: boolean,
		handleClick: (e: React.MouseEvent<HTMLElement>) => void,
	): React.ReactNode;
}
const WishlistButton = class extends React.Component<
	WishlistButtonProps,
	{ inWishlist: boolean }
> {
	constructor(props: WishlistButtonProps) {
		super(props);
		this.state = {
			inWishlist: false,
		};
		this.handleClick = this.handleClick.bind(this) as HandleClick;
	}
	/** Called when user clicks on button. Should reflect that user has added item to Wishlist */
	public handleClick(event: React.MouseEvent<HTMLElement>): void {
		this.setState({
			inWishlist: !this.state.inWishlist,
		});
	}
	/** Render Component state/props for DOM */
	public render(): React.ReactNode {
		return this.props.children(this.state.inWishlist, this.handleClick);
	}
};

// tslint:disable-next-line:max-func-body-length
export const ThingDetailPage = withStyles(styles)((props: Props) => (
	<div>
		<Grid container spacing={16}>
			<React.Fragment key={props.thing.uuid}>
				<Grid item xs={12}>
					<Paper className={props.classes.thingCard}>
						<Grid container spacing={16}>
							<Grid item xs={3} sm={2}>
								<img
									src={props.thing.icon}
									className={props.classes.icon}
									alt={`icon for thing ${props.thing.name}`}
								/>
							</Grid>

							<Grid item xs>
								<Typography variant="headline">{props.thing.name}</Typography>
								<Typography variant="subheading">Code Collaboration</Typography>
							</Grid>
						</Grid>
						<Grid container spacing={16}>
							<Grid item xs={12} className={props.classes.thingDetails}>
								<Typography>{props.thing.summary}</Typography>
							</Grid>

							<Grid item xs={12}>
								<Grid container spacing={8} alignContent="flex-end">
									<Grid item>
										<WishlistButton>
											{(added: boolean, handleClick) =>
												added ? (
													<Button
														onClick={handleClick}
														variant="outlined"
														color="secondary"
														className={props.classes.button}
													>
														Remove from Wishlist
													</Button>
												) : (
													<Button
														onClick={handleClick}
														variant="contained"
														color="secondary"
														className={props.classes.button}
													>
														Add to Wishlist
													</Button>
												)
											}
										</WishlistButton>
									</Grid>

									<Grid item>
										<WebsiteButton thing={props.thing} classes={props.classes} />
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
			</React.Fragment>
		</Grid>
	</div>
));

const main = async () => {
	const { cli } = await import("../../../cli");
	await cli(() => <ThingDetailPage thing={sampleThing} />);
};

if (require.main === module) {
	main().catch((e: Error) => {
		throw e;
	});
}
