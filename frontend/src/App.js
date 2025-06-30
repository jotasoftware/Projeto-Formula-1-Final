import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import { ToastContainer } from 'react-toastify';

import DriverProvider from './context/DriverContext';
import SeasonProvider from "./context/SeasonContext";
import TeamProvider from "./context/TeamContext";
import RaceProvider from "./context/RaceContext";

import Menu from "./components/menu/Menu";
import Driver from './components/driver/Driver';
import Table from "./components/table/Table";
import Races from "./components/races/Races";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import LoginProvider from "./context/LoginContext";
import Private from "./components/private/Private";
import TableEdit from "./components/tableEdit/TableEdit";
import EditProvider from "./context/EditContext";
import FormCreateDriver from "./components/formCreateDriver/FormCreateDriver";
import FormCreateTeam from "./components/formCreateTeam/FormCreateTeam";
import FormCreateRace from "./components/formCreateRace/FormCreateRace";

function App() {
  return (
    <BrowserRouter basename="/Projeto-Formula-1">
    <div className="screen">
      <SeasonProvider>
        <LoginProvider >
        <Menu />
        <main className="info">
          <Routes>
            <Route path="/Projeto-Formula-1" element={
              <Home></Home>
            } />
            <Route path="/login" element={
              <Login></Login>
            } />
            <Route path="/pilots" element={
              <DriverProvider>  
                <Driver></Driver>
                <Table type={"drivers"}></Table>
              </DriverProvider>
            } />
            <Route path="/teams" element={
              <TeamProvider>
                <Table type={"teams"}></Table>
              </TeamProvider>
            } />
            <Route path="/races" element={
              <RaceProvider>
                <Races></Races>
              </RaceProvider>
            } />
            <Route path="/editpilots" element={
              <Private>
                <EditProvider type={"pilotos"}>
                  <TableEdit type={"drivers"}></TableEdit>
                </EditProvider>
              </Private>
            } />
            <Route path="/editteams" element={
              <Private>
                <EditProvider type={"equipes"}>
                  <TableEdit type={"drivers"}></TableEdit>
                </EditProvider>
              </Private>
            } />
            <Route path="/create" element={
              <Private>
                <div className="createForms">
                <FormCreateDriver></FormCreateDriver>
                <FormCreateTeam></FormCreateTeam>
                <FormCreateRace></FormCreateRace>
                </div>
              </Private>
            } />
          </Routes>
        </main>
        </LoginProvider>
      </SeasonProvider>
    </div>
    <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
