import { Grid } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {

    return (
        <Grid container>
            <h1><Link to={'/quiz_home'}>퀴즈...</Link></h1>
        </Grid>
    );
};

export default Home;