import { makeStyles } from '@mui/styles';
import { alpha } from '@mui/system';

export default makeStyles((theme) => ({
  title: {
    display: 'flex', flexDirection: 'row', alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '20px',
    },
  },
  tip: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.25) },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: { marginLeft: theme.spacing(3), width: 'auto' },
  },
  searchIcon: {
    paddingLeft:'10px', height: '100%', position: 'absolute', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    paddingLeft: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0), paddingLeft: `calc(1em + ${theme.spacing(4)}px)`, transition: theme.transitions.create('width'), width: '100%', [theme.breakpoints.up('md')]: { width: '20ch' },
  },
  toolbar: {
    display: 'flex', justifyContent: 'space-between',
  },
}));