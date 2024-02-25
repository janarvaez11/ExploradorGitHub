import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Select, MenuItem, FormControl, InputLabel, Pagination } from "@mui/material";

const RepoList = ({ username }) => {
  const [repos, setRepos] = useState([]);
  //FILTRO DE NUMERO DE ESTRELLAS
  const [starFilter, setStarFilter] = useState("");
  //FILTRO DE LA TECNOLOGIA UTILIZADA
  const [languageFilter, setLanguageFilter] = useState("");
  //FILTRO DE AÑO
  const [yearFilter, setYearFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const reposPerPage = 10; //SE AJUSTA EL NUMERO DE REPOSITORIOS POR PAGINA

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/users/${username}/repos`
        );
        const sortedRepos = response.data.sort((a, b) => b.size - a.size);
        setRepos(sortedRepos);
      } catch (error) {
        console.error("Error fetching repos:", error);
      }
    };

    fetchData();
  }, [username]);

  //------------------------FUNCIONES PARA LOS FILTROS
  //FILTRO DE ESTRELLAS
  const handleStarFilterChange = (event) => {
    setStarFilter(event.target.value);
    setCurrentPage(1); //RESETEA LA PAGINA AL CAMBIAR EL FILTRO
  };

  //FILTRO DE TECNOLOGIA
  const handleLanguageFilterChange = (event) => {
    setLanguageFilter(event.target.value);
      setCurrentPage(1); //RESETEA LA PAGINA AL CAMBIAR EL FILTRO
  };

  //FILTRO DE AÑO
  const handleYearFilterChange = (event) => {
    setYearFilter(event.target.value);
    setCurrentPage(1); //RESETEA LA PAGINA AL CAMBIAR EL FILTRO
  }

  const filteredRepos = repos.filter((repo) => {
    // Filtrar por estrellas
    const starFilterCondition =
      starFilter === "" ||
      (starFilter === "+4" && repo.stargazers_count >= 4) ||
      repo.stargazers_count === parseInt(starFilter, 10);
  
    // Filtrar por lenguaje
    const languageFilterCondition =
      languageFilter === "" ||
      (repo.language && repo.language.toLowerCase() === languageFilter.toLowerCase());
  
    // Filtrar por año
      const yearFilterCondition =
      yearFilter === "" ||
      (repo.created_at && new Date(repo.created_at).getFullYear() === parseInt(yearFilter, 10));

    return starFilterCondition && languageFilterCondition && yearFilterCondition;
  });
  
  // Paginación
  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = filteredRepos.slice(indexOfFirstRepo, indexOfLastRepo);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  return (
    <div>
      <h2>Repositorios con más participación de {username}</h2>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel id="star-filter-label">Filtrar por Estrellas</InputLabel>
        <Select
          labelId="star-filter-label"
          id="star-filter"
          value={starFilter}
          label="Filtrar por Estrellas"
          onChange={handleStarFilterChange}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="1">1</MenuItem>
          <MenuItem value="2">2</MenuItem>
          <MenuItem value="3">3</MenuItem>
          <MenuItem value="+4">+4</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel id="language-filter-label">Filtrar por Tecnología</InputLabel>
        <Select
          labelId="language-filter-label"
          id="language-filter"
          value={languageFilter}
          label="Filtrar por Lenguaje"
          onChange={handleLanguageFilterChange}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="JavaScript">JavaScript</MenuItem>
          <MenuItem value="Python">Python</MenuItem>
          <MenuItem value="CSS">CSS</MenuItem>
          <MenuItem value="VUE">VUE</MenuItem>
          <MenuItem value="SCSS">SCSS</MenuItem>
          <MenuItem value="HTML">HTML</MenuItem>
          {/*AÑADIR LAS TECNOLOGIAS QUE SE REQUIERA*/}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel id="year-filter-label">Filtrar por Año</InputLabel>
        <Select
          labelId="year-filter-label"
          id="year-filter"
          value={yearFilter}
          label="Filtrar por Año"
          onChange={handleYearFilterChange}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="2024">2024</MenuItem>
          <MenuItem value="2023">2023</MenuItem>
          <MenuItem value="2022">2022</MenuItem>
          <MenuItem value="2021">2021</MenuItem>
          <MenuItem value="2020">2020</MenuItem>
          <MenuItem value="2019">2019</MenuItem>
          <MenuItem value="2018">2018</MenuItem>
          <MenuItem value="2017">2017</MenuItem>
        </Select>
      </FormControl>

      {currentRepos.length > 0 ? (
        <ul>
          {currentRepos.map((repo) => (
            <li key={repo.id}>
              {repo.name} - Tamaño: {repo.size}, 
              Estrellas: {repo.stargazers_count}, 
              Creado: {new Date(repo.created_at).toLocaleDateString()}, 
              Tecnología Utilizada: {repo.language}, 
              Última actualización: {new Date(repo.updated_at).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
              <p>No se encontraron repositorios que cumplan con los filtros seleccionados.</p>
          )}

      <Pagination
        count={Math.ceil(filteredRepos.length / reposPerPage)}
        page={currentPage}
        onChange={(event, page) => paginate(page)}
        color="primary"
        sx={{ marginTop: 2, display: "flex", justifyContent: "center"}}
      />
    </div>
  );
};

RepoList.propTypes = {
  username: PropTypes.string.isRequired,
};

export default RepoList;
