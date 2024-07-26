import { makeStyles } from "@mui/styles";

export default makeStyles(() => ({
    paper: {
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100px",
    },
    mapContainer: {
        height: "90vh",
        width: "100%",
    },
    markerContainer: {
        position: "absolute",
        transform: "translate(-50%, -50%)",
        zIndex: 1,
        "&:hover": { 
            boxShadow: "4px 8px 6px rgba(0,0,0,0.3)", zIndex: 2 },
    },
    pointer: {
        cursor: "pointer",
    },
}));