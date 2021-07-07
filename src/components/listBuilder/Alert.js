import {useEffect, useState} from 'react'
// import scss from './listBuilder.module.scss'
// import cloneDeep from 'lodash.clonedeep'
import TextField from '@material-ui/core/TextField';
// import {GlobalContext} from '../../Context/GlobalContext'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

const Alert = ({
  openAlert,
  Transition,
  handleCloseAlert,
  handleConfirm,
  confirmText,
  isInput,
  title,
  bodyText,
  inputPlaceholder
}) => {
  const [inputVal, setInputVal] = useState('')

  useEffect(()=> {
    // this clears out the input field on close
    if(!openAlert)
      setInputVal('')
  },[openAlert])

  const handleChange = (event) => {
    setInputVal(event.target.value);
  };

  return (
    <>
    <Dialog
      open={openAlert}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleCloseAlert}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">{title ? title : "Are you sure you want to delete these rows?"}</DialogTitle>
      {isInput &&
        <DialogContent>
          <DialogContentText>
            {bodyText ? bodyText : 'Enter the Column Name for the new field'}
          </DialogContentText>
          <TextField
            autoFocus
            value={inputVal}
            placeholder={inputPlaceholder}
            onChange={handleChange}
            margin="dense"
            id="columnName"
            // label="Column Name"
            type="text"
            fullWidth
          />
        </DialogContent>      
      }
      <DialogActions>
        <Button onClick={handleCloseAlert} >
          Cancel
        </Button>
        <Button onClick={() => handleConfirm(inputVal)} color="primary">
          {confirmText ? confirmText : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
}

export default Alert;