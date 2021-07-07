import {useState, useEffect, useContext, useCallback, forwardRef} from 'react'
import scss from './listBuilder.module.scss'
import cloneDeep from 'lodash.clonedeep'
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
// import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { DataGrid,
  GridToolbarContainer,
  useGridApiRef,
  // GridToolbarColumnsButton,
  // GridToolbarFilterButton,
  // GridToolbarExport,
  GridToolbarDensitySelector, 
  useGridSlotComponentProps,
  GridColumnMenuContainer } from '@material-ui/data-grid';
import {GlobalContext} from '../../Context/GlobalContext'
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import CachedIcon from '@material-ui/icons/Cached';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Slide from '@material-ui/core/Slide';
import Zoom from '@material-ui/core/Zoom';
import Checkbox from '@material-ui/core/Checkbox';
import Alert from './Alert'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CustomColumnMenu = (props) => {
  // const CompProps = useGridSlotComponentProps();
  // console.log('INSIDE THE CUSTOM MENU', CompProps)
  // const { columns } = useGridSlotComponentProps();
  const { hideMenu, ...other } = props;

  const handleChange = (e,ky) => {
    let updatedCols = cloneDeep(props.cols)
    let columnToUpdate = updatedCols.find((obj)=>{
      return obj.field === props.currentColumn.field
    })
    columnToUpdate[ky] = !columnToUpdate[ky]
    // props.currentColumn[ky] = !props.currentColumn[ky]
    props.setCols(updatedCols)
    // props.hideMenu(e)
  };

  const handleEditClick = (e) => {
    props.setEditingHeaderObj({field:props.currentColumn.field,headerName:props.currentColumn.headerName})
    props.setAlertType('editheader')
    props.setOpenAlert(true)
    props.hideMenu(e)
  }
  const handleDeleteColumnClick = (e) => {
    props.setEditingHeaderObj({field:props.currentColumn.field,headerName:props.currentColumn.headerName})
    props.setAlertType('deleteColumn')
    props.hideMenu(e)
    props.setOpenAlert(true)
  }

  if(!props.currentColumn.lastColumn)
    return (
      <GridColumnMenuContainer hideMenu={hideMenu} {...other} classes={{root:scss.columnMenu}} >
        <Grid container alignItems='center' justify='flex-end'>
          <Grid item>Unique</Grid>
          <Grid item>
            <Checkbox
              checked={props.currentColumn.makesUnique}
              onChange={(e)=>handleChange(e,'makesUnique')}
              inputProps={{ 'aria-label': 'unique checkbox' }}
            />
          </Grid>
        </Grid>
        <Grid container alignItems='center' justify='flex-end'>
          <Grid item>Use Regex</Grid>
          <Grid item>
            <Checkbox
              checked={props.currentColumn.isRegex}
              onChange={(e)=>handleChange(e,'isRegex')}
              inputProps={{ 'aria-label': 'regex checkbox' }}
            /></Grid>
        </Grid>
        <Grid container alignItems='center' justify='flex-start'>
          <Button onClick={handleEditClick} >Edit Column Name</Button>
        </Grid>
        <Grid container alignItems='center' justify='flex-start'>
          <Button onClick={handleDeleteColumnClick} >Delete Column</Button>
        </Grid>
      </GridColumnMenuContainer>
    );
  return (null)
}
const CustomToolbar = (props) => {
  return (
    <GridToolbarContainer>
      <GridToolbarDensitySelector />
      <div className={scss.topActions}>
        {props.unsaved &&
        <label htmlFor="icon-save-data">
        <Zoom in={true}>
          <IconButton onClick={props.handleSaveData} aria-label="save changes" component="span" >
            <SaveIcon />
          </IconButton>
        </Zoom>
        </label>
        }
        <label htmlFor="icon-reload-rows">
        <Zoom in={true}>
          <IconButton onClick={props.handleReloadData} aria-label="reload Row(s)" component="span" >
            <CachedIcon />
          </IconButton>
        </Zoom>
        </label>
        <label htmlFor="icon-add-row">
        {props.hasCols &&
        <Zoom in={true}>
          {/* <IconButton onClick={props.handleAddRow} aria-label="add Row" component="span" >
            <AddCircleOutlineIcon />
          </IconButton> */}
            <Button
              // variant="contained"
              color="default"
              onClick={props.handleAddRow}
              aria-label="add Row"
              className={scss.button}
              startIcon={<AddCircleOutlineIcon />}
            >
              add row
            </Button>
        </Zoom>
        }
        </label>
        <label htmlFor="icon-add-row">
        <Zoom in={true}>
          {/* <IconButton onClick={props.handleAddRow} aria-label="add Row" component="span" >
            <AddCircleOutlineIcon />
          </IconButton> */}
          <Button
            // variant="contained"
            color="default"
            onClick={()=>props.handleClickOpen('newfield')}
            aria-label="add Row"
            className={scss.button}
            startIcon={<ViewColumnIcon />}
          >
            add column
          </Button>
        </Zoom>
        </label>
        <label htmlFor="icon-delete-row">
        <Zoom in={props.selectionModel.length > 0}>
          <IconButton onClick={()=>props.handleClickOpen('delete')} aria-label="delete Row(s)" component="span" >
            <DeleteIcon />
          </IconButton>
        </Zoom>
        </label>
      </div>
    </GridToolbarContainer>
  );
}
const ListBuilder = () => {
  const [firstRender, setFirstRender] = useState(true);
  const [unsaved, setUnsaved] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState('delete');
  const [editingHeaderObj, setEditingHeaderObj] = useState({});
  const [name, setName] = useState('');
  const [cols, setCols] = useState([]);
  const [rows, setRows] = useState([]);
  const [fieldNames, setFieldNames] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  // const [selectedList, setSelectedList] = useState(null);
  const {lists,updateLists,selectedList, setSelectedList} = useContext(GlobalContext)

  useEffect(()=>{
    if(!firstRender) {
      setName(selectedList.name)
      // Setup the Grid/Table Data
      let rowFieldNames
      if(selectedList.columns){
        rowFieldNames = buildColumns(selectedList.columns)
        if (selectedList.allowedValues)
          buildRows(rowFieldNames,selectedList.allowedValues)
      }
    }
    if(firstRender) {
      setFirstRender(false)
    }
  },[selectedList])

  const handleSetList = useCallback(() => {
    if(lists.length > 0 && !selectedList) {
      setSelectedList(cloneDeep(lists[0]))
    }
  },[lists])

  const buildColumns = (colsData) => {
    let tempCols = [];
    let fieldNamesArr = [];
    colsData.forEach(c => {
      tempCols.push({
        field: c.name,
        headerName: c.name,
        editable: true,
        flex: 1,
        sortable: false,
        makesUnique: c.makesUnique,
        isRegex: c.isRegex,
      })
      fieldNamesArr.push(c.name)
    });
    tempCols.push({
      field: selectedList.driveLookupName,
      headerName: 'Region Market',
      lastColumn: true,
      editable: true,
      disableColumnMenu: true,
      flex: 1,
      sortable: false,
    })
    setCols(tempCols)
    setFieldNames(fieldNamesArr)
    return fieldNamesArr
  }
  const buildRows = (rowFieldNames,rowsData) => {
    let tempRows = [];
    rowsData.forEach((row,rowIdx) => {
      let tempObj = {}
      tempObj.id = rowIdx;
      row.forEach((val,valIdx)=>{
        if(valIdx === (row.length - 1)) {
          tempObj[selectedList.driveLookupName] = val;
        } else {
          tempObj[rowFieldNames[valIdx]] = val
        }
      })
      tempRows.push(tempObj)
    });
    setRows(tempRows)
  }
  const handleDeleteRow = () => {
    let updatedRows = cloneDeep(rows)
    updatedRows = updatedRows.filter(row => !selectionModel.includes(row.id) )
    // After removing the rows, we now need to update the IDs to match the new indexes.
    // this is because we use Indexes to line up with cell editing. The props provided
    // by the grid when editing a cell, provide only the id of the row
    updatedRows = updatedRows.map((r,i) => {
      r.id = i
      return r
    })
    setRows(updatedRows)
    setSelectionModel([])
    if(!unsaved)
      setUnsaved(true)
  }
  const handleReloadData = () => {
    // const rowFieldNames = buildColumns(selectedList.columns)
    // buildRows(rowFieldNames,selectedList.allowedValues)
    // setName(selectedList.name)

    // because of a useEffect that reruns on selectedList changes, this one liner works too
    setSelectedList(cloneDeep(selectedList))
    if(unsaved)
      setUnsaved(false)
  }
  const handleAddCol = (fieldName) => {
    // remove last special column
    // let holder = cols.pop()
    
    //create new column
    let newCol = {
          field: fieldName.replace(/\s+/g, ''),
          headerName: fieldName,
          editable: true,
          flex: 1,
          sortable: false,
          makesUnique: false,
          isRegex: false,
    }
    let updatedCols = cloneDeep(cols)
    //splice in new column as second to last
    updatedCols.splice(-1, 0, newCol)
    console.log('HERE WE GO NOW', cols, fieldName, newCol);

    let updatedRows = cloneDeep(rows)
    updatedRows.forEach((row,idx) => {
      row[fieldName.replace(/\s+/g, '')] = ''
    })
    setCols(updatedCols)
    setRows(updatedRows)
    if(!unsaved)
      setUnsaved(true)
  }
  const handleAddRow = () => {
    let tempObj = {}
    let updatedRows = cloneDeep(rows)
    if(rows.length > 0) {
      tempObj.id = rows[rows.length-1].id + 1
    } else {
      tempObj.id = 0
    }
    fieldNames.forEach(fieldName => {
      tempObj[fieldName] = ''
    })
    tempObj.driveLookupName = selectedList.driveLookupName;
    updatedRows.push(tempObj)
    setRows(updatedRows)
    if(!unsaved)
      setUnsaved(true)
  }

  const handleChangeListName = (event) => {
    setName(event.target.value);
    if(!unsaved)
      setUnsaved(true)
  };

  const handleSelectionModelChange = (newSelection) => {
    setSelectionModel(newSelection.selectionModel);
  }
  
  const handleClickOpen = (type) => {
    setAlertType(type)
    setOpenAlert(true);
  };

  const handleConfirmDelete = () => {
    handleDeleteRow()
    setOpenAlert(false);
    if(!unsaved)
      setUnsaved(true)
  }

  const handleConfirmNewCol = (newField) => {
    handleAddCol(newField)
    setOpenAlert(false);
  }
  
  const handleConfirmEditHeader = (newField) => {
    let updatedHeaders = cloneDeep(cols)
    let foundCol = updatedHeaders.find(c => {
      return c.field === editingHeaderObj.field
    })
    foundCol.field = newField
    foundCol.headerName = newField
    setOpenAlert(false);
    let updatedRows = cloneDeep(rows)
    updatedRows.forEach(row => {
      let tmp = row[editingHeaderObj.field]
      row[newField] = tmp
      delete row[editingHeaderObj.field]
    })
    setEditingHeaderObj({})
    setCols(updatedHeaders)
    setRows(updatedRows)
    if(!unsaved)
      setUnsaved(true)
  }

  const handleConfirmDeleteColumn = () => {
    let originalHeaders = cloneDeep(cols)
    let updatedHeaders = cloneDeep(originalHeaders.filter(c => {
      return c.field !== editingHeaderObj.field
    }))
    setOpenAlert(false);
    let updatedRows = cloneDeep(rows)
    updatedRows.forEach(row => {
      delete row[editingHeaderObj.field]
    })
    setEditingHeaderObj({})
    setCols(updatedHeaders)
    setRows(updatedRows)
    if(!unsaved)
      setUnsaved(true)
  }

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleEditCellChangeCommitted = (props) => {
    let updatedRows = cloneDeep(rows)
    updatedRows[props.id][props.field] = props.props.value
    setRows(updatedRows)
    if(!unsaved)
      setUnsaved(true)
  }

  const handleSaveData = () => {
    let isNew = false
    console.log('SAVING', cols, rows,selectedList.name)
    updateLists(rows,cols, selectedList.name, name, isNew)
  }

//   if(selectedList){
//   console.log('selectedList is.......',selectedList, cols, rows)
// console.log('keys are...',Object.keys(rows[0]))
//   }
  return (
    <div className={scss.root}>
      <Alert 
        openAlert={openAlert}
        Transition={Transition}
        handleCloseAlert={handleCloseAlert}
        handleConfirm={alertType==='delete' ? handleConfirmDelete : alertType==='deleteColumn' ? handleConfirmDeleteColumn : alertType==='editheader' ? handleConfirmEditHeader : handleConfirmNewCol}
        confirmText={(alertType==='delete' || alertType==='deleteColumn') ? null : 'Submit'}
        isInput={(alertType==='delete' || alertType==='deleteColumn') ? false : true}
        title={alertType==='editheader' ? 'Column Name' : alertType==='deleteColumn' ? ('Delete '+editingHeaderObj.field+' column') : alertType==='newField' ? 'New Field' : null}
        bodyText={alertType==='editheader' ? 'Edit the column name for '+editingHeaderObj.field+' below' : null}
        inputPlaceholder={editingHeaderObj.field ? editingHeaderObj.field : null}
      />
      <Container>
        <Paper className={scss.paper}>
          {!selectedList 
            && <>
              <button onClick={handleSetList}>Set List</button>
              <button onClick={()=>setSelectedList([])}>New List</button>
            </>
          }
        {selectedList &&
            <>
            <Grid className={scss.listTitle} container spacing={1} alignItems="center">
              <Grid item className={scss.gridLabel} >
                List Name
              </Grid>
              <Grid item>
                <TextField
                  className={scss.margin}
                  id="List_Name"
                  value={name}
                  onChange={handleChangeListName}
                  variant='outlined'
                  size='small'
                  inputProps={{
                    // autocomplete: 'new-password',
                    form: {
                      autoComplete: 'off',
                    },
                  }}
                  // label="TextField"
                  // InputProps={{
                  //   startAdornment: (
                  //     <InputAdornment position="start">
                  //       <AccountCircle />
                  //     </InputAdornment>
                  //   ),s
                  // }}
                />
              </Grid>
            </Grid>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                // loading={bool}
                rows={rows}
                columns={cols}
                pageSize={10}
                checkboxSelection
                onSelectionModelChange={handleSelectionModelChange}
                selectionModel={selectionModel}
                disableSelectionOnClick
                onEditCellChangeCommitted={handleEditCellChangeCommitted}
                components={{
                  Toolbar:CustomToolbar,
                  ColumnMenu: CustomColumnMenu,
                }}
                componentsProps={{
                  toolbar:{
                    handleAddRow,
                    selectionModel,
                    handleClickOpen,
                    handleReloadData,
                    hasCols:(cols && cols.length > 0),
                    unsaved,
                    handleSaveData
                  },
                  columnMenu: {
                    cols,
                    setCols,
                    setAlertType,
                    setOpenAlert,
                    setEditingHeaderObj,
                  }
                }}
              />
            </div>
            </>
        }
        </Paper>
      </Container>
    </div>
  );
}

export default ListBuilder;
