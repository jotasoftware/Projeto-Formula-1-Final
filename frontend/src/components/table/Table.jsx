import React, { useContext } from 'react';
import { DriverContext } from "../../context/DriverContext";
import { TeamContext } from '../../context/TeamContext';
import Loading from '../loading/Loading';
import "./Table.css";

const columns = {
    drivers: ["Nº", "Piloto", "Equipe", "Pontos"],
    teams: ["Nome", "Nacionalidade", "Vitórias", "Pontos"]
}
  

const Table = ({type}) => {
    const driversContext = useContext(DriverContext);
    const teamsContext = useContext(TeamContext);

    const driversData = type === "drivers" ? driversContext?.driversData : null;
    const setSelectDriver = type === "drivers" ? driversContext?.setSelectDriver : null;

    const teamsData = type === "teams" ? teamsContext?.teamsData : null;


    if((type === "drivers" && !driversData)||(type === "teams" && !teamsData)) return <Loading />;


    
    

    const handleClick = (driver) => {
        if (setSelectDriver) {
            setSelectDriver(driver.id);
        }
    };

    return (
        <div className='tableDiv'>
            <table>
                <thead>
                    <tr>
                        <th>Pos</th>
                        {columns[type].map((th, index)=>(
                           <th key={index}>{columns[type][index]}</th> 
                        ))}
                    </tr>
                </thead>
                {type === 'drivers' ? 
                <tbody>
                    {(driversData).map((driver, index)=>(
                        <tr key={index} onClick={() => handleClick(driver)} className="hover">
                            <td>{index+1}</td>
                            <td>{driver.numero}</td>
                            <td>{driver.nome}</td>
                            <td>{driver.equipe}</td>
                            <td>{driver.pontos}</td>
                        </tr>
                    ))}
                </tbody> 
                : 
                <tbody>
                    {teamsData.map((team, index)=>(
                        <tr key={index} className="noHover">
                            <td>{index+1}</td>
                            <td>{team.nome}</td>
                            <td>{team.nacionalidade}</td>
                            <td>{team.vitorias}</td>
                            <td>{team.pontos}</td>
                        </tr>
                    ))}
                </tbody> }
            </table>
        </div>
    );
};

export default Table;
