import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox
} from "@mui/material";

import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HomeIcon from "@mui/icons-material/Home";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

type Aed = {
  id: number;
  name: string;
  indoor: boolean;
  available: boolean;
  address: string;
  eircode: string;
  latitude: number;
  longitude: number;
};

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingAedId, setEditingAedId] = useState<number | null>(null);

  const [aeds, setAeds] = useState<Aed[]>([]);
  
  // Fetch AEDs from backend
  const fetchAedsFromServer = async () => {
    try {
      const response = await fetch(
        "https://api.aednow.online/api/aedlocations"
      );
      const data = await response.json();
  
      if (data.success) {
        const transformedAeds = data.data.map((aed: any) => ({
          id: aed.id,
          name: aed.name,
          indoor: aed.indoor || false,
          available: true,
          address: aed.address || "No address",
          eircode: "",
          latitude: aed.latitude,
          longitude: aed.longitude
        }));
  
        setAeds(transformedAeds);
      }
    } catch (error) {
      console.error("Error fetching AEDs:", error);
    }
  };

  useEffect(() => {
    fetchAedsFromServer();
  }, []);



  const [formAed, setFormAed] = useState<Omit<Aed, "id">>({
    name: "",
    indoor: false,
    available: true,
    address: "",
    eircode: "",
    latitude: 0,
    longitude: 0
  });

 
  
  const filteredAeds = aeds.filter((aed) => {
    const q = search.toLowerCase();
    return (
      aed.name.toLowerCase().includes(q) ||
      aed.address.toLowerCase().includes(q) ||
      aed.eircode.toLowerCase().includes(q)
    );
  });

 

  const stats = [
    {
      label: "Total AEDs",
      value: aeds.length,
      icon: <MedicalServicesIcon fontSize="large" color="primary" />
    },
    {
      label: "Available AEDs",
      value: aeds.filter(a => a.available).length,
      icon: <CheckCircleIcon fontSize="large" color="success" />
    },
    {
      label: "Unavailable AEDs",
      value: aeds.filter(a => !a.available).length,
      icon: <CancelIcon fontSize="large" color="error" />
    },
    {
      label: "Indoor AEDs",
      value: aeds.filter(a => a.indoor).length,
      icon: <HomeIcon fontSize="large" color="info" />
    }
  ];

 

  // const handleSaveAed = () => {
  //   if (editingAedId === null) {
  //     setAeds(prev => [...prev, { id: Date.now(), ...formAed }]);
  //   } else {
  //     setAeds(prev =>
  //       prev.map(aed =>
  //         aed.id === editingAedId ? { id: editingAedId, ...formAed } : aed
  //       )
  //     );
  //   }

  //   setOpen(false);
  //   setEditingAedId(null);
  //   setFormAed({
  //     name: "",
  //     indoor: false,
  //     available: true,
  //     address: "",
  //     eircode: "",
  //     latitude: 0,
  //     longitude: 0
  //   });
  // };

  const handleSaveAed = async() => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        alert("Not authenticated");
        return;
      }
  
      const method = editingAedId ? "PUT" : "POST";
      const url = editingAedId
        ? `https://api.aednow.online/api/aedlocations/${editingAedId}`
        : `https://api.aednow.online/api/aedlocations`;
  
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formAed)
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(data.message || "Error saving AED");
        return;
      }
  
      // Re-fetch updated AED list from database
      await fetchAedsFromServer();
  
      setOpen(false);
      setEditingAedId(null);
  
    } catch (error) {
      console.error("Error saving AED:", error);
    }
  };







  const handleEditClick = (aed: Aed) => {
    setEditingAedId(aed.id);
    setFormAed({
      name: aed.name,
      indoor: aed.indoor,
      available: aed.available,
      address: aed.address,
      eircode: aed.eircode,
      latitude: aed.latitude,
      longitude: aed.longitude
    });
    setOpen(true);
  };

  const handleDeleteAed = (id: number) => {
    if (window.confirm("Delete this AED?")) {

      const handleDeleteAed = async (id: number) => {
        if (!window.confirm("Delete this AED?")) return;
      
        try {
          const token = localStorage.getItem("token");
      
          const response = await fetch(
            `https://api.aednow.online/api/aedlocations/${id}`,
            {
              method: "DELETE",
              headers: {
                "Authorization": `Bearer ${token}`
              }
            }
          );
      
          if (!response.ok) {
            alert("Error deleting AED");
            return;
          }
      
          await fetchAedsFromServer();
      
        } catch (error) {
          console.error("Delete error:", error);
        }
      };

    }
  };

  return (

    <Box>
      
      <Paper sx={{ p: 3, mb: 4, backgroundColor: "#f2f2f2" }}>
        <Typography variant="h4" mb={3}>Dashboard</Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
          {stats.map((s, i) => (
            <Paper key={i} sx={{ p: 2, flex: 1, display: "flex", gap: 2 }}>
              {s.icon}
              <Box>
                <Typography variant="h5">{s.value}</Typography>
                <Typography variant="body2">{s.label}</Typography>
              </Box>
            </Paper>
          ))}
        </Stack>
      </Paper>

      {/* ---------- SEARCH + ADD ---------- */}
      <Stack direction="row" spacing={2} sx={{ maxWidth: 1100, mx: "auto", mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search AEDs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingAedId(null);
            setFormAed({
              name: "",
              indoor: false,
              available: true,
              address: "",
              eircode: "",
              latitude: 0,
              longitude: 0
            });
            setOpen(true);
          }}
        >
        </Button>
      </Stack>

      

      <TableContainer component={Paper} sx={{ maxWidth: 1100, mx: "auto" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#DC0000" }}>
            <TableRow>
              {["Name", "Indoor", "Available", "Address", "Eircode", "Actions"].map(h => (
                <TableCell key={h} align="center" sx={{ color: "#fff" }}>
                  <strong>{h}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredAeds.map((aed) => (
              <TableRow key={aed.id} hover>
                <TableCell align="center">{aed.name}</TableCell>
                <TableCell align="center">
                  <Chip label={aed.indoor ? "Indoor" : "Outdoor"} />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={aed.available ? "Available" : "Unavailable"}
                    color={aed.available ? "success" : "error"}
                  />
                </TableCell>
                <TableCell align="center">{aed.address}</TableCell>
                <TableCell align="center">{aed.eircode}</TableCell>
                <TableCell align="center">{aed.latitude}</TableCell>
                <TableCell align="center">{aed.longitude}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleEditClick(aed)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteAed(aed.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>



      
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editingAedId ? "Edit AED" : "Add AED"}</DialogTitle>

        <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={formAed.name}
            onChange={e => setFormAed({ ...formAed, name: e.target.value })}
          />
          <TextField
            label="Address"
            value={formAed.address}
            onChange={e => setFormAed({ ...formAed, address: e.target.value })}
          />
          <TextField
            label="Eircode"
            value={formAed.eircode}
            onChange={e => setFormAed({ ...formAed, eircode: e.target.value })}
          />
          <TextField
            label="Latitude"
            type="number"
            value={formAed.latitude}
            onChange={e =>
              setFormAed({ ...formAed, latitude: parseFloat(e.target.value) })
            }
          />
          <TextField
            label="Longitude"
            type="number"
            value={formAed.longitude}
            onChange={e =>
              setFormAed({ ...formAed, longitude: parseFloat(e.target.value) })
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formAed.indoor}
                onChange={e => setFormAed({ ...formAed, indoor: e.target.checked })}
              />
            }
            label="Indoor"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formAed.available}
                onChange={e => setFormAed({ ...formAed, available: e.target.checked })}
              />
            }
            label="Available"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveAed}>
            {editingAedId ? "Save Changes" : "Add AED"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
