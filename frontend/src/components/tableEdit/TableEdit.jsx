import React, { useContext, useState } from 'react';
import { EditContext } from '../../context/EditContext';
import Loading from '../loading/Loading';
import './TableEdit.css';

const TableEdit = ({ type }) => {
  const {items, loading, updatePontos} = useContext(EditContext);
  const [inputs, setInputs] = useState({});

  if(loading || !items || !Array.isArray(items))return <Loading />;

  const handleInputChange = (id, value) => {
    setInputs({ ...inputs, [id]: value });
  };

  return (
    <div className='tableDiv'>
      <table>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Nome</th>
            <th>Pontos atuais</th>
            <th>Adicionar pontos</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.nome}</td>
              <td>{item.pontos}</td>
              <td className='inputTd'>
                <input
                  type="number"
                  value={inputs[item.id] || ''}
                  onChange={(e) => handleInputChange(item.id, e.target.value)}
                  onBlur={() => {
                    const raw = inputs[item.id];
                    const valor = parseInt(raw, 10);
                    if (!isNaN(valor)) {
                      updatePontos(item.id, valor);
                      setInputs(prev => ({
                        ...prev,
                        [item.id]: ''
                      }));
                    }
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableEdit;
