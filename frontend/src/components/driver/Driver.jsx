import { useContext } from "react";
import { DriverContext } from "../../context/DriverContext";
import './Driver.css';
import { AiOutlineClose } from "react-icons/ai";
import { SeasonContext } from "../../context/SeasonContext";
import Loading from "../loading/Loading";

const Driver = () =>{
    const { driverData, setSelectDriver } = useContext(DriverContext);
    const { yearSeason } = useContext(SeasonContext);

    if(!driverData) {
        return <Loading />
    }

    const getAge = () => {
        const dateNow = new Date();
        const birthDate = new Date(driverData.nascimento);
        let age = dateNow.getFullYear() - birthDate.getFullYear();
        const month = dateNow.getMonth() - dateNow.getMonth();
        if(month < 0 || (month === 0 && dateNow.getDate() < birthDate.getDate())) age--
        return age;
    }

    const handleClick = ()=>{
        setSelectDriver("");
    }

    return (
        <div className="driverCard">
            <div className="driverDiv">
                <span className="number">{driverData.numero}</span>
                <div className="nomeDriver">
                    <h2>{driverData.nome}</h2>
                    <div className="closeDriver">
                        <AiOutlineClose onClick={handleClick} size={24} />
                    </div>
                </div>
                <div className="infoDriver">
                    <p>{driverData.nacionalidade}</p>
                    <p>{new Date(driverData.nascimento).toLocaleDateString("pt-BR")}</p>
                    <p>{getAge()} anos</p>
                    <p>{driverData.vitorias} vitórias em {yearSeason}</p>
                    <p>{driverData.equipe}</p>
                    <a href={driverData.link}target="_blank" rel="noreferrer">Mais Informações</a>
                </div>
            </div>
        </div>
    )
}

export default Driver;