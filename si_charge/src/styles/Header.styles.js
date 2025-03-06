import { colors } from "./theme";

export const headerContainerStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 24px",
  backgroundColor: colors.background.paper,
  // marginBottom: 0,
  // borderBottom: "1px solid rgba(0, 0, 0, 0.3)",
  // position: "sticky",
  // top: 0,
  //zIndex: 1000,
};

export const pageTitleStyles = {
  fontSize: "1.25rem",
  fontWeight: 600,
  color: colors.text.primary,
  letterSpacing: "-0.025em",
};

export const rightSectionStyles = {
  display: "flex",
  alignItems: "center",
  gap: 2,
};

export const notificationBadgeStyles = {
  "& .MuiBadge-badge": {
    backgroundColor: colors.notification.badge,
    color: colors.text.light,
    minWidth: "20px",
    height: "20px",
    padding: "0 6px",
    fontSize: "0.75rem",
  },
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    transition: "background-color 0.2s ease",
  },
  borderRadius: "8px",
  padding: "8px",
};

export const logoutButtonStyles = {
  color: colors.text.secondary,
  borderRadius: "8px",
  padding: "8px",
  minWidth: "auto",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    transition: "background-color 0.2s ease",
  },
};
