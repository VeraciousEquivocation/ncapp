import React, { useEffect, useState } from "react";
// import axios from 'axios';
import cloneDeep from 'lodash.clonedeep'
import {tempData} from './initialData'

export const GlobalContext = React.createContext();

function GlobalContextProvider(props) {
    // const [data, setData] = useState(null);
    const [lists, setLists] = useState([]); //array of objects [{ field: value }] 
    
    useEffect(()=>{
        const listsFromStorage = localStorage.getItem('validatorlists')
        if(listsFromStorage)
          setLists(listsFromStorage)
        else
          setLists([])
    },[])

    // const fetchData = useCallback(() => {
    //     if(lists && lists.lenght > 0) return;
    //     setLists(tempData)
    // },[data])

    const updateLists = React.useCallback((rows,cols, oldListName, newlistName, isNew) => {
      let updatedLists = cloneDeep(lists)
      
      let rowKeys = []
      let updatedColumns = cols.map((c,i) => {
          rowKeys.push(c.field)
          return {
              name: c.field,
              makesUnique: c.makesUnique,
              isRegex: c.isRegex
          }
      })
      let updatedAllowedValues = []
      rows.forEach((r,i) => {
        updatedAllowedValues[i] = []
        rowKeys.forEach(k=>{
          updatedAllowedValues[i].push(r[k])
        })
      })

      if(!isNew) { // update old list
        let listIndex = updatedLists.findIndex(l => {
            return l.name === oldListName
        })
        if(oldListName !== newlistName) {
            updatedLists[listIndex].name = newlistName
        }
        updatedLists[listIndex].columns = updatedColumns
        updatedLists[listIndex].allowedValues = updatedAllowedValues

      } else { // add new list
        let newListObj = {}
        newListObj.name = newlistName
        newListObj.columns = updatedColumns
        newListObj.allowedValues = updatedAllowedValues
        updatedLists.push(newListObj)
      }
      // [ CHANGE THIS TO Server CALL, and run setLists on success ]
      console.log(updatedLists)
      setLists(updatedLists)
      localStorage.setItem('validatorlists', JSON.stringify(updatedLists));
      return updatedLists
    },[lists])

    const contextMemoData = React.useMemo(() => (
        {
            lists,
            updateLists,
        }), 
        [
            lists,
            updateLists,
        ]
    );

    return (
        <GlobalContext.Provider value={contextMemoData}>
            {props.children}
        </GlobalContext.Provider>
    )
}

export default React.memo(GlobalContextProvider);