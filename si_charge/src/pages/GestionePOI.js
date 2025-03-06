import React, { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import chargingStationsData from "../data/charging-stations.json";

const GestionePOI = () => {
  const [stations, setStations] = useState(() => {
    const savedStations = localStorage.getItem("chargingStations");
    return savedStations
      ? JSON.parse(savedStations)
      : chargingStationsData.stations;
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [filters, setFilters] = useState({
    id: "",
    name: "",
    operator: "",
    address: "",
    status: "",
    connectorType: "",
    service: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleEdit = (station) => {
    setSelectedStation({ ...station });
    setOpenDialog(true);
  };

  const handleAdd = () => {
    const newStation = {
      id: `NEW${Date.now()}`,
      name: "",
      operator: "",
      coordinates: [0, 0],
      address: "",
      status: "available",
      connectors: [
        {
          type: "type2",
          power: 22,
          status: "available",
        },
      ],
      services: ["parking"],
    };
    setSelectedStation(newStation);
    setOpenDialog(true);
  };

  const handleDelete = (stationId) => {
    const updatedStations = stations.filter(
      (station) => station.id !== stationId
    );
    setStations(updatedStations);
    handleSaveToFile(updatedStations);
    setSnackbar({
      open: true,
      message: "Stazione eliminata con successo",
      severity: "success",
    });
  };

  const handleSave = () => {
    if (selectedStation) {
      const updatedStations = selectedStation.id.startsWith("NEW")
        ? [...stations, { ...selectedStation, id: `ST${Date.now()}` }]
        : stations.map((station) =>
            station.id === selectedStation.id ? selectedStation : station
          );

      setStations(updatedStations);
      handleSaveToFile(updatedStations);
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: "Modifiche salvate con successo",
        severity: "success",
      });
    }
  };

  const handleSaveToFile = async (updatedStations) => {
    try {
      localStorage.setItem("chargingStations", JSON.stringify(updatedStations));

      setStations(updatedStations);

      setSnackbar({
        open: true,
        message: "Modifiche salvate con successo",
        severity: "success",
      });
    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
      setSnackbar({
        open: true,
        message: "Errore durante il salvataggio",
        severity: "error",
      });
    }
  };

  const operators = [
    { id: "enel_x", label: "Enel X", color: "#00488F" },
    { id: "be_charge", label: "Be Charge", color: "#00B0B9" },
    { id: "a2a", label: "A2A E-moving", color: "#FF8F19" },
    { id: "tesla", label: "Tesla", color: "#E31937" },
    { id: "ionity", label: "Ionity", color: "#2C5DFE" },
    { id: "free_to_x", label: "Free To X", color: "#009DE0" },
  ];

  const connectorTypes = ["type2", "ccs", "chademo", "tesla"];
  const statusOptions = ["available", "occupied", "maintenance"];
  const serviceOptions = [
    "parking",
    "24/7",
    "lighting",
    "wifi",
    "shopping",
    "food",
    "restroom",
  ];

  // Funzione per gestire il cambiamento dei filtri
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Funzione per filtrare le stazioni
  const filteredStations = stations.filter((station) => {
    return (
      station.id.toLowerCase().includes(filters.id.toLowerCase()) &&
      station.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      (filters.operator === "" || station.operator === filters.operator) &&
      station.address.toLowerCase().includes(filters.address.toLowerCase()) &&
      (filters.status === "" || station.status === filters.status) &&
      (filters.connectorType === "" ||
        station.connectors.some((c) => c.type === filters.connectorType)) &&
      (filters.service === "" || station.services.includes(filters.service))
    );
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        {/* <Typography variant="h5">Gestione Stazioni di Ricarica</Typography> */}
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Aggiungi Stazione
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Operatore</TableCell>
              <TableCell>Indirizzo</TableCell>
              <TableCell>Stato</TableCell>
              <TableCell>Connettori</TableCell>
              <TableCell>Servizi</TableCell>
              <TableCell>Azioni</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <TextField
                  size="small"
                  placeholder="Filtra ID"
                  value={filters.id}
                  onChange={(e) => handleFilterChange("id", e.target.value)}
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  placeholder="Filtra Nome"
                  value={filters.name}
                  onChange={(e) => handleFilterChange("name", e.target.value)}
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <FormControl fullWidth size="small">
                  <Select
                    value={filters.operator}
                    onChange={(e) =>
                      handleFilterChange("operator", e.target.value)
                    }
                    displayEmpty
                  >
                    <MenuItem value="">Tutti</MenuItem>
                    {operators.map((op) => (
                      <MenuItem key={op.id} value={op.id}>
                        {op.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  placeholder="Filtra Indirizzo"
                  value={filters.address}
                  onChange={(e) =>
                    handleFilterChange("address", e.target.value)
                  }
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <FormControl fullWidth size="small">
                  <Select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    displayEmpty
                  >
                    <MenuItem value="">Tutti</MenuItem>
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <FormControl fullWidth size="small">
                  <Select
                    value={filters.connectorType}
                    onChange={(e) =>
                      handleFilterChange("connectorType", e.target.value)
                    }
                    displayEmpty
                  >
                    <MenuItem value="">Tutti</MenuItem>
                    {connectorTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <FormControl fullWidth size="small">
                  <Select
                    value={filters.service}
                    onChange={(e) =>
                      handleFilterChange("service", e.target.value)
                    }
                    displayEmpty
                  >
                    <MenuItem value="">Tutti</MenuItem>
                    {serviceOptions.map((service) => (
                      <MenuItem key={service} value={service}>
                        {service}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <Button
                  size="small"
                  onClick={() =>
                    setFilters({
                      id: "",
                      name: "",
                      operator: "",
                      address: "",
                      status: "",
                      connectorType: "",
                      service: "",
                    })
                  }
                >
                  Reset
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStations.map((station) => (
              <TableRow key={station.id}>
                <TableCell>{station.id}</TableCell>
                <TableCell>{station.name}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      operators.find((op) => op.id === station.operator)?.label
                    }
                    sx={{
                      bgcolor: operators.find(
                        (op) => op.id === station.operator
                      )?.color,
                      color: "white",
                      borderRadius: "4px",
                      height: "28px",
                      "& .MuiChip-label": {
                        padding: "0 4px",
                        lineHeight: 1,
                      },
                    }}
                  />
                </TableCell>
                <TableCell>{station.address}</TableCell>
                <TableCell>
                  <Chip
                    label={station.status}
                    color={
                      station.status === "available"
                        ? "success"
                        : station.status === "occupied"
                        ? "warning"
                        : "error"
                    }
                    sx={{
                      borderRadius: "4px",
                      height: "28px",
                      "& .MuiChip-label": {
                        padding: "0 4px",
                        lineHeight: 1,
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {station.connectors.map((connector, idx) => (
                      <Chip
                        key={idx}
                        label={`${connector.type} (${connector.power}kW)`}
                        size="small"
                        sx={{
                          borderRadius: "4px",
                          height: "24px",
                          "& .MuiChip-label": {
                            padding: "0 4px",
                            lineHeight: 1,
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {station.services.map((service, idx) => (
                      <Chip
                        key={idx}
                        label={service}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: "4px",
                          height: "24px",
                          "& .MuiChip-label": {
                            padding: "0 4px",
                            lineHeight: 1,
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEdit(station)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(station.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedStation?.id.startsWith("NEW")
            ? "Aggiungi Stazione"
            : "Modifica Stazione"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="Nome"
              value={selectedStation?.name || ""}
              onChange={(e) =>
                setSelectedStation({ ...selectedStation, name: e.target.value })
              }
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Operatore</InputLabel>
              <Select
                value={selectedStation?.operator || ""}
                onChange={(e) =>
                  setSelectedStation({
                    ...selectedStation,
                    operator: e.target.value,
                  })
                }
                label="Operatore"
              >
                {operators.map((op) => (
                  <MenuItem key={op.id} value={op.id}>
                    {op.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Indirizzo"
              value={selectedStation?.address || ""}
              onChange={(e) =>
                setSelectedStation({
                  ...selectedStation,
                  address: e.target.value,
                })
              }
              fullWidth
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Latitudine"
                type="number"
                value={selectedStation?.coordinates[0] || 0}
                onChange={(e) =>
                  setSelectedStation({
                    ...selectedStation,
                    coordinates: [
                      parseFloat(e.target.value),
                      selectedStation.coordinates[1],
                    ],
                  })
                }
                fullWidth
              />
              <TextField
                label="Longitudine"
                type="number"
                value={selectedStation?.coordinates[1] || 0}
                onChange={(e) =>
                  setSelectedStation({
                    ...selectedStation,
                    coordinates: [
                      selectedStation.coordinates[0],
                      parseFloat(e.target.value),
                    ],
                  })
                }
                fullWidth
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel>Stato</InputLabel>
              <Select
                value={selectedStation?.status || "available"}
                onChange={(e) =>
                  setSelectedStation({
                    ...selectedStation,
                    status: e.target.value,
                  })
                }
                label="Stato"
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annulla</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GestionePOI;
