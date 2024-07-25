import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
    formControl: {
        marginLeft: '200px',
        marginRight: '200px',
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    loading: {
        height: '600px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        paddingLeft: '10px',
    },
    marginBottom: {
        marginBottom: '0px',
    },
    list: {
        height: '75vh',
        overflow: 'auto',
    },
}));