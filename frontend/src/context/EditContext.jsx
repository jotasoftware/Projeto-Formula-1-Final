import React, { createContext, useReducer, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { SeasonContext } from "./SeasonContext";

export const EditContext = createContext();

const initialState = {
  items: null, 
  selectedItem: null
}

function reducer(state, action) {
  switch(action.type) {
    case "set_items":
      return {...state, items: action.payload};
    case "add_item":
      return {...state, items: [...(state.items || []), action.payload]};
    case "update_item":
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.id ? action.payload : item
        ),
        selectedItem: action.payload
      }
    default:
      throw new Error("Action not found: " + action.type);
  }
}

const EditProvider = ({ children, type }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const { yearSeason } = useContext(SeasonContext);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch(`https://localhost:3001/${type}?temporada=${yearSeason}`);
                if (!res.ok) throw new Error(`Erro ${res.status}`);
                const data = await res.json();
                dispatch({ type: "set_items", payload: data });
            }catch (error){
                toast.error("Erro ao carregar dados: " + error.message);
            }
        }
        fetchItems();
    }, [type, yearSeason])

    const updateItem = async (id, updatedData) => {
        const token = localStorage.getItem('token');
        const bodyData = { 
            ...updatedData, 
            yearSeason 
        }
        try{
            const res = await fetch(`https://localhost:3001/${type}/${id}`, {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(bodyData)
            })
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            const updatedItem = await res.json();
            dispatch({type: "update_item", payload: updatedItem});
        }catch(error){
            toast.error("Erro ao atualizar item: " + error.message);
        }
    }
      
    const updatePontos = (id, novosPontos) => {
        const itemAtual = state.items.find(item => item.id === id);
        if (!itemAtual) return;
        const novosDados = {
          ...itemAtual,
          pontos: itemAtual.pontos + novosPontos
        }
        if(novosPontos === 25){
          novosDados.vitorias = (itemAtual.vitorias || 0) + 1;
        }
        updateItem(id, novosDados);
    }

    return (
        <EditContext.Provider value={{
            items: state.items,
            selectedItem: state.selectedItem,
            updatePontos,
            }}>
                {children}
        </EditContext.Provider>
    )
}

export default EditProvider;
