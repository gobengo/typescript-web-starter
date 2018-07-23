/**
 * AppBar - component for showing a toolbar across the top of an app
 */
import { createStyles, WithStyles } from "@material-ui/core";
import MaterialUIAppBar from "@material-ui/core/AppBar"; //tslint:disable-line:import-name
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Theme, withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Menu as MenuIcon } from "@material-ui/icons";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import * as React from "react";

// const drawerWidth = 240;

const styles = (theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		flex: {
			flex: 1,
		},
		menuButton: {
			marginLeft: -12,
			// marginRight: 20
		},
		leftButtons: {
			marginRight: "auto",
		},
		titleLink: {
			color: "inherit",
			textDecoration: "none",
			paddingRight: "16px",
		},
		drawerPaper: {
			// position: 'relative',
			// width: drawerWidth,
		},
		drawerHeader: {
			// display: 'flex',
			// alignItems: 'center',
			// justifyContent: 'flex-end',
			// padding: '0 8px',
			...theme.mixins.toolbar,
		},
	});

export const AppBarContents: React.SFC = ({ children }) => (
	<div style={{ padding: "1em" }}>{children}</div>
);

interface AppBarProps extends WithStyles<typeof styles> {
	title?: string;
}

type AppBarWithMenuProps = AppBarProps;
interface AppBarWithMenuState {
	open: boolean;
}
const UnstyledAppBarWithMenu = class extends React.Component<
	AppBarWithMenuProps,
	AppBarWithMenuState
> {
	constructor(props: AppBarWithMenuProps) {
		super(props);
		this.onClickMenuButton = this.onClickMenuButton.bind(this) as ((
			event: React.MouseEvent<HTMLElement>,
		) => void);
		this.toggleDrawer = this.toggleDrawer.bind(this) as ((
			open: boolean,
		) => boolean);
		this.state = {
			open: false,
		};
	}
	/** Handle click event when users clicks on the menu button. Toggle the opened state of the side drawer. */
	public onClickMenuButton(event: React.MouseEvent<HTMLElement>): void {
		this.toggleDrawer();
	}
	/** If drawer is open, close it. If closed, open it. */
	public toggleDrawer(open: boolean = !this.state.open): boolean {
		this.setState({
			open,
		});
		return open;
	}
	/** Call when user wants to close the menu Drawer  */
	public handleDrawerClose = () => {
		this.setState({ open: false });
	};
	/** render Component state+props to go in DOM */
	public render(): React.ReactNode {
		const { classes, title, theme } = this.props;
		return (
			<div className={classes.root}>
				<Drawer anchor="left" open={this.state.open}>
					<div className={classes.drawerHeader}>
						<IconButton onClick={this.handleDrawerClose}>
							{theme && theme.direction === "rtl" ? (
								<ChevronRight />
							) : (
								<ChevronLeft />
							)}
						</IconButton>
					</div>
					<Divider />
					<List component="nav">
						<ListItem button component="a" href="/apps">
							<ListItemText primary="Apps" />
						</ListItem>
						<ListItem button component="a" href="/components">
							<ListItemText primary="Components" />
						</ListItem>
					</List>
					{/* <Divider />
				<List>{otherMailFolderListItems}</List> */}
				</Drawer>
				<MaterialUIAppBar position="static">
					<Toolbar>
						<IconButton
							className={classes.menuButton}
							color="inherit"
							aria-label="Menu"
							onClick={this.onClickMenuButton}
						>
							<MenuIcon />
						</IconButton>
						{title && (
							<a href="/" className={classes.titleLink}>
								<Typography variant="title" color="inherit">
									{title}
								</Typography>
							</a>
						)}
						{/* <Button href="/apps" color="inherit">
							Apps
						</Button>
						<Button href="/components" color="inherit">
							Components
						</Button> */}
					</Toolbar>
				</MaterialUIAppBar>
			</div>
		);
	}
};
export const AppBarWithMenu = withStyles(styles)(UnstyledAppBarWithMenu);

const UnstyledAppBar: React.SFC<AppBarProps> = props => {
	const { classes, title } = props;
	return (
		<div className={classes.root}>
			<MaterialUIAppBar position="static">
				<Toolbar>
					<IconButton
						className={classes.menuButton}
						color="inherit"
						aria-label="Menu"
					>
						<MenuIcon />
					</IconButton>
					{title && (
						<a href="/" className={classes.titleLink}>
							<Typography variant="title" color="inherit">
								{title}
							</Typography>
						</a>
					)}
					<Button href="/apps" color="inherit">
						Apps
					</Button>
					<Button href="/components" color="inherit">
						Components
					</Button>
				</Toolbar>
			</MaterialUIAppBar>
		</div>
	);
};

export const AppBar = withStyles(styles)(UnstyledAppBar);

export default AppBar;
