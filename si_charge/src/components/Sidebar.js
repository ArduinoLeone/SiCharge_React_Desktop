import React from "react";
import { NavLink } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import {
  Home as HomeIcon,
  Message as MessageIcon,
  LocationOn as LocationOnIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import {
  drawerStyles,
  headerStyles,
  headerTypographyStyles,
  dividerStyles,
  listStyles,
  listItemStyles,
  listItemIconStyles,
} from "../styles/Sidebar.styles";

const Sidebar = () => {
  const menuItems = [
    { id: 1, title: "Home", icon: <HomeIcon />, path: "/" },
    { id: 2, title: "Messaggi", icon: <MessageIcon />, path: "/messaggi" },
    {
      id: 3,
      title: "Gestione POI",
      icon: <LocationOnIcon />,
      path: "/gestione-poi",
    },
    { id: 4, title: "Utenti", icon: <PeopleIcon />, path: "/utenti" },
    { id: 5, title: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  return (
    <Drawer variant="permanent" sx={drawerStyles}>
      <Box sx={headerStyles}>
        <Typography variant="h6" sx={headerTypographyStyles}>
          Si Charge
        </Typography>
      </Box>
      <Divider sx={dividerStyles} />
      <List sx={listStyles}>
        {menuItems.map((item) => (
          <ListItem
            key={item.id}
            component={NavLink}
            to={item.path}
            sx={listItemStyles}
          >
            <ListItemIcon sx={listItemIconStyles}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
