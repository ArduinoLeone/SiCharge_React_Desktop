import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import {
  headerContainerStyles,
  pageTitleStyles,
  rightSectionStyles,
  notificationBadgeStyles,
  logoutButtonStyles,
} from "../styles/Header.styles";

const Header = ({ pageTitle }) => {
  const [notifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
  };

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar sx={headerContainerStyles}>
        <Typography variant="h6" sx={pageTitleStyles}>
          {pageTitle}
        </Typography>

        <Box sx={rightSectionStyles}>
          <IconButton
            color="inherit"
            onClick={handleNotificationClick}
            sx={notificationBadgeStyles}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton
            color="inherit"
            onClick={handleLogout}
            sx={logoutButtonStyles}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>
          <Typography variant="body2">New charging station added</Typography>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Typography variant="body2">System maintenance scheduled</Typography>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Typography variant="body2">New user registration</Typography>
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
