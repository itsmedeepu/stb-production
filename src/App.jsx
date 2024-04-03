import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import Modal from "./components/Modal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function App() {
  const [stbs, setStbs] = useState([]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef();
  const [editStb, setEditStb] = useState({
    // Changed from name to stbid
    name: "",
    phone: "",
  });

  const [obj, setObj] = useState({
    stbid: "",
    name: "",
    phone: "",
  });

  const url = "https://stb-yh9x.onrender.com/api/v1/stb";

  useEffect(() => {
    setLoading(true);
    axios
      .get(url + "/getstbs")
      .then((response) => {
        const updatedStbs = response.data.data.map((stb, index) => ({
          ...stb,
          si_no: index + 1,
        }));
        setStbs(updatedStbs);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  const columns = [
    { field: "si_no", headerName: "SI/NO", width: 100 },
    { field: "stbid", headerName: "STB ID", width: 130 },
    { field: "name", headerName: "NAME", width: 130 },
    { field: "phone", headerName: "PHONE", width: 130 },
    {
      field: "edit",
      headerName: "EDIT",
      width: 100,
      renderCell: (params) => (
        <EditIcon
          style={{ cursor: "pointer" }}
          onClick={() => handleClickEdit(params.row)}
        />
      ),
    },
  ];

  const handleClickEdit = (data) => {
    modalRef.current.openModal();
    setObj(data);
  };

  const handleSaveChanges = () => {
    axios
      .post(url + "/update/" + obj.stbid, obj)
      .then((resp) => {
        toast.success(`${resp.data.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setStbs((prevStbs) =>
          prevStbs.map((stb) =>
            stb.stbid === obj.stbid ? { ...stb, ...obj } : stb
          )
        );
      })
      .catch((error) => {
        alert(error);
      });

    modalRef.current.closeModal();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setObj((prevObj) => ({
      ...prevObj,
      [name]: value,
    }));
  };

  const handleCloseModal = () => {
    setObj({
      name: "",
      phone: "",
    });
  };

  return (
    <>
      <div style={{ width: "50%", margin: "auto" }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <DataGrid
            rows={stbs}
            columns={columns}
            getRowId={(row) => row.stbid}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 20 },
              },
            }}
            pageSizeOptions={[5, 20]}
            sx={{
              boxShadow: 5,
              border: 2,
              borderColor: "primary.light",
              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
              "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                outline: "none !important",
              },
              "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
                borderRight: "1px solid grey",
              },

              "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
                borderBottom: "1px solid grey",
              },
            }}
          />
        )}
      </div>

      <Modal ref={modalRef} handleCloseModal={handleCloseModal}>
        <h1>Edit Data</h1>
        <p style={{ color: "red" }}>Note:STB-ID cannot be modified</p>
        <TextField
          id="stb-id"
          label="STB ID"
          variant="outlined"
          size="small"
          value={obj.stbid}
          name="stbid"
          fullWidth
          inputProps={{ readOnly: true }}
          style={{ marginBottom: "16px" }} // Add margin bottom
        />

        <TextField
          id="name"
          label="NAME"
          name="name"
          variant="outlined"
          size="small"
          onChange={handleInputChange}
          value={obj.name}
          fullWidth
          style={{ marginBottom: "16px" }} // Add margin bottom
        />

        <TextField
          id="phone"
          label="PHONE"
          variant="outlined"
          size="small"
          name="phone"
          onChange={handleInputChange}
          fullWidth
          value={obj.phone}
          style={{ marginBottom: "16px" }} // Add margin bottom
        />

        <Button
          type="button"
          size="medium"
          style={{ backgroundColor: "#5bc0de" }}
          onClick={handleSaveChanges}
        >
          Update
        </Button>
      </Modal>
      <ToastContainer />
    </>
  );
}

export default App;
