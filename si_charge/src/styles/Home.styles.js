export const containerStyles = {
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export const searchContainerStyles = {
  display: "flex",
  alignItems: "center",
  gap: 2,
};

export const searchInputStyles = {
  flex: 1,
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    borderRadius: "8px",
  },
};

export const filterButtonStyles = {
  borderRadius: "8px",
  textTransform: "none",
  backgroundColor: "#fff",
  color: "#000",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
};

export const filterChipsContainerStyles = {
  display: "flex",
  gap: 1,
  flexWrap: "wrap",
};

export const chipStyles = {
  borderRadius: "6px",
  fontWeight: 500,
  cursor: "pointer",
  border: "none",
  "&:hover": {
    opacity: 0.85,
  },
};

export const mapContainerStyles = {
  height: "calc(100vh - 340px)",
  width: "100%",
  borderRadius: "12px",
  overflow: "hidden",
};

export const mapStyles = {
  height: "100%",
  width: "100%",
  "& .leaflet-tile-pane": {
    filter:
      "brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7)",
  },
};
