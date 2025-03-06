export const drawerStyles = {
  width: 5,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 240,
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e0e0e0",
  },
};

export const headerStyles = {
  p: 3,
  textAlign: "center",
  //  borderBottom: "2px solid #e0e0e0",
};

export const headerTypographyStyles = {
  color: "#2196F3",
  fontWeight: 500,
  fontSize: "1.4rem",
};

export const dividerStyles = {
  backgroundColor: "#e0e0e0",
  margin: "4px 0",
};

export const listStyles = {
  mt: 1,
  px: 1,
};

export const listItemStyles = {
  color: "#424242",
  margin: "2px 0",
  transition: "background-color 0.2s ease",
  "&.active": {
    backgroundColor: "#f5f5f5",
    color: "#2196F3",
    borderLeft: "3px solid #2196F3",
  },
  "&:hover": {
    backgroundColor: "#fafafa",
  },
  px: 2,
  py: 1,
};

export const listItemIconStyles = {
  color: "inherit",
  minWidth: "40px",
  "& .MuiSvgIcon-root": {
    fontSize: "1.2rem",
  },
};
