import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  TextField,
  Button,
  Chip,
  InputAdornment,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
  Divider,
  Autocomplete,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  containerStyles,
  searchContainerStyles,
  searchInputStyles,
  filterButtonStyles,
  filterChipsContainerStyles,
  chipStyles,
  mapContainerStyles,
  mapStyles,
} from "../styles/Home.styles";
import chargingStationsData from "../data/charging-stations.json";

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Componente per gestire lo zoom della mappa
const MapController = ({ coordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (coordinates) {
      map.setView(coordinates, 16);
    }
  }, [coordinates, map]);

  return null;
};

const Home = () => {
  const [searchValue, setSearchValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [activeQuickFilters, setActiveQuickFilters] = useState(["showAll"]);
  const [filteredStations, setFilteredStations] = useState(
    chargingStationsData.stations
  );
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const center = [37.5579, 14.1368]; // Centro della Sicilia

  // Estrai tutti gli indirizzi unici dalle stazioni
  const availableAddresses = useMemo(() => {
    const addresses = chargingStationsData.stations.map((station) => ({
      address: station.address,
      city: station.address.split(",").pop().trim(),
    }));
    return addresses.sort((a, b) => a.city.localeCompare(b.city));
  }, []);

  useEffect(() => {
    const filtered = chargingStationsData.stations.filter((station) => {
      // Filtro per indirizzo
      if (searchValue) {
        const addressMatch = station.address
          .toLowerCase()
          .includes(searchValue.toLowerCase());
        if (!addressMatch) return false;
      }

      // Filtro per operatore (quick filters)
      if (activeQuickFilters.length > 0) {
        // Se "Visualizza tutti" è attivo, mostra tutte le stazioni
        if (activeQuickFilters.includes("showAll")) {
          return true;
        }
        // Altrimenti filtra per gli operatori selezionati
        if (!activeQuickFilters.includes(station.operator)) {
          return false;
        }
      }

      // Filtro per stato della colonnina
      if (selectedFilters.available && station.status !== "available")
        return false;
      if (selectedFilters.occupied && station.status !== "occupied")
        return false;
      if (selectedFilters.maintenance && station.status !== "maintenance")
        return false;

      // Filtro per tipo di connettore
      const hasMatchingConnector = station.connectors.some((connector) => {
        // Se nessun filtro connettore è selezionato, mostra tutti
        const noConnectorFilterSelected =
          !selectedFilters.type2 &&
          !selectedFilters.ccs &&
          !selectedFilters.chademo;

        // Verifica se il tipo di connettore corrisponde ai filtri selezionati
        const matchesType =
          noConnectorFilterSelected || selectedFilters[connector.type];

        // Filtro per potenza
        const powerCategory = getPowerCategory(connector.power);
        const noPowerFilterSelected =
          !selectedFilters.slow &&
          !selectedFilters.medium &&
          !selectedFilters.fast &&
          !selectedFilters.ultrafast;

        const matchesPower =
          noPowerFilterSelected || selectedFilters[powerCategory];

        return matchesType && matchesPower;
      });

      return hasMatchingConnector;
    });

    setFilteredStations(filtered);
  }, [activeQuickFilters, selectedFilters, searchValue]);

  const getPowerCategory = (power) => {
    if (power <= 7.4) return "slow";
    if (power <= 22) return "medium";
    if (power <= 50) return "fast";
    return "ultrafast";
  };

  const filterCategories = {
    "Stato Colonnina": [
      { id: "available", label: "Disponibile" },
      { id: "occupied", label: "Occupata" },
      { id: "maintenance", label: "In Manutenzione" },
    ],
    "Tipo di Connettore": [
      { id: "type2", label: "Type 2" },
      { id: "ccs", label: "CCS" },
      { id: "chademo", label: "CHAdeMO" },
    ],
    Potenza: [
      { id: "slow", label: "Lenta (≤ 7.4 kW)" },
      { id: "medium", label: "Media (≤ 22 kW)" },
      { id: "fast", label: "Veloce (≤ 50 kW)" },
      { id: "ultrafast", label: "Ultra-veloce (> 50 kW)" },
    ],
  };

  const quickFilters = [
    { id: "showAll", label: "Visualizza tutti", color: "#4CAF50" },
    { id: "enel_x", label: "Enel X", color: "#00488F" },
    { id: "be_charge", label: "Be Charge", color: "#00B0B9" },
    { id: "a2a", label: "A2A E-moving", color: "#FF8F19" },
    { id: "tesla", label: "Tesla", color: "#E31937" },
    { id: "ionity", label: "Ionity", color: "#2C5DFE" },
    { id: "free_to_x", label: "Free To X", color: "#009DE0" },
  ];

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (filterId) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterId]: !prev[filterId],
    }));
  };

  const getSelectedFiltersCount = () => {
    return Object.values(selectedFilters).filter(Boolean).length;
  };

  const handleQuickFilterClick = (filterId) => {
    setActiveQuickFilters((prev) => {
      // Se si clicca su "Visualizza tutti"
      if (filterId === "showAll") {
        // Se era già attivo, lo disattiva
        if (prev.includes(filterId)) {
          return [];
        }
        // Se era disattivo, lo attiva e disattiva tutti gli altri
        return ["showAll"];
      }
      
      // Se si clicca su un altro filtro
      const newFilters = prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev.filter(id => id !== "showAll"), filterId];
      
      // Se non ci sono filtri attivi, riattiva "Visualizza tutti"
      return newFilters.length === 0 ? ["showAll"] : newFilters;
    });
  };

  const handleSearchChange = (event, newValue) => {
    setSearchValue(newValue ? newValue.address : "");
    if (newValue) {
      const selectedStation = chargingStationsData.stations.find(
        (station) => station.address === newValue.address
      );
      if (selectedStation) {
        setSelectedCoordinates(selectedStation.coordinates);
      }
    } else {
      setSelectedCoordinates(null);
    }
  };

  // Funzione per filtrare e ordinare i suggerimenti
  const filterOptions = (options, { inputValue }) => {
    if (inputValue.length < 2) return [];

    return options
      .filter((option) => {
        const matchAddress = option.address
          .toLowerCase()
          .includes(inputValue.toLowerCase());
        const matchCity = option.city
          .toLowerCase()
          .includes(inputValue.toLowerCase());
        return matchAddress || matchCity;
      })
      .sort((a, b) => {
        // Priorità agli indirizzi che iniziano con il testo cercato
        const aStartsWithInput = a.address
          .toLowerCase()
          .startsWith(inputValue.toLowerCase());
        const bStartsWithInput = b.address
          .toLowerCase()
          .startsWith(inputValue.toLowerCase());

        if (aStartsWithInput && !bStartsWithInput) return -1;
        if (!aStartsWithInput && bStartsWithInput) return 1;

        return a.address.localeCompare(b.address);
      })
      .slice(0, 5);
  };

  return (
    <Box sx={containerStyles}>
      <Box sx={searchContainerStyles}>
        <Autocomplete
          fullWidth
          options={availableAddresses}
          getOptionLabel={(option) => option.address || ""}
          onChange={handleSearchChange}
          filterOptions={filterOptions}
          noOptionsText="Digita almeno 2 caratteri per vedere i suggerimenti"
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Cerca per indirizzo..."
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={searchInputStyles}
            />
          )}
          renderOption={(props, option) => (
            <MenuItem {...props}>
              <Typography variant="body1">{option.city}</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                {option.address}
              </Typography>
            </MenuItem>
          )}
        />
        <Button
          variant="contained"
          startIcon={<TuneIcon />}
          onClick={handleFilterClick}
          sx={filterButtonStyles}
        >
          Filter{" "}
          {getSelectedFiltersCount() > 0 && `(${getSelectedFiltersCount()})`}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 1,
              width: 280,
              maxHeight: 400,
            },
          }}
        >
          {Object.entries(filterCategories).map(([category, items], index) => (
            <div key={category}>
              {index > 0 && <Divider />}
              <Typography
                variant="subtitle2"
                sx={{
                  px: 2,
                  py: 1,
                  fontWeight: 600,
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                }}
              >
                {category}
              </Typography>
              {items.map((item) => (
                <MenuItem
                  key={item.id}
                  onClick={() => handleFilterChange(item.id)}
                  sx={{ py: 0 }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!selectedFilters[item.id]}
                        onChange={() => {}}
                        sx={{ py: 0.5 }}
                      />
                    }
                    label={item.label}
                    sx={{ flex: 1 }}
                  />
                </MenuItem>
              ))}
            </div>
          ))}
        </Menu>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          mb: 2,
          mt: 1,
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "12px",
          margin: "12px auto",
          maxWidth: "800px",
        }}
      >
        {quickFilters.map((filter) => (
          <Chip
            key={filter.id}
            label={filter.label}
            onClick={() => handleQuickFilterClick(filter.id)}
            sx={{
              backgroundColor: activeQuickFilters.includes(filter.id)
                ? `${filter.color}`
                : "transparent",
              color: activeQuickFilters.includes(filter.id)
                ? "#fff"
                : filter.color,
              border: `1px solid ${filter.color}`,
              "&:hover": {
                backgroundColor: activeQuickFilters.includes(filter.id)
                  ? `${filter.color}`
                  : `${filter.color}15`,
              },
              fontWeight: 500,
              transition: "all 0.2s ease",
              padding: "6px 12px",
              height: "28px",
              fontSize: "0.875rem",
              borderRadius: "4px",
              "& .MuiChip-label": {
                padding: "0 4px",
                lineHeight: 1,
              },
            }}
          />
        ))}
      </Box>

      <Box sx={mapContainerStyles}>
        <MapContainer
          center={center}
          zoom={8}
          style={mapStyles}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution=" D-ServiceItalia"
          />
          <MapController coordinates={selectedCoordinates} />
          {filteredStations.map((station) => (
            <Marker key={station.id} position={station.coordinates}>
              <Popup>
                <div>
                  <h3>{station.name}</h3>
                  <p>{station.address}</p>
                  <p>Stato: {station.status}</p>
                  <p>Connettori:</p>
                  <ul>
                    {station.connectors.map((connector, idx) => (
                      <li key={idx}>
                        {connector.type} - {connector.power}kW (
                        {connector.status})
                      </li>
                    ))}
                  </ul>
                  <p>Servizi: {station.services.join(", ")}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Box>
  );
};

export default Home;
